"use server";

import prisma from "@/lib/prisma";
import Razorpay from "razorpay";

// Define Status type to include all possible order statuses
type Status =
  | "DELIVERED"
  | "PENDING"
  | "FAILED"
  | "REFUNDED"
  | "PENDING_PAYMENT";

// Initialize Razorpay instance with proper error handling
let razorpay: Razorpay | null = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn(
      "Razorpay environment variables not found. COD-only mode enabled."
    );
  }
} catch (error) {
  console.error("Failed to initialize Razorpay:", error);
}

type PaymentMethod = "COD" | "RAZORPAY";

interface CheckoutResult {
  success: boolean;
  error?: string;
  order?: any;
  payment?: any;
  razorpayOrder?: any;
}

export async function checkout(
  userId: string,
  paymentMethod: PaymentMethod
): Promise<CheckoutResult> {
  try {
    // 1. Fetch user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    // 2. Calculate total
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );

    const totalAmount = Math.round(Number(totalPrice));

    if (paymentMethod === "COD") {
      // For COD: Create order with DELIVERED status and CAPTURED payment
      const order = await prisma.order.create({
        data: {
          userId,
          totalPrice,
          status: "DELIVERED", // COD orders are considered completed
          orderItems: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // COD Payment - automatically captured
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          userId,
          amount: totalPrice,
          method: "COD",
          status: "CAPTURED", // COD is automatically captured
        },
      });

      // Clear cart after successful COD order
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      return { success: true, order, payment };
    }

    if (paymentMethod === "RAZORPAY") {
      if (!razorpay) {
        return {
          success: false,
          error: "Razorpay is not properly configured. Please use COD.",
        };
      }

      try {
        // Razorpay limits: 2L (200k INR) in test mode
        const MAX_LIMIT = 200000; // in INR
        if (totalAmount > MAX_LIMIT) {
          return {
            success: false,
            error: `Amount ₹${totalAmount} exceeds Razorpay's max limit of ₹${MAX_LIMIT} per transaction in test mode. Please split the order or use COD.`,
          };
        }

        // Create order with PENDING status for online payments
        const order = await prisma.order.create({
          data: {
            userId,
            totalPrice,
            status: "PENDING", // Will be updated when payment is captured
            orderItems: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
        });

        // Create Razorpay Order
        const razorpayOrder = await razorpay.orders.create({
          amount: totalAmount * 100, // paise
          currency: "INR",
          receipt: `order_${order.id}`,
        });

        // Create payment record in DB with CREATED status
        const payment = await prisma.payment.create({
          data: {
            orderId: order.id,
            userId,
            amount: totalAmount,
            method: "RAZORPAY",
            status: "CREATED", // Will be updated when payment is captured
            razorpayOrderId: razorpayOrder.id,
            receipt: razorpayOrder.receipt,
          },
        });

        // DON'T clear cart here - wait for payment verification
        return { success: true, order, payment, razorpayOrder };
      } catch (razorpayError) {
        console.error("Razorpay order creation failed:", razorpayError);
        return {
          success: false,
          error: "Failed to create Razorpay order. Please try COD.",
        };
      }
    }

    return { success: false, error: "Invalid payment method" };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: "Checkout failed. Please try again.",
    };
  }
}

// Updated function to verify Razorpay payment and update order status
export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay key secret not configured");
    }

    const crypto = require("crypto");
    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpaySignature;

    if (isAuthentic) {
      // Start transaction to update both payment and order status
      const result = await prisma.$transaction(async (tx) => {
        // Update payment status to CAPTURED
        const updatedPayment = await tx.payment.updateMany({
          where: { razorpayOrderId },
          data: {
            status: "CAPTURED",
            razorpayPaymentId,
            razorpaySignature,
          },
        });

        // Get the payment to find the associated order
        const payment = await tx.payment.findFirst({
          where: { razorpayOrderId },
          include: { order: { include: { user: true } } },
        });

        if (payment) {
          // Update order status to DELIVERED when payment is captured
          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: "DELIVERED" },
          });

          // Clear cart after successful payment
          await tx.cartItem.deleteMany({
            where: {
              cart: {
                userId: payment.userId,
              },
            },
          });
        }

        return { payment, updatedPayment };
      });

      return { success: true, payment: result.payment };
    } else {
      // Mark payment as FAILED for invalid signature
      await prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: { status: "FAILED" },
      });

      // Mark order as FAILED too
      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId },
      });

      if (payment) {
        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "FAILED" },
        });
      }

      return { success: false, error: "Invalid payment signature" };
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    return { success: false, error: "Payment verification failed" };
  }
}

// New function to get order with payment status
export async function getOrderWithPaymentStatus(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        Payment: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return null;
    }

    // Determine display status based on payment status
    let displayStatus: Status = order.status as Status;
    const payment = order.Payment[0]; // Assuming one payment per order

    if (payment) {
      switch (payment.status) {
        case "CAPTURED":
          displayStatus = "DELIVERED";
          break;
        case "CREATED":
        case "AUTHORIZED":
          displayStatus = "PENDING_PAYMENT";
          break;
        case "FAILED":
          displayStatus = "FAILED";
          break;
        case "REFUNDED":
          displayStatus = "REFUNDED";
          break;
        default:
          displayStatus = order.status as Status;
      }
    }

    return {
      ...order,
      displayStatus,
      paymentStatus: payment?.status || "UNKNOWN",
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
