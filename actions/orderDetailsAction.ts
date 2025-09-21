"use server"
// actions/orderActions.ts
import prisma from "@/lib/prisma";

// For a user dashboard: fetch all orders for a specific user
export async function getUserOrders(userId: string) {
  if (!userId) throw new Error("User ID is required");

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
      Payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}

// For an admin dashboard: fetch all orders
export async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
      Payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}
