"use client";

import {
  deleteBanner,
  getBanners,
  toggleBannerStatus,
  updateBannerOrder,
  uploadBanner,
} from "@/actions/bannerAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useBannerQuery() {
  const queryClient = useQueryClient();

  // 1. Fetch all banners using a useQuery hook.
  const {
    data: banners,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
    staleTime: 1 * 1000, // 1 second
  });

  // 2. Upload a new banner.
  const {
    mutate: uploadBannerMutation,
    isPending: isUploading,
    isError: isUploadError,
  } = useMutation({
    mutationFn: (formData: FormData) => uploadBanner(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  // 3. Delete a banner by its ID.
  const {
    mutate: deleteBannerMutation,
    isPending: isDeleting,
    isError: isDeleteError,
  } = useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  // 4. Toggle a banner's active status.
  const { mutate: toggleStatusMutation, isPending: isToggling } = useMutation({
    mutationFn: (id: string) => toggleBannerStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  // 5. Update the order of banners.
  const { mutate: updateOrderMutation, isPending: isUpdatingOrder } =
    useMutation({
      mutationFn: (orderedIds: string[]) => updateBannerOrder(orderedIds),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["banners"] });
      },
    });

  return {
    banners,
    isLoading,
    error,
    uploadBanner: uploadBannerMutation,
    isUploading,
    isUploadError,
    deleteBanner: deleteBannerMutation,
    isDeleting,
    isDeleteError,
    toggleBannerStatus: toggleStatusMutation,
    isToggling,
    updateBannerOrder: updateOrderMutation,
    isUpdatingOrder,
  };
}
