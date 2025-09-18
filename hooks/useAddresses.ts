"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
} from "@/actions/addressAction";

// Address type (match Prisma model)
export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: { id: string; name: string; email: string }; // included only if adminView = true
};

export function useAddresses(adminView: boolean = false) {
  const queryClient = useQueryClient();

  // 🔹 Fetch addresses
  const addressesQuery = useQuery<Address[], Error>({
    queryKey: ["addresses", { adminView }],
    queryFn: async () => {
      try {
        const addresses = await getAddresses({ adminView });
        return addresses.map((address: any) => ({
          ...address,
          createdAt:
            address.createdAt instanceof Date
              ? address.createdAt.toISOString()
              : address.createdAt,
          updatedAt:
            address.updatedAt instanceof Date
              ? address.updatedAt.toISOString()
              : address.updatedAt,
        }));
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch addresses");
        throw error;
      }
    },
    staleTime: 1 * 1000, // 1 second
  });

  // 🔹 Add address
  const addMutation = useMutation({
    mutationFn: async (formData: FormData) => await addAddress(formData),
    onSuccess: () => {
      toast.success("Address added successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses", { adminView }] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add address");
    },
  });

  // 🔹 Update address
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) =>
      await updateAddress(id, formData),
    onSuccess: () => {
      toast.success("Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses", { adminView }] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update address");
    },
  });

  // 🔹 Delete address
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteAddress(id),
    onSuccess: () => {
      toast.success("Address deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses", { adminView }] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete address");
    },
  });

  return {
    ...addressesQuery, // { data, isLoading, isError, refetch }
    addAddress: addMutation.mutate,
    updateAddress: updateMutation.mutate,
    deleteAddress: deleteMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
