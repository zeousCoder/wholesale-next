"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function CategoriesPage() {
  const {
    categoriesWithProducts,
    isLoadingCategoriesWithProducts,
    isErrorCategoriesWithProducts,
  } = useCategories();

  if (isLoadingCategoriesWithProducts) {
    return <div></div>;
  }

  if (isErrorCategoriesWithProducts) {
    return <div></div>;
  }

  return (
    <div className="w-full px-4 flex flex-col gap-10 py-10 mx-auto max-w-[1400px]">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Explore Categories
      </h1>

      {(Array.isArray(categoriesWithProducts)
        ? categoriesWithProducts
        : []
      ).map((cat) => (
        <section key={cat.id} className="mb-12">
          {/* Category Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{cat.name}</h2>
            <Link
              href={`/category/${cat.id}`}
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Product Grid */}
          {cat.Products && cat.Products.length > 0 ? (
            <div className="flex gap-4 flex-wrap ">
              {cat.Products.map((product: any) => {
                // Convert description JSON to string if needed
                const description =
                  typeof product.description === "string"
                    ? product.description
                    : JSON.stringify(product.description);

                return (
                  <Link
                    href={`/product/${product.slug}`}
                    key={product.id}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-md transition p-2 flex flex-col">
                      {/* Product Info */}
                      <span className="text-sm font-medium ">
                        {product.name}
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No products available in this category.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
