"use client";

import React, { useState } from "react";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useUserWishlist,
} from "@/hooks/useWishlist";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function WishlistButton({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  const { data: wishlist = [], isLoading } = useUserWishlist(userId);

  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const [isAnimating, setIsAnimating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // check if product already in wishlist
  const isInWishlist = wishlist?.some((w) => w.productId === productId);

  const handleClick = () => {
    if (!userId) {
      toast.error("Please login to manage wishlist.");
      return;
    }

    setIsAnimating(true);
    setIsProcessing(true);

    if (isInWishlist) {
      removeFromWishlist.mutate(
        { userId, productId },
        {
          onSuccess: () => toast.success("Removed from wishlist ❤️"),
          onError: () => toast.error("Failed to remove from wishlist."),
          onSettled: () => setIsProcessing(false),
        }
      );
    } else {
      addToWishlist.mutate(
        { userId, productId },
        {
          onSuccess: () => toast.success("Added to wishlist 💖"),
          onError: () => toast.error("Failed to add to wishlist."),
          onSettled: () => setIsProcessing(false),
        }
      );
    }
  };

  if (isLoading) {
    return (
      <button disabled className="w-full flex items-center justify-center">
        <Heart className="w-6 h-6 text-gray-400 animate-pulse" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className="w-full flex items-center justify-center"
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {isProcessing ? (
          // Spinning heart while wishlisting
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Heart className="w-6 h-6 text-pink-500" />
          </motion.div>
        ) : (
          <Heart
            className={`w-6 h-6 transition-colors duration-300 ${
              isInWishlist ? "fill-red-600 text-red-600" : "text-gray-600"
            }`}
          />
        )}
      </motion.div>
    </button>
  );
}
