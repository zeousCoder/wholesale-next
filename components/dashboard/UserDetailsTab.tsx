"use client";

import React from "react";
import { useUserDetails, UserType } from "@/hooks/useUserDetails";
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

export default function UserDetailsTab() {
  const { data: users, isLoading, isError } = useUserDetails();

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
    return <div className="text-red-500 p-4">Failed to load users</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
        <h1 className="text-2xl font-bold">User Details</h1>
        <p className="text-sm text-gray-500">
          Overview of all registered users
        </p>
      </div>

      {/* Table for large screens */}
      <div className="hidden md:block rounded-lg border shadow-sm">
        <ScrollArea className="">
          <Table className="w-full">
            <TableHeader className="">
              <TableRow>
                <TableHead className="text-left">Name</TableHead>
                <TableHead className="text-left">Email</TableHead>
                <TableHead className="text-left">Phone</TableHead>
                <TableHead className="text-left">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user: UserType) => (
                <TableRow key={user.id} className=" transition">
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className="uppercase">{user.role}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Mobile view */}
      <div className="flex flex-col gap-4 md:hidden">
        {users?.map((user: UserType) => (
          <div
            key={user.id}
            className="flex flex-col p-4 border rounded-lg shadow-sm"
          >
            <span className="font-semibold text-lg">{user.name}</span>
            <span className="text-gray-600 text-sm">{user.email}</span>
            <span className="text-gray-600 text-sm">
              Phone: {user.phone || "N/A"}
            </span>
            <Badge className="uppercase mt-2">{user.role}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
