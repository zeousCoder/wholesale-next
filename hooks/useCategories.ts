"use client";

import {
  postCategory,
  updateCategory,
  getCategories,
  getCategoriesWithProducts,
  deleteCategory,
} from "@/actions/categoriesAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Define Category + Product type
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  Products?: Product[];
};

export function useCategories() {
  const queryClient = useQueryClient();

  // 📌 Fetch categories (without products)
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await getCategories();
      return data.map((cat) => ({
        ...cat,
        createdAt:
          cat.createdAt instanceof Date
            ? cat.createdAt.toISOString()
            : cat.createdAt,
        updatedAt:
          cat.updatedAt instanceof Date
            ? cat.updatedAt.toISOString()
            : cat.updatedAt,
      }));
    },
    staleTime: 1 * 1000, // 1 sec cache
  });

  // 📌 Fetch categories with products
  const {
    data: categoriesWithProducts,
    isLoading: isLoadingCategoriesWithProducts,
    isError: isErrorCategoriesWithProducts,
    error: errorCategoriesWithProducts,
  } = useQuery<Category[]>({
    queryKey: ["categories-with-products"],
    queryFn: async () => {
      const data = await getCategoriesWithProducts();
      return data.map((cat) => ({
        ...cat,
        createdAt:
          cat.createdAt instanceof Date
            ? cat.createdAt.toISOString()
            : cat.createdAt,
        updatedAt:
          cat.updatedAt instanceof Date
            ? cat.updatedAt.toISOString()
            : cat.updatedAt,
        Products: cat.Products
          ? cat.Products.map((prod) => ({
              ...prod,
              createdAt:
                prod.createdAt instanceof Date
                  ? prod.createdAt.toISOString()
                  : prod.createdAt,
              updatedAt:
                prod.updatedAt instanceof Date
                  ? prod.updatedAt.toISOString()
                  : prod.updatedAt,
            }))
          : [],
      }));
    },
    staleTime: 60 * 1000,
  });

  // 📌 Add Category
  const { mutate: addCategory, isPending: isAdding } = useMutation({
    mutationFn: (name: string) => postCategory(name),
    onSuccess: () => {
      toast.success("Category added successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-with-products"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to add category ❌");
    },
  });

  // 📌 Update Category
  const { mutate: editCategory, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, name),
    onSuccess: () => {
      toast.success("Category updated successfully ✏️");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-with-products"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update category ❌");
    },
  });

  // 📌 Delete Category
  const { mutate: removeCategory, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted 🗑️");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-with-products"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete category ❌");
    },
  });

  return {
    // fetch states
    categories,
    isLoadingCategories,
    isErrorCategories,
    errorCategories,
    categoriesWithProducts,
    isLoadingCategoriesWithProducts,
    isErrorCategoriesWithProducts,
    errorCategoriesWithProducts,

    // mutations
    addCategory,
    isAdding,
    editCategory,
    isUpdating,
    removeCategory,
    isDeleting,
  };
}
