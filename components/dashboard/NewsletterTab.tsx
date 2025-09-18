"use client";

import React from "react";
import { useNewsletter } from "@/hooks/useNewsletter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsletterDashboard() {
  const { newsletter, isLoading, isError, removeNewsletter, isDeleting } =
    useNewsletter();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 p-4">Failed to load subscribers</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <p className="text-sm text-gray-500">
          Overview of all newsletter signups
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border shadow-sm overflow-hidden">
        <ScrollArea className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed On</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletter?.map((n: any) => (
                  <TableRow key={n.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{n.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex gap-2 items-center"
                      >
                        <CalendarDays className="h-3 w-3" />
                        {new Date(n.createdAt).toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => removeNewsletter(n.id)}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {newsletter?.map((n: any) => (
          <div
            key={n.id}
            className="rounded-lg border shadow-sm p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{n.email}</span>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <Badge
                variant="outline"
                className="flex gap-2 items-center w-fit"
              >
                <CalendarDays className="h-3 w-3" />
                {new Date(n.createdAt).toLocaleString()}
              </Badge>
            </div>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={() => removeNewsletter(n.id)}
              className="w-fit"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
