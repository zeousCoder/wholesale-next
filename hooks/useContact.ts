"use client";

import { deleteContactMessage, getAllContactUs } from "@/actions/contactAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useContact() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["contacts"],
    queryFn: getAllContactUs,
    staleTime: 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });

  return { ...query, deleteMutation };
}
