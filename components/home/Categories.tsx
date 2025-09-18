"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { Highlighter } from "../ui/highlighter";

export default function Categories() {
  const { categories, isLoadingCategories, isErrorCategories } =
    useCategories();

  if (isLoadingCategories) {
    return null;
  }

  if (isErrorCategories) {
    return null;
  }

  return (
    <div className="w-full flex  flex-col gap-6">
      <span className="flex gap-4 items-center ">
        <p className="lg:text-2xl text-base font-bold">
          <Highlighter action="highlight" color="#FF9800">
            All Category -
          </Highlighter>
        </p>
        <Highlighter action="underline" color="#87CEFA">
          See all your desired category
        </Highlighter>
      </span>
      {categories && categories.length > 0 ? (
        <div className="flex flex-wrap items-center gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              aria-label={`View products in ${cat.name}`}
            >
              <div>
                <div className="flex items-center gap-2 text-md font-semibold">
                  {cat.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
