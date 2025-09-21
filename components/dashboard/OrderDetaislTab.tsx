"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Calendar,
  Clock,
  Package,
  CreditCard,
  User,
} from "lucide-react";
import { useOrders } from "@/hooks/useOrderDetails";

// Utility function to format date and time
const formatDateTime = (dateString: string | Date) => {
  const date = new Date(dateString);

  // Format date as DD MMM YYYY (e.g., 21 Sep 2025)
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Format time as HH:MM AM/PM (e.g., 07:11 PM)
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { formattedDate, formattedTime };
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge
      variant="secondary"
      className={`text-xs px-2 py-1 ${getStatusColor(status)}`}
    >
      {status.replace("_", " ").toUpperCase()}
    </Badge>
  );
};

// Payment status badge
const PaymentStatusBadge = ({ status }: { status: string }) => {
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "captured":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "created":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "authorized":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs px-2 py-1 ${getPaymentStatusColor(status)}`}
    >
      {status.toUpperCase()}
    </Badge>
  );
};

export default function OrderDetailsTab() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Tabs defaultValue="orders" className="w-full">

        <TabsContent value="orders" className="mt-4 px-2 ">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-auto space-y-3">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-600">Loading orders...</span>
            </div>
          ) : !orders || orders.length === 0 ? (
            <Card className="mx-auto max-w-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">
                  No orders found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Orders will appear here once placed
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className=" max-w-full grid gap-2 lg:grid-cols-2">
              {orders.map((order: any) => {
                const { formattedDate, formattedTime } = formatDateTime(
                  order.createdAt
                );

                return (
                  <Card
                    key={order.id}
                    className="hover:shadow-md transition-shadow w-full"
                  >
                    <CardHeader className="pb-3">
                      {/* Mobile: Stack everything vertically */}
                      <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <CardTitle className="text-base sm:text-lg font-semibold">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>

                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
                          <StatusBadge status={order.status} />
                          <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="font-mono">{formattedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 pt-0">
                      {/* Customer Info - Mobile optimized */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">
                            {order.user?.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {order.user?.email}
                          </div>
                        </div>
                      </div>

                      {/* Order Items - Mobile first design */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4" />
                          Items ({order.orderItems.length})
                        </h4>
                        <div className="space-y-2">
                          {order.orderItems.map((item: any) => (
                            <div
                              key={item.id}
                              className="bg-white border rounded-lg p-3 shadow-sm"
                            >
                              {/* Mobile: Stack product info vertically */}
                              <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {item.product?.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Quantity: {item.quantity}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center sm:flex-col sm:items-end sm:justify-center">
                                  <div className="text-xs text-gray-500">
                                    ₹{item.price.toFixed(2)} each
                                  </div>
                                  <div className="font-semibold text-sm">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Info - Mobile responsive */}
                      {order.Payment.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4" />
                            Payment Details
                          </h4>
                          <div className="space-y-2">
                            {order.Payment.map((payment: any) => (
                              <div
                                key={payment.id}
                                className="bg-white border rounded-lg p-3 shadow-sm"
                              >
                                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                      {payment.method}
                                    </span>
                                    <PaymentStatusBadge
                                      status={payment.status}
                                    />
                                  </div>
                                  <span className="font-semibold text-sm">
                                    ₹{payment.amount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Order Total - Prominent on mobile */}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                          <span className="font-semibold text-base">
                            Total Amount:
                          </span>
                          <span className="font-bold text-lg text-blue-600">
                            ₹{order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
