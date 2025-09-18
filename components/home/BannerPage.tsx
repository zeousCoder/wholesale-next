"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import useBannerQuery from "@/hooks/useBanner";

export default function HomeBanner() {
  const { banners, isLoading, error } = useBannerQuery();

  if (isLoading) {
    return <div className="w-full h-64 animate-pulse rounded-lg" />;
  }

  if (error) {
    console.error(error);
    return null;
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="rounded-lg overflow-hidden"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full  lg:h-80 h-30">
              <Image
                src={banner.image}
                alt="Promotional banner"
                fill
                className="lg:object-cover"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
