"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUserWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import Link from "next/link";

export default function WishlistSheet({ userId }: { userId: string }) {
  const { data: wishlist = [], isLoading } = useUserWishlist(userId);
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemove = (productId: string) => {
    removeFromWishlist.mutate(
      { userId, productId },
      {
        onSuccess: () => toast.success("Removed from wishlist ❤️"),
        onError: () => toast.error("Failed to remove from wishlist."),
      }
    );
  };

  return (
    <Sheet>
      {/* Trigger button - goes in header */}
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Heart className="w-6 h-6 text-red-600" />
          {wishlist?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {wishlist.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* Wishlist drawer */}
      <SheetContent side="right" className="w-[320px] sm:w-[380px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Wishlist
            {wishlist?.length > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        <Separator />

        <div className="mt-5 space-y-4">
          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading wishlist...</p>
          ) : wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
              <Heart className="w-12 h-12 mb-2 text-gray-400" />
              <p className="text-sm">Your wishlist is empty</p>
            </div>
          ) : (
            <ul className="space-y-3 px-2">
              {wishlist.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-md transition "
                >
                  {/* Product link */}
                  <Link
                    href={`/product/${item.product?.slug}`}
                    className="flex-1 hover:underline"
                  >
                    <p className="font-medium text-sm">{item.product?.name}</p>
                  </Link>

                  {/* Remove button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemove(item.productId)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
