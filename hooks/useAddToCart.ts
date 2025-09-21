"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addToCart,
  removeFromCart,
  decreaseCartItemQuantity,
  getCartByUser,
} from "@/actions/addToCartAction";

export function useCart(userId: string) {
  const queryClient = useQueryClient();

  // Define a type for the cart and its items
  type CartItem = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    quantity: number;
    cartId: string;
  };

  type Cart = {
    id: string;
    userId: string;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
  };

  // Fetch cart for user with 1-second staleTime
  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useQuery<Cart>({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const result = await getCartByUser(userId);
      if (!result) {
        throw new Error("Cart not found");
      }
      return result;
    },
    enabled: !!userId,
    staleTime: 1000,
  });

  // Add item mutation
  const addItem = useMutation<
    {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      productId: string;
      quantity: number;
      cartId: string;
    },
    Error,
    { productId: string; quantity?: number }
  >({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      return await addToCart(userId, productId, quantity ?? 1);
    },
    onSuccess: () => {
      toast.success("Item added to cart ✅");
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add item to cart.");
    },
  });

  // Decrease quantity mutation
  const decreaseItem = useMutation<
    {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      productId: string;
      quantity: number;
      cartId: string;
    },
    Error,
    string
  >({
    mutationFn: async (productId: string) => {
      return await decreaseCartItemQuantity(userId, productId);
    },
    onSuccess: (data, productId) => {
      const cartItem = cart?.items?.find(
        (item: any) => item.productId === productId
      );
      if (cartItem && cartItem.quantity > 1) {
        toast.success("Quantity decreased ➖");
      } else {
        toast.success("Item removed from cart ❌");
      }
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to decrease item quantity.");
    },
  });

  // Remove item mutation (complete removal)
  const removeItem = useMutation<
    {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      productId: string;
      quantity: number;
      cartId: string;
    },
    Error,
    string
  >({
    mutationFn: async (productId: string) => {
      return await removeFromCart(userId, productId);
    },
    onSuccess: () => {
      toast.success("Item removed from cart ❌");
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to remove item from cart.");
    },
  });

  return {
    cart,
    isLoading,
    isError,
    error,
    addToCart: addItem.mutate,
    decreaseQuantity: decreaseItem.mutate,
    removeFromCart: removeItem.mutate,
  };
}
