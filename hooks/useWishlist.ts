"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistByUser,
  getAllWishlists,
} from "@/actions/wishlistAction";

// ✅ Hook: Get wishlist of a particular user
export function useUserWishlist(userId: string) {
  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlistByUser(userId),
    enabled: !!userId, // run only when userId exists
    staleTime: 1000, // 1 sec
  });
}

// ✅ Hook: Get all wishlists (Admin/Dashboard)
export function useAllWishlists() {
  return useQuery({
    queryKey: ["all-wishlists"],
    queryFn: () => getAllWishlists(),
    staleTime: 1000, // 1 sec
  });
}

// ✅ Hook: Add to wishlist
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      productId,
    }: {
      userId: string;
      productId: string;
    }) => addToWishlist(userId, productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["all-wishlists"] });
    },
  });
}

// ✅ Hook: Remove from wishlist
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      productId,
    }: {
      userId: string;
      productId: string;
    }) => removeFromWishlist(userId, productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["all-wishlists"] });
    },
  });
}
