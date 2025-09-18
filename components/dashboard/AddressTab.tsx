"use client";

import React from "react";
import { useAddresses, Address } from "@/hooks/useAddresses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, CalendarDays, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddressTab() {
  const {
    data: addresses,
    isLoading,
    isError,
    deleteAddress,
    isDeleting,
  } = useAddresses(true);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 p-4">Failed to load addresses</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
        <h1 className="text-2xl font-bold">Addresses</h1>
        <p className="text-sm text-gray-500">
          Overview of saved delivery addresses
        </p>
      </div>

      {/* Table for large screens */}
      <div className="hidden md:block rounded-lg border shadow-sm">
        <ScrollArea>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Street</TableHead>
                <TableHead className="text-left">City</TableHead>
                <TableHead className="text-left">State</TableHead>
                <TableHead className="text-left">Pincode</TableHead>
                <TableHead className="text-left">Phone</TableHead>
                <TableHead className="text-left">Added</TableHead>
                <TableHead className="text-left">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses?.map((address: Address) => (
                <TableRow key={address.id} className="transition">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                      {address.street}
                    </div>
                  </TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.pincode}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-pink-600" />
                      {address.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="flex gap-2 items-center"
                    >
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {new Date(address.createdAt).toLocaleDateString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteAddress(address.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Mobile view */}
      <div className="flex flex-col gap-4 md:hidden">
        {addresses?.map((address: Address) => (
          <div
            key={address.id}
            className="flex flex-col p-4 border rounded-lg shadow-sm  relative"
          >
            <span className="font-semibold text-lg flex gap-2 items-center">
              <MapPin className="h-4 w-4 text-indigo-600" /> {address.street}
            </span>
            <span className=" text-sm">
              {address.city}, {address.state} - {address.pincode}
            </span>
            <span className=" text-sm flex gap-1 items-center">
              <Phone className="h-4 w-4 text-pink-600" />
              {address.phone}
            </span>
            <Badge variant="outline" className="mt-2 flex gap-2 items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              {new Date(address.createdAt).toLocaleDateString()}
            </Badge>

            {/* Delete button */}
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-3 right-3"
              onClick={() => deleteAddress(address.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
