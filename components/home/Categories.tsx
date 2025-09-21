"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { Highlighter } from "../ui/highlighter";

export default function Categories() {
  const { categories, isLoadingCategories, isErrorCategories } =
    useCategories();

  if (isLoadingCategories) {
    return <></>;
  }

  if (isErrorCategories) {
    return <></>;
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
              <div
                className="relative text-md font-semibold cursor-pointer
  after:content-[''] after:absolute after:left-0 after:bottom-0 
  after:w-0 after:h-[2px] after:bg-foreground after:transition-all after:duration-300 
  hover:after:w-full"
              >
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
