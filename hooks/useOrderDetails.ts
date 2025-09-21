// hooks/useOrders.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUserOrders, getAllOrders } from "@/actions/orderDetailsAction";

export function useOrders(userId?: string) {
  const query = useQuery({
    queryKey: userId ? ["orders", userId] : ["orders", "all"],
    queryFn: () => (userId ? getUserOrders(userId) : getAllOrders()),
    staleTime: 1000,
  });

  if (query.error) {
    toast.error((query.error as Error).message || "Failed to fetch orders");
  }

  return query;
}
