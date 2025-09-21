"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllProducts,
  addProducts,
  updateProduct,
  deleteProduct,
} from "@/actions/productsAction";

export function useProducts() {
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 1000,
  });

  // Show toast if error occurs
  if (isError && error) {
    toast.error(
      "Failed to fetch products: " + (error as any)?.message || "Unknown error"
    );
  }

  // Validation function for form data
  const validateProductForm = (formData: FormData): string[] => {
    const errors: string[] = [];

    if (!formData.get("name")) {
      errors.push("Product name is required");
    }

    if (!formData.get("slug")) {
      errors.push("Product slug is required");
    }

    if (!formData.get("description")) {
      errors.push("Product description is required");
    }

    const price = formData.get("price") as string;
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errors.push("Valid price is required");
    }

    if (!formData.get("categoryId")) {
      errors.push("Category is required");
    }

    const images = formData.getAll("images");
    if (images.length === 0) {
      errors.push("At least one product image is required");
    }

    const colors = formData.getAll("color") as string[];
    const stocks = formData.getAll("colorStock") as string[];

    if (colors.length === 0) {
      errors.push("At least one color variant is required");
    }

    colors.forEach((color, index) => {
      if (!color.trim()) {
        errors.push(`Color #${index + 1} cannot be empty`);
      }

      const stock = stocks[index];
      if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
        errors.push(
          `Stock for color "${color}" must be a valid number (0 or greater)`
        );
      }
    });

    return errors;
  };

  // ✅ Create product mutation with validation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const errors = validateProductForm(formData);

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
        throw new Error("Validation failed: " + errors.join(", "));
      }

      return await addProducts(formData);
    },
    onMutate: async (formData: FormData) => {
      // Only do optimistic update if validation passes
      const errors = validateProductForm(formData);
      if (errors.length > 0) {
        return { previousProducts: null }; // Don't do optimistic update
      }

      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData<any[]>(["products"]);

      const colors = formData.getAll("color") as string[];
      const stocks = formData.getAll("colorStock") as string[];

      const optimisticProduct = {
        id: "temp-" + Date.now(),
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string),
        images: formData.getAll("images"),
        categoryId: formData.get("categoryId"),
        sizes: formData.getAll("sizes"),
        variants: colors.map((color, idx) => ({
          color,
          stock: parseInt(stocks[idx] || "0"),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData(["products"], (old: any[] = []) => [
        optimisticProduct,
        ...old,
      ]);

      return { previousProducts };
    },
    onSuccess: () => {
      toast.success("Product created successfully! ✅");
    },
    onError: (error: any, _variables, context) => {
      const errorMessage = error?.message || "Failed to create product";

      if (!errorMessage.includes("Validation failed")) {
        toast.error(errorMessage);
      }

      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // ✅ Update product mutation with validation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      if (!id) {
        throw new Error("Product ID is required for update");
      }

      const errors = validateProductForm(formData);

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
        throw new Error("Validation failed: " + errors.join(", "));
      }

      return await updateProduct(id, formData);
    },
    onMutate: async ({ id, formData }) => {
      // Only do optimistic update if validation passes
      const errors = validateProductForm(formData);
      if (errors.length > 0) {
        return { previousProducts: null };
      }

      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData<any[]>(["products"]);

      const colors = formData.getAll("color") as string[];
      const stocks = formData.getAll("colorStock") as string[];

      queryClient.setQueryData(["products"], (old: any[] = []) =>
        old.map((p) =>
          p.id === id
            ? {
                ...p,
                name: formData.get("name") || p.name,
                slug: formData.get("slug") || p.slug,
                description: formData.get("description") || p.description,
                price: formData.get("price")
                  ? parseFloat(formData.get("price") as string)
                  : p.price,
                images:
                  formData.getAll("images")?.length > 0
                    ? formData.getAll("images")
                    : p.images,
                categoryId: formData.get("categoryId") || p.categoryId,
                sizes:
                  formData.getAll("sizes")?.length > 0
                    ? formData.getAll("sizes")
                    : p.sizes,
                variants:
                  colors.length > 0
                    ? colors.map((color, idx) => ({
                        color,
                        stock: parseInt(stocks[idx] || "0"),
                      }))
                    : p.variants,
                updatedAt: new Date(),
              }
            : p
        )
      );

      return { previousProducts };
    },
    onSuccess: () => {
      toast.success("Product updated successfully! ✅");
    },
    onError: (error: any, _variables, context) => {
      const errorMessage = error?.message || "Failed to update product";

      if (!errorMessage.includes("Validation failed")) {
        toast.error(errorMessage);
      }

      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // ✅ Delete mutation with confirmation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!id) {
        throw new Error("Product ID is required for deletion");
      }

      const res = await deleteProduct(id);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete product");
      }
      return res.message;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData<any[]>(["products"]);

      queryClient.setQueryData(["products"], (old: any[] = []) =>
        old.filter((p) => p.id !== id)
      );

      return { previousProducts };
    },
    onSuccess: (message) => {
      toast.success(message || "Product deleted successfully! 🗑️");
    },
    onError: (error: any, _variables, context) => {
      toast.error(error?.message || "Failed to delete product");

      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products,
    isLoading,
    isError,
    error,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
