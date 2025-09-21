"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Loader2,
  Search,
  Filter,
  RefreshCw,
  ShoppingBag,
  Heart,
  Package,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useAddToCart";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface CartTabProps {
  userId: string;
}

export default function CartTab({ userId }: CartTabProps) {
  const { data: session } = useSession();
  const realUserId = session?.user?.id || userId;
  const { cart, isLoading, addToCart, decreaseQuantity, removeFromCart } =
    useCart(realUserId);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const totalPrice =
    cart?.items?.reduce(
      (total: number, item: any) => total + item.quantity * item.product.price,
      0
    ) ?? 0;

  const totalItems =
    cart?.items?.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    ) ?? 0;

  const shippingCost = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + shippingCost;

  // Filter and sort cart items
  const filteredItems = cart?.items
    ?.filter((item: any) =>
      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.sort((a: any, b: any) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-high":
          return b.product.price - a.product.price;
        case "price-low":
          return a.product.price - b.product.price;
        case "name":
          return a.product.name.localeCompare(b.product.name);
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  // Calculate cart statistics
  const cartStats = {
    totalItems: totalItems,
    uniqueProducts: cart?.items?.length || 0,
    totalValue: totalPrice,
    avgItemPrice: cart?.items?.length ? totalPrice / totalItems : 0,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading your cart...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{cartStats.totalItems}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Products</p>
                <p className="text-2xl font-bold text-green-600">
                  {cartStats.uniqueProducts}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cart Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{cartStats.totalValue.toFixed(2)}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Item Price</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{cartStats.avgItemPrice.toFixed(2)}
                </p>
              </div>
              <Heart className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      {(cart?.items?.length ?? 0) > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search cart items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Recently Added</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cart Items */}
      {!cart?.items || cart.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cart Items ({filteredItems?.length})
                  </CardTitle>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredItems?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product?.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product?.slug}`}
                        className="hover:underline"
                      >
                        <h4 className="font-semibold text-lg truncate">
                          {item.product?.name}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">
                        ₹{item.product?.price} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDecrease(item.productId)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-none border-r"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>

                          <span className="px-4 py-1 text-sm font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleIncrease(item.productId)}
                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-none border-l"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item.productId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ₹{(item.product?.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} item{item.quantity !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span
                      className={shippingCost === 0 ? "text-green-600" : ""}
                    >
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {totalPrice < 500 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 mb-2">
                      Add ₹{(500 - totalPrice).toFixed(2)} more for FREE
                      shipping!
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((totalPrice / 500) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleCheckout}
                  disabled={!(cart?.items && cart.items.length > 0)}
                  size="lg"
                >
                  <span className="flex items-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>

                {/* Additional Actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">Continue Shopping</Link>
                  </Button>

                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/profile?tab=wishlist">
                      <Heart className="w-4 h-4 mr-2" />
                      View Wishlist
                    </Link>
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700">
                    Secure Checkout Process
                  </span>
                </div>

                {/* Order Summary Note */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    Review your order details on the next page before completing
                    your purchase
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
