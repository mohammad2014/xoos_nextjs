import Image from "next/image";
import Link from "next/link";
import CustomButton from "../CustomButton";
import { Heading } from "@/components/ui/Heading";

export function Banner({ data }) {
  const content = (
    <div className="relative w-full h-100">
      <Image
        src={data.image_info?.url}
        alt={data.title}
        className="absolute w-full h-full rounded-sm object-cover"
        fill
      />
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center">
        <Heading className="text-primary-100 mb-8" level={1}>
          {data.title}
        </Heading>
        <CustomButton buttonLabel={data.subtitle} />
      </div>
    </div>
  );

  return data.url ? <Link href={data.url}>{content}</Link> : content;
}