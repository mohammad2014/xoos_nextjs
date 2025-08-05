"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { SliderItemFrom } from "@/models/slider-model";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";

type BannerSliderProps = {
  slides: SliderItemFrom[];
};

export default function BannerSlider({ slides }: BannerSliderProps) {
  console.log(slides);

  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={30}
      slidesPerView={1}
      navigation={{
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom",
      }}
      loop={true}
      className="relative"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.priority}>
          <div className="relative flex justify-center items-center h-[calc(100vh-4.5rem)]">
              <Image
                src={slide.image_info.url}
                alt={slide.image_info.description || ""}
                fill
                className="w-full h-svh object-cover z-0 absolute"
              />
            <div className="absolute inset-0 bg-black/20 z-0" />
            <div className="text-primary-100 absolute top-1/2 left-1/2 text-center -translate-y-1/2 -translate-x-1/2 z-10">
              <Heading
                level={1}
                className="mb-2 text-primary-0 text-[calc(1.5rem+0.3vw)]"
              >
                {slide.title}
              </Heading>
              <Heading level={2} className="mb-8 text-primary-0">
                {slide?.description}
              </Heading>
              {slide.buttonContent && <Button>{slide?.buttonContent}</Button>}
            </div>
          </div>
        </SwiperSlide>
      ))}

      <button className="swiper-button-prev-custom absolute ltr:left-4 top-1/2 -translate-y-1/2 z-10 text-primary-100 cursor-pointer disabled:opacity-0 disabled:cursor-default rtl:rotate-180 rtl:right-4 ">
        <ChevronLeft className="w-10 h-10 stroke-1 text-primary-0" />
      </button>
      <button className="swiper-button-next-custom absolute ltr:right-4 top-1/2 -translate-y-1/2 z-10 text-primary-100 cursor-pointer disabled:opacity-0 disabled:cursor-default rtl:rotate-180 rtl:left-4">
        <ChevronRight className="w-10 h-10 stroke-1 text-primary-0" />
      </button>
    </Swiper>
  );
}
