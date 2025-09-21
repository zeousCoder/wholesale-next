"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useAddToCart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  userId: string;
  productId: string;
  className?: string;
}

export default function AddToCartButton({
  userId,
  productId,
  className,
}: AddToCartButtonProps) {
  const { addToCart, decreaseQuantity, cart } = useCart(userId);
  const [isAdding, setIsAdding] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);

  // Get current quantity in cart
  const cartItem = cart?.items?.find(
    (item: any) => item.productId === productId
  );
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(
      { productId, quantity: 1 },
      {
        onSettled: () => setIsAdding(false),
      }
    );
  };

  const handleDecreaseQuantity = async () => {
    setIsDecreasing(true);
    decreaseQuantity(productId, {
      onSettled: () => setIsDecreasing(false),
    });
  };

  // If no quantity in cart, show "Add to Cart" button
  if (currentQuantity === 0) {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={cn(
          "w-full bg-green-600 hover:bg-green-700 text-white font-medium",
          className
        )}
        size="sm"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>
    );
  }

  // If quantity exists, show quantity controls
  return (
    <div
      className={cn(
        "flex items-center border rounded-md overflow-hidden w-full",
        className
      )}
    >
      {/* Decrease quantity */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecreaseQuantity}
        disabled={isDecreasing || currentQuantity <= 0}
        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-none border-r"
      >
        <Minus className="w-4 h-4" />
      </Button>

      {/* Current quantity */}
      <div className="flex items-center justify-center w-full h-8 px-2  text-sm font-medium text-gray-900">
        {currentQuantity}
      </div>

      {/* Increase quantity */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddToCart}
        disabled={isAdding}
        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-none border-l"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
