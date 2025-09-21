"use client";
import ProductCard from "@/components/layout/ProductCard";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Highlighter } from "@/components/ui/highlighter";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useParams } from "next/navigation";
import React from "react";

export default function page() {
  const { id } = useParams();
  const { products } = useProducts();
  const { categories } = useCategories();

  const categoryName = categories?.find((cat) => cat.id === id)?.name;
  const filteredProducts = products?.filter((prod) => prod?.categoryId === id);
  return (
    <div className="flex w-full mx-auto px-4 py-10 flex-col gap-6">
      <div className="flex items-center">
        <span className="flex gap-4 items-center ">
          <p className="lg:text-2xl text-base font-bold">
            <Highlighter action="highlight" color="#FF9800">
              All Products Under this -
            </Highlighter>
          </p>
          <Highlighter action="underline" color="#87CEFA">
            {categoryName || "Category"}
          </Highlighter>
        </span>
      </div>
      {products?.length === 0 ? (
        <div className="text-red-500">No products under this Category</div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          {filteredProducts?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
