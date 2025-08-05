import { StaticImageData } from "next/image";
import image1 from "@/assets/images/dummy.jpg";

export type ShowcaseItemProps = {
  id: number;
  imageSrc: StaticImageData;
  description: string;
};

export const showcaseItems: ShowcaseItemProps[] = [
  {
    id: 1,
    imageSrc: image1,
    description: "4 نکته ی کلیدی برای چیدمان مبل 8 نفره",
  },
  {
    id: 2,
    imageSrc: image1,
    description: "چطور یک مبل با کیفیت را تشخیص دهید؟",
  },
];