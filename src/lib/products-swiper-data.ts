import { StaticImageData } from "next/image";
import image1 from "@/assets/images/dummy.jpg";

interface Item {
  title?: string;
  description?: string;
  image_info?: {
    url?: string | StaticImageData;
  };
}

interface Data {
  title?: string;
  description?: string;
  items: Item[];
}

export interface SwiperListProps {
  data: Data;
}

export const productsSwiperList: Data = {
  title: "شکل ها و اندازه های دیگر",
  items: [
    {
      image_info: {
        url: image1,
      },
    },
    {
      image_info: {
        url: image1,
      },
    },
    {
      image_info: {
        url: image1,
      },
    },
    {
      image_info: {
        url: image1,
      },
    },
    {
      image_info: {
        url: image1,
      },
    },
    {
      image_info: {
        url: image1,
      },
    },
    {
      image_info: {
        url: image1,
      },
    },
    {
      image_info: {
        url: image1,
      },
    },
  ],
};
