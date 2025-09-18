"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUserDetails } from "@/actions/userPhoneAction";

export type UserType = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "USER";
};

export const useUserDetails = () => {
  return useQuery<UserType[], Error>({
    queryKey: ["userDetails"],
    queryFn: async () => {
      try {
        const users = await getUserDetails();

        // Normalize phone to undefined if null
        return users.map((user: any) => ({
          ...user,
          phone: user.phone ?? undefined,
        }));
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch user details");
        throw error;
      }
    },

    staleTime: 1 * 1000,
  });
};
