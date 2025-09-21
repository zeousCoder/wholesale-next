"use client";

import React from "react";
import { useUserWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function WishlistTab() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Handle case when user is not logged in
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center py-10  text-sm">
        <Heart className="w-12 h-12 mb-2 " />
        <p>Please log in to view your wishlist.</p>
      </div>
    );
  }

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
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-600" />
        Your Wishlist
        {wishlist.length > 0 && (
          <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            {wishlist.length}
          </span>
        )}
      </h2>

      <Separator />

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <p className=" text-sm">Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center  py-10">
            <Heart className="w-12 h-12 mb-2 " />
            <p className="text-sm">Your wishlist is empty</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {wishlist.map((item: any) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                {/* Product info */}
                <Link
                  href={`/product/${item.product.slug}`}
                  className="flex-1 flex items-center gap-3 hover:underline"
                >
                  {/* Product Image */}
                  {item.product.images && item.product.images[0] && (
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-contain rounded"
                        priority
                      />
                    </div>
                  )}

                  {/* Product name & price */}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {item.product.name}
                    </span>
                    {item.product.price && (
                      <span className="text-xs ">
                        ₹{item.product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
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
    </div>
  );
}
