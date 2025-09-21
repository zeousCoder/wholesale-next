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
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Image from "next/image";

import { useCart } from "@/hooks/useAddToCart";
import { useSession } from "@/lib/auth-client";
import CheckoutButton from "./CheckoutButton";

export default function CartSheet({ userId }: { userId: string }) {
  const { data: session } = useSession();
  const realUserId = session?.user?.id || userId;
  const { cart, isLoading, addToCart, decreaseQuantity, removeFromCart } =
    useCart(realUserId);

  const handleRemove = (productId: string) => {
    removeFromCart(productId, {
      onSuccess: () => toast.success("Removed from cart 🛒"),
      onError: () => toast.error("Failed to remove from cart."),
    });
  };

  const handleIncrease = (productId: string) => {
    addToCart(
      { productId, quantity: 1 },
      { onError: () => toast.error("Failed to increase quantity.") }
    );
  };

  const handleDecrease = (productId: string) => {
    decreaseQuantity(productId, {
      onError: () => toast.error("Failed to decrease quantity."),
    });
  };

  const totalPrice =
    cart?.items?.reduce(
      (total: number, item: any) => total + item.quantity * item.product.price,
      0
    ) ?? 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          {(cart?.items?.length ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {cart?.items?.length ?? 0}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[320px] sm:w-[380px] flex flex-col h-full"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Cart
            {(cart?.items?.length ?? 0) > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cart?.items?.length ?? 0}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        <Separator />

        {/* Scrollable content */}
        <div className="mt-5 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="animate-spin" />
            </div>
          ) : !cart?.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
              <ShoppingCart className="w-12 h-12 mb-2 text-gray-400" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-3 px-2 pb-20">
              {cart.items.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  {item.product?.images?.[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product?.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover border"
                    />
                  )}

                  <div className="flex-1">
                    <Link
                      href={`/product/${item.product?.slug}`}
                      className="hover:underline"
                    >
                      <p className="font-medium text-sm">
                        {item.product?.name}
                      </p>
                    </Link>
                    <p className="text-xs text-gray-500">
                      ₹{item.product?.price} × {item.quantity}
                    </p>

                    <div className="flex items-center mt-2 border rounded-md w-fit overflow-hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDecrease(item.productId)}
                        disabled={item.quantity <= 0}
                        className="h-7 w-7 p-0 hover:bg-gray-100 rounded-none border-r"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <span className="px-3 text-sm font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleIncrease(item.productId)}
                        className="h-7 w-7 p-0 hover:bg-gray-100 rounded-none border-l"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

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

        {/* Footer with fixed Checkout button */}
        {(cart?.items?.length ?? 0) > 0 && (
          <div className="p-4 border-t  sticky bottom-0">
            <div className="flex justify-between items-center font-medium text-gray-900 mb-3">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            {/* <CheckoutButton
              userId={realUserId}
              totalAmount={totalPrice}
              disabled={!(cart?.items && cart.items.length > 0)}
            /> */}
            <Link href={"/checkout"}>
            <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
