import BannerPage from "@/components/home/BannerPage";
import Categories from "@/components/home/Categories";
import React from "react";

export default function Home() {
  return (
    <div className="w-full  px-4 flex flex-col gap-10 py-10 mx-auto">
      <BannerPage />
      <Categories />
    </div>
  );
}
