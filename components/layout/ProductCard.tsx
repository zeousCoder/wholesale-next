"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import React from "react";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCardButton";

export default function ProductCard({ product }: { product: any }) {
  const { data: session } = useSession();
  const userId = session?.user?.id; // ✅ get logged-in userId

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { status: "Out of Stock", color: "bg-red-600 text-white" };
    if (stock > 0 && stock < 5)
      return { status: "Few Left", color: "bg-yellow-500 text-black" };
    if (stock >= 5 && stock < 20)
      return { status: "Available", color: "bg-gray-400 text-black" };
    return { status: "Plenty", color: "bg-green-600 text-white" };
  };

  const getColorBackground = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      orange: "bg-orange-500",
      black: "bg-black",
      white: "bg-white border-2 border-gray-300",
      gray: "bg-gray-500",
      brown: "bg-amber-800",
      navy: "bg-blue-900",
    };
    return colorMap[colorName.toLowerCase()] || "bg-gray-300";
  };

  return (
    <Card className="w-full flex flex-col items-center shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Image with wishlist button in top-right */}
      <div className="relative w-full h-[160px] bg-white">
        <Image
          src={product.images[0] || ""}
          alt={`${product.name} image`}
          fill
          className="object-contain"
          priority
        />
        {userId && (
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton userId={userId} productId={product.id} />
          </div>
        )}
      </div>

      {/* Product name */}
      <div className="flex flex-col items-center p-2">
        <div className="font-semibold text-sm text-center">{product.name}</div>
      </div>

      {/* Footer with color variants and stock */}
      <CardContent className="flex flex-col gap-3 w-full">
        <div className="flex flex-wrap gap-3 justify-center">
          {product.variants?.map((variant: any) => {
            const stockInfo = getStockStatus(variant.stock);
            return (
              <div
                key={variant.id}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${getColorBackground(
                      variant.color
                    )}`}
                  ></div>
                  <span className="text-xs font-medium capitalize">
                    {variant.color}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full font-semibold text-xs ${stockInfo.color}`}
                >
                  {stockInfo.status}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between w-full gap-2">
        <AddToCartButton userId={userId ?? ""} productId={product.id} />
      </CardFooter>
    </Card>
  );
}
