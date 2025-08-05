import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { BannerData } from "@/types/about-us";

interface BannerProps {
  data: BannerData;
  className?: string;
}

export function Banner({ data, className }: BannerProps) {
  return (
    <div className="relative w-full h-56 lg:h-60">
      {data.image_info && (
        <Image
          src={data.image_info?.url}
          alt={data.title || "some picture"}
          className="absolute w-full h-full rounded-sm object-cover"
          fill
        />
      )}
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div
        className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center  ${className}`}
      >
        <Heading className="text-primary-100 mb-8" level={1}>
          {data.title}
        </Heading>
        <Heading className="text-primary-100 mb-8 text-nowrap" level={2}>
          {data.subtitle}
        </Heading>
        <p className="text-primary-100">{data.description}</p>
        {data.url && <Link href={data.url}>{data.subtitle}</Link>}
      </div>
    </div>
  );
}
