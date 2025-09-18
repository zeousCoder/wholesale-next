"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getLoginDetails } from "@/actions/loginDetailsAction";

// Match your Prisma model
export type LoginSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

export function useLoginDetails() {
  return useQuery<LoginSession[], Error>({
    queryKey: ["loginDetails"],
    queryFn: async () => {
      try {
        const sessions = await getLoginDetails();
        return sessions.map((s: any) => ({
          ...s,
          createdAt:
            s.createdAt instanceof Date
              ? s.createdAt.toISOString()
              : s.createdAt,
          updatedAt:
            s.updatedAt instanceof Date
              ? s.updatedAt.toISOString()
              : s.updatedAt,
          expiresAt:
            s.expiresAt instanceof Date
              ? s.expiresAt.toISOString()
              : s.expiresAt,
        }));
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch login sessions");
        throw error;
      }
    },
    staleTime: 1 * 1000, // 1 second
  });
}
