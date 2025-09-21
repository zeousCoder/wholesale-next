"use client";
import React from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// Dummy fetchOrders function, replace with your real API call
async function fetchOrders(userId: string) {
  // TODO: Replace with real API call
  return [];
}

export default function OrdersTab() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => (userId ? fetchOrders(userId) : []),
    enabled: !!userId,
    staleTime: 1000,
  });

  if (!userId) {
    return (
      <div className="p-6 text-center">Please log in to view your orders.</div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">Failed to load orders.</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-gray-500">No orders found.</div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order: any) => (
            <li
              key={order.id}
              className="border rounded p-3 flex flex-col gap-1"
            >
              <div className="font-medium">Order #{order.id}</div>
              <div>Status: {order.status}</div>
              <div>Total: ₹{order.totalPrice}</div>
              <Link
                href={`/orders/${order.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
