"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { SwiperListProps } from "@/lib/products-swiper-data";

export function SwiperList({ data }: SwiperListProps) {
  return (
    <div className="w-full">
      <Heading level={3}>{data.title}</Heading>
      <p className="text-primary-600 mb-2 md:mb-4">{data.description}</p>
      <Swiper
        modules={[Scrollbar]}
        spaceBetween={16}
        slidesPerView="auto"
        scrollbar={{
          draggable: true,
          dragSize: 500,
        }}
        className="w-full"
        style={{
          paddingBottom: "70px", // Space for scrollbar
        }}
      >
        {data.items.map((item, index) => (
          <SwiperSlide
            key={index}
            style={{
              width: "300px",
              height: "360px",
            }}
          >
            {item.image_info?.url && (
              <div className="w-full h-full mb-2">
                <Image
                  src={item?.image_info?.url}
                  alt={item.title || ""}
                  fill
                  className="object-cover border border-primary-400"
                />
              </div>
            )}
            <Heading level={4}>{item.title}</Heading>
            <p className="text-primary-600">{item.description}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
