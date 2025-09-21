"use client";
import React from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Dummy fetchPayments function, replace with your real API call
async function fetchPayments(userId: string) {
  // TODO: Replace with real API call
  return [];
}

export default function PaymentTab() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payments", userId],
    queryFn: () => (userId ? fetchPayments(userId) : []),
    enabled: !!userId,
    staleTime: 1000,
  });

  if (!userId) {
    return (
      <div className="p-6 text-center">
        Please log in to view your payment info.
      </div>
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
      <div className="p-6 text-center text-red-500">
        Failed to load payment info.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Payment Info</h2>
      {payments.length === 0 ? (
        <div className="text-gray-500">No payment records found.</div>
      ) : (
        <ul className="space-y-3">
          {payments.map((payment: any) => (
            <li
              key={payment.id}
              className="border rounded p-3 flex flex-col gap-1"
            >
              <div className="font-medium">Payment #{payment.id}</div>
              <div>Status: {payment.status}</div>
              <div>Amount: ₹{payment.amount}</div>
              <div>Method: {payment.method}</div>
              <div>Date: {payment.createdAt}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
