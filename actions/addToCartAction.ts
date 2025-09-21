"use server";

import prisma from "@/lib/prisma";

// Add item to cart
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number = 1
) {
  try {
    // Find or create a cart for the user
    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if the item already exists in the cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      // If exists, update the quantity
      const updatedItem = await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity: existingItem.quantity + quantity },
      });
      return updatedItem;
    } else {
      // If not, create a new cart item
      const newItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
        include: { product: true },
      });
      return newItem;
    }
  } catch (error: any) {
    console.error("Failed to add to cart:", error);
    throw new Error(error?.message || "Failed to add item to cart.");
  }
}

// NEW: Decrease quantity by one (or remove if quantity becomes 0)
export async function decreaseCartItemQuantity(userId: string, productId: string) {
  try {
    const cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) throw new Error("Cart not found.");

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (!existingItem) throw new Error("Item not found in cart.");

    if (existingItem.quantity > 1) {
      // Decrease quantity by 1
      const updatedItem = await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity: existingItem.quantity - 1 },
      });
      return updatedItem;
    } else {
      // Remove item if quantity is 1
      const removedItem = await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
      return removedItem;
    }
  } catch (error: any) {
    console.error("Failed to decrease cart item quantity:", error);
    throw new Error(error?.message || "Failed to decrease item quantity.");
  }
}

// Remove item from cart completely
export async function removeFromCart(userId: string, productId: string) {
  try {
    const cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) throw new Error("Cart not found.");

    const removedItem = await prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    return removedItem;
  } catch (error: any) {
    console.error("Failed to remove from cart:", error);
    throw new Error(error?.message || "Failed to remove item from cart.");
  }
}

// Get all cart items for a user
export async function getCartByUser(userId: string) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    return cart;
  } catch (error: any) {
    console.error("Failed to fetch cart:", error);
    throw new Error(error?.message || "Failed to fetch cart.");
  }
}
