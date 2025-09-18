"use client";

import React from "react";
import { useLoginDetails, LoginSession } from "@/hooks/useLoginDetails";
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
import { CalendarDays, Globe, Smartphone } from "lucide-react";

export default function LoginSessionsTab() {
  const { data: sessions, isLoading, isError } = useLoginDetails();

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
    return (
      <div className="text-red-500 p-4">Failed to load login sessions</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
        <h1 className="text-2xl font-bold">Login Sessions</h1>
        <p className="text-sm text-gray-500">
          Overview of all active login sessions
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border shadow-sm overflow-hidden">
        <ScrollArea className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions?.map((session: LoginSession) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {session.user?.name || "Unknown"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {session.user?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        {session.ipAddress || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          {session.userAgent || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex gap-2 items-center"
                      >
                        <CalendarDays className="h-3 w-3" />
                        {new Date(session.createdAt).toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="flex gap-2 items-center"
                      >
                        <CalendarDays className="h-3 w-3" />
                        {new Date(session.expiresAt).toLocaleString()}
                      </Badge>
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
        {sessions?.map((session: LoginSession) => (
          <div
            key={session.id}
            className="rounded-lg border shadow-sm p-4 flex flex-col gap-3"
          >
            <div>
              <span className="font-medium">
                {session.user?.name || "Unknown"}
              </span>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-blue-500" />
              {session.ipAddress || "N/A"}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Smartphone className="h-4 w-4 text-green-500" />
              {session.userAgent || "N/A"}
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <Badge
                variant="outline"
                className="flex gap-2 items-center w-fit"
              >
                <CalendarDays className="h-3 w-3" />
                {new Date(session.createdAt).toLocaleString()}
              </Badge>
              <Badge
                variant="secondary"
                className="flex gap-2 items-center w-fit"
              >
                <CalendarDays className="h-3 w-3" />
                {new Date(session.expiresAt).toLocaleString()}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
