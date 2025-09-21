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
  Calendar,
  Clock,
  Package,
  CreditCard,
  Search,
  Filter,
  Eye,
  RefreshCw,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrderDetails";

interface OrdersTabProps {
  userId?: string;
  highlightOrderId?: string | null;
}

// Utility function to format date and time
const formatDateTime = (dateString: string | Date) => {
  const date = new Date(dateString);
  
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  return { formattedDate, formattedTime };
};

// Status badge component
const StatusBadge = ({ order }: { order: any }) => {
  let status = order.status;
  let statusColor = "bg-yellow-100 text-yellow-800";
  let StatusIcon = AlertCircle;

  const payment = order.Payment?.[0];
  
  if (payment?.status === "CAPTURED") {
    status = "COMPLETED";
    statusColor = "bg-green-100 text-green-800";
    StatusIcon = CheckCircle;
  } else if (payment?.status === "FAILED" || order.status === "FAILED") {
    status = "FAILED";
    statusColor = "bg-red-100 text-red-800";
    StatusIcon = XCircle;
  } else if (payment?.status === "CREATED" || payment?.status === "AUTHORIZED") {
    status = "PENDING PAYMENT";
    statusColor = "bg-blue-100 text-blue-800";
    StatusIcon = Clock;
  } else if (order.status === "SHIPPED" || order.status === "OUT_FOR_DELIVERY") {
    status = order.status.replace('_', ' ');
    statusColor = "bg-purple-100 text-purple-800";
    StatusIcon = Truck;
  }

  return (
    <Badge variant="secondary" className={`text-xs px-2 py-1 ${statusColor} flex items-center gap-1`}>
      <StatusIcon className="w-3 h-3" />
      {status}
    </Badge>
  );
};

// Payment method badge
const PaymentMethodBadge = ({ method, status }: { method: string; status: string }) => {
  const getMethodIcon = () => {
    switch (method?.toLowerCase()) {
      case 'cod':
        return <Truck className="w-3 h-3" />;
      case 'razorpay':
      default:
        return <CreditCard className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex items-center gap-1 text-xs text-gray-600">
      {getMethodIcon()}
      <span>{method || 'Unknown'}</span>
    </div>
  );
};

export default function OrdersTab({ userId, highlightOrderId }: OrdersTabProps) {
  // Use the hook - if userId is provided, get user orders, otherwise get all orders
  const { data: orders, isLoading, error, refetch } = useOrders(userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort orders
  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems.some((item: any) => 
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    
    // Filter by payment/order status
    const payment = order.Payment?.[0];
    switch (statusFilter) {
      case "completed":
        return matchesSearch && payment?.status === "CAPTURED";
      case "pending":
        return matchesSearch && (payment?.status === "CREATED" || payment?.status === "AUTHORIZED");
      case "failed":
        return matchesSearch && (payment?.status === "FAILED" || order.status === "FAILED");
      case "shipped":
        return matchesSearch && (order.status === "SHIPPED" || order.status === "OUT_FOR_DELIVERY");
      default:
        return matchesSearch;
    }
  })?.sort((a: any, b: any) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "amount-high":
        return b.totalPrice - a.totalPrice;
      case "amount-low":
        return a.totalPrice - b.totalPrice;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Calculate order statistics
  const orderStats = {
    total: orders?.length || 0,
    completed: orders?.filter((o: any) => o.Payment?.[0]?.status === "CAPTURED").length || 0,
    pending: orders?.filter((o: any) => 
      o.Payment?.[0]?.status === "CREATED" || o.Payment?.[0]?.status === "AUTHORIZED"
    ).length || 0,
    totalSpent: orders?.reduce((sum: number, o: any) => 
      o.Payment?.[0]?.status === "CAPTURED" ? sum + o.totalPrice : sum, 0
    ) || 0,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        <span className="ml-2 text-gray-600">
          {userId ? "Loading your orders..." : "Loading all orders..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">Failed to load orders</p>
        <p className="text-gray-500 mb-4">
          {userId 
            ? "We couldn't fetch your order history. Please try again."
            : "We couldn't fetch the orders. Please try again."
          }
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orderStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {userId ? "Total Spent" : "Total Revenue"}
                </p>
                <p className="text-2xl font-bold text-blue-600">₹{orderStats.totalSpent.toFixed(2)}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={userId 
                  ? "Search orders or products..." 
                  : "Search orders, products, or customers..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                <SelectItem value="amount-low">Amount: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {!filteredOrders?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" ? "No orders found" : "No orders yet"}
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : userId 
                  ? "When you place your first order, it will appear here"
                  : "When orders are placed, they will appear here"
              }
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => {
            const { formattedDate, formattedTime } = formatDateTime(order.createdAt);
            
            return (
              <Card 
                key={order.id} 
                id={`order-${order.id}`}
                className={`hover:shadow-md transition-all duration-200 ${
                  highlightOrderId === order.id ? 'ring-2 ring-blue-500 shadow-md' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formattedTime}
                          </div>
                          {/* Show customer info for admin view */}
                          {!userId && order.user && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">Customer: {order.user.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <StatusBadge order={order} />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info (only for admin view) */}
                  {!userId && order.user && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">{order.user.name}</span>
                        <span className="text-gray-500 text-xs ml-2">({order.user.email})</span>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Items ({order.orderItems.length})
                    </h4>
                    <div className="space-y-2">
                      {order.orderItems.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                            {item.product?.images?.[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.product?.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      
                      {order.orderItems.length > 3 && (
                        <div className="text-center text-sm text-gray-500 py-2">
                          +{order.orderItems.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment & Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      {order.Payment?.[0] && (
                        <PaymentMethodBadge 
                          method={order.Payment[0].method} 
                          status={order.Payment[0].status} 
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-xl font-bold text-blue-600">₹{order.totalPrice.toFixed(2)}</p>
                      </div>
                      
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
