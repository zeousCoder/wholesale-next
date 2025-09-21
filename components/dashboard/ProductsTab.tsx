"use client";

import React, { useState, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Edit, Trash2 } from "lucide-react";

// Helper to slugify
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductsTab() {
  const {
    products,
    isLoading,
    isError,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProducts();
  const { categories } = useCategories();

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [variants, setVariants] = useState<{ color: string; stock: string }[]>([
    { color: "", stock: "" },
  ]);
  const [sizes, setSizes] = useState<string[]>([""]);

  // Optimized handlers using useCallback to prevent re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(slugify(value));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryId(value);
  }, []);

  // Generic array change handler with useCallback
  const handleArrayChange = useCallback(<T,>(
    arr: T[],
    setArr: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    value: T
  ) => {
    const updated = [...arr];
    updated[index] = value;
    setArr(updated);
  }, []);

  const addArrayField = useCallback(<T extends unknown>(
    setArr: React.Dispatch<React.SetStateAction<T[]>>,
    defaultValue: T
  ) => {
    setArr((prev: T[]) => [...prev, defaultValue]);
  }, []);

  // Remove array field with useCallback
  const removeArrayField = useCallback(<T,>(
    arr: T[],
    setArr: React.Dispatch<React.SetStateAction<T[]>>,
    index: number
  ) => {
    if (arr.length > 1) {
      const updated = arr.filter((_, i) => i !== index);
      setArr(updated);
    }
  }, []);

  // Variant specific handlers with useCallback
  const handleVariantChange = useCallback((
    index: number,
    key: "color" | "stock",
    value: string
  ) => {
    const updated = [...variants];
    updated[index][key] = value;
    setVariants(updated);
  }, [variants]);

  // Reset form with useCallback
  const resetForm = useCallback(() => {
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setImages([""]);
    setVariants([{ color: "", stock: "" }]);
    setSizes([""]);
    setEditingProduct(null);
  }, []);

  // Load product data into form for editing
  const loadProductForEdit = useCallback((product: any) => {
    setEditingProduct(product);
    setName(product.name || "");
    setSlug(product.slug || "");
    setDescription(product.description || "");
    setPrice(product.price?.toString() || "");
    setCategoryId(product.categoryId || "");
    setImages(product.images?.length > 0 ? product.images : [""]);
    setVariants(
      product.variants?.length > 0
        ? product.variants.map((v: any) => ({
            color: v.color || "",
            stock: v.stock?.toString() || "",
          }))
        : [{ color: "", stock: "" }]
    );
    setSizes(product.sizes?.length > 0 ? product.sizes : [""]);
    setUpdateModalOpen(true);
  }, []);

  // Client-side validation
  const validateForm = useCallback((): boolean => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!description.trim()) {
      toast.error("Product description is required");
      return false;
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!categoryId) {
      toast.error("Category is required");
      return false;
    }

    const validImages = images.filter((img) => img.trim());
    if (validImages.length === 0) {
      toast.error("At least one product image is required");
      return false;
    }

    const validVariants = variants.filter(
      (v) => v.color.trim() && v.stock.trim()
    );
    if (validVariants.length === 0) {
      toast.error("At least one color variant is required");
      return false;
    }

    return true;
  }, [name, description, price, categoryId, images, variants]);

  // Build FormData
  const buildFormData = useCallback((): FormData => {
    const formData = new FormData();

    formData.set("slug", slug);
    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", price);
    formData.set("categoryId", categoryId);

    // Add valid images
    images.forEach((img) => {
      if (img.trim()) formData.append("images", img.trim());
    });

    // Add valid sizes
    sizes.forEach((s) => {
      if (s.trim()) formData.append("sizes", s.trim());
    });

    // Add variants
    variants.forEach((v) => {
      if (v.color.trim() && v.stock.trim()) {
        formData.append("color", v.color.trim());
        formData.append("colorStock", v.stock.trim());
      }
    });

    return formData;
  }, [slug, name, description, price, categoryId, images, sizes, variants]);

  // Handle create
  const handleCreate = useCallback(async () => {
    try {
      if (!validateForm()) return;

      const formData = buildFormData();
      await createProduct(formData);

      resetForm();
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Product creation failed:", error);
    }
  }, [validateForm, buildFormData, createProduct, resetForm]);

  // Handle update
  const handleUpdate = useCallback(async () => {
    try {
      if (!editingProduct?.id) {
        toast.error("Product ID is missing");
        return;
      }

      if (!validateForm()) return;

      const formData = buildFormData();
      await updateProduct({ id: editingProduct.id, formData });

      resetForm();
      setUpdateModalOpen(false);
    } catch (error) {
      console.error("Product update failed:", error);
    }
  }, [editingProduct, validateForm, buildFormData, updateProduct, resetForm]);

  // Handle delete
  const handleDelete = useCallback(async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error("Product deletion failed:", error);
    }
  }, [deleteProduct]);

  // Memoized individual input handlers to prevent re-renders
  const handleImageChange = useCallback((index: number, value: string) => {
    handleArrayChange(images, setImages, index, value);
  }, [images, handleArrayChange]);

  const handleSizeChange = useCallback((index: number, value: string) => {
    handleArrayChange(sizes, setSizes, index, value);
  }, [sizes, handleArrayChange]);

  // Form JSX (shared between create and update) - Memoized component
  const ProductForm = React.memo(({ isUpdate = false }: { isUpdate?: boolean }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Basic Info */}
      <Input
        placeholder="Product Name *"
        value={name}
        onChange={handleNameChange}
        required
        className={!name.trim() ? "border-red-300" : ""}
      />
      <Input
        value={slug}
        readOnly
        className="bg-gray-50"
        placeholder="Auto-generated slug"
      />

      <Textarea
        placeholder="Product Description *"
        value={description}
        onChange={handleDescriptionChange}
        required
        className={`sm:col-span-2 ${
          !description.trim() ? "border-red-300" : ""
        }`}
      />

      <Input
        type="number"
        step="0.01"
        placeholder="Price *"
        value={price}
        onChange={handlePriceChange}
        required
        className={
          !price || isNaN(parseFloat(price)) || parseFloat(price) <= 0
            ? "border-red-300"
            : ""
        }
      />

      {/* Category */}
      <Select value={categoryId} onValueChange={handleCategoryChange}>
        <SelectTrigger className={!categoryId ? "border-red-300" : ""}>
          <SelectValue placeholder="Select Category *" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((cat: any) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Images */}
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label className="text-sm font-medium">Product Images *</label>
        {images.map((img, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              placeholder={`Image URL ${idx + 1} ${idx === 0 ? "*" : ""}`}
              value={img}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              className={idx === 0 && !img.trim() ? "border-red-300" : ""}
            />
            {images.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField(images, setImages, idx)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addArrayField<string>(setImages, "")}
        >
          + Add Another Image
        </Button>
      </div>

      {/* Variants */}
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label className="text-sm font-medium">Product Variants *</label>
        {variants.map((v, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              placeholder="Color *"
              value={v.color}
              onChange={(e) =>
                handleVariantChange(idx, "color", e.target.value)
              }
              className={!v.color.trim() ? "border-red-300" : ""}
            />
            <Input
              placeholder="Stock *"
              type="number"
              min="0"
              value={v.stock}
              onChange={(e) =>
                handleVariantChange(idx, "stock", e.target.value)
              }
              className={
                !v.stock.trim() ||
                isNaN(parseInt(v.stock)) ||
                parseInt(v.stock) < 0
                  ? "border-red-300"
                  : ""
              }
            />
            {variants.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField(variants, setVariants, idx)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addArrayField(setVariants, { color: "", stock: "" })}
        >
          + Add Variant
        </Button>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Sizes (Optional)</label>
        {sizes.map((s, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              placeholder={`Size ${idx + 1}`}
              value={s}
              onChange={(e) => handleSizeChange(idx, e.target.value)}
            />
            {sizes.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField(sizes, setSizes, idx)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addArrayField<string>(setSizes, "")}
        >
          + Add Size
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="sm:col-span-2 flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm();
            isUpdate ? setUpdateModalOpen(false) : setCreateModalOpen(false);
          }}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={isUpdate ? handleUpdate : handleCreate}
          disabled={isUpdate ? isUpdating : isCreating}
          className="flex-1"
        >
          {(isUpdate ? isUpdating : isCreating) ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isUpdate ? "Updating..." : "Creating..."}
            </>
          ) : isUpdate ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </div>
  ));

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Products ({products?.length || 0})
        </h1>

        {/* Create Product Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm isUpdate={false} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Update Product Modal */}
      <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
          </DialogHeader>
          <ProductForm isUpdate={true} />
        </DialogContent>
      </Dialog>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((p: any) => (
          <div key={p.id} className="border rounded-lg p-4 flex flex-col gap-2">
            <div className="flex-1">
              <h2 className="font-bold">{p.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {p.description}
              </p>
              <p className="text-sm font-medium mt-1">💲 {p.price}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {p.images?.slice(0, 3).map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                ))}
                {p.images?.length > 3 && (
                  <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-xs">
                    +{p.images.length - 3}
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm">
                <span className="font-medium">Variants:</span>{" "}
                {p.variants
                  ?.map((v: any) => `${v.color} (${v.stock})`)
                  .join(", ")}
              </p>
              {p.sizes?.length > 0 && (
                <p className="mt-1 text-sm">
                  <span className="font-medium">Sizes:</span>{" "}
                  {p.sizes?.join(", ")}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadProductForEdit(p)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={() => handleDelete(p.id)}
                className="flex-1"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No products found. Create your first product!
          </p>
        </div>
      )}
    </div>
  );
}
