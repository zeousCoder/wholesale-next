"use client";

import {
  deleteNewsletter,
  getNewsletters,
  postNewsletter,
} from "@/actions/newletterAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useNewsletter() {
  const queryClient = useQueryClient();

  const {
    data: newsletter,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["newsletters"],
    queryFn: getNewsletters,
    staleTime: 1 * 1000,
  });

  const { mutate: subscribe, isPending: isSubscribing } = useMutation({
    mutationFn: (email: string) => postNewsletter(email),
    onSuccess: () => {
      toast.success("Subscribed to newsletter successfully");
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to subscribe to newsletter");
    },
  });

  const { mutate: removeNewsletter, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteNewsletter(id),
    onSuccess: () => {
      toast.success("Newsletter deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
    onError: () => {
      toast.error("Failed to delete newsletter");
    },
  });

  return {
    newsletter,
    isLoading,
    isError,
    error,
    subscribe,
    isSubscribing,
    removeNewsletter,
    isDeleting,
  };
}
