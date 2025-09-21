"use server";

import prisma from "@/lib/prisma";

export async function addToWishlist(userId: string, productId: string) {
  try {
    const wishlist = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });
    return wishlist;
  } catch (error: any) {
    if (error.code === "P2002") {
      // unique constraint (already in wishlist)
      throw new Error("Product is already in your wishlist.");
    }
    throw new Error("Failed to add to wishlist.");
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const wishlist = await prisma.wishlist.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
    return wishlist;
  } catch (error) {
    throw new Error("Failed to remove from wishlist.");
  }
}

export async function getWishlistByUser(userId: string) {
  try {
    return await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error("Failed to fetch user's wishlist.");
  }
}

export async function getAllWishlists() {
  try {
    return await prisma.wishlist.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error("Failed to fetch all wishlists.");
  }
}
