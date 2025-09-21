"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader2, CreditCard, Truck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { checkout, verifyRazorpayPayment } from "@/actions/checkoutAction";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutButtonProps {
  userId: string;
  totalAmount?: number;
  disabled?: boolean;
  // Add user data for Razorpay prefill
  userData?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function CheckoutButton({
  userId,
  totalAmount = 0,
  disabled = false,
  userData,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");
  const router = useRouter();

  const handleCODCheckout = async () => {
    try {
      setLoading(true);

      const result = await checkout(userId, "COD");

      if (result.success) {
        toast.success("Order placed successfully! 🎉", {
          description:
            "Your COD order has been confirmed. You'll pay on delivery.",
        });

        if (result.order?.id) {
          // Navigate to orders tab in profile
          router.push(`/profile?tab=orders&highlight=${result.order.id}`);
        }
      } else {
        toast.error(result.error || "Checkout failed");
      }
    } catch (error) {
      console.error("COD Checkout error:", error);
      toast.error("Something went wrong while placing your order");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayCheckout = async () => {
    try {
      setLoading(true);

      // First create order on server
      const result = await checkout(userId, "RAZORPAY");

      if (!result.success || !result.razorpayOrder) {
        toast.error(result.error || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.razorpayOrder.amount,
        currency: result.razorpayOrder.currency,
        name: "Your Store Name",
        description: `Order #${result.order.id}`,
        order_id: result.razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // Show processing toast
            toast.loading("Verifying payment...", { id: "payment-verify" });

            // Verify payment on server
            const verification = await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            toast.dismiss("payment-verify");

            if (verification.success) {
              toast.success("Payment successful! 🎉", {
                description:
                  "Your order has been confirmed and will be processed.",
              });
              // Navigate to orders tab in profile with order highlight
              router.push(`/profile?tab=orders&highlight=${result.order.id}`);
            } else {
              toast.error("Payment verification failed", {
                description: "Please contact support if amount was deducted.",
              });
              // Navigate to orders tab to show pending order
              router.push(`/profile?tab=orders`);
            }
          } catch (error) {
            toast.dismiss("payment-verify");
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed", {
              description: "Please contact support if amount was deducted.",
            });
            // Navigate to orders tab to show pending order
            router.push(`/profile?tab=orders`);
          } finally {
            setLoading(false);
          }
        },
        // Use saved user data for prefill if available
        prefill: userData
          ? {
              name: userData.name,
              email: userData.email,
              contact: userData.phone,
            }
          : {
              name: "",
              email: "",
              contact: "",
            },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay checkout error:", error);
      toast.error("Failed to initialize payment");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Payment Method Selection */}
      <div className="flex gap-2">
        <Button
          variant={paymentMethod === "COD" ? "default" : "outline"}
          size="sm"
          onClick={() => setPaymentMethod("COD")}
          className="flex-1"
          disabled={loading}
        >
          <Truck className="w-4 h-4 mr-2" />
          COD
        </Button>
        <Button
          variant={paymentMethod === "RAZORPAY" ? "default" : "outline"}
          size="sm"
          onClick={() => setPaymentMethod("RAZORPAY")}
          className="flex-1"
          disabled={loading}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Online
        </Button>
      </div>

      {/* Checkout Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        onClick={
          paymentMethod === "COD" ? handleCODCheckout : handleRazorpayCheckout
        }
        disabled={loading || disabled || totalAmount <= 0}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {paymentMethod === "COD"
              ? "Place Order (COD)"
              : `Pay ₹${totalAmount.toFixed(2)}`}
          </>
        )}
      </Button>

      {/* Payment Method Info */}
      {paymentMethod === "COD" && (
        <p className="text-xs text-gray-500 text-center">
          Pay cash when your order arrives
        </p>
      )}
      {paymentMethod === "RAZORPAY" && (
        <p className="text-xs text-gray-500 text-center">
          Secure payment via Razorpay • Cards, UPI, Net Banking
        </p>
      )}
    </div>
  );
}
