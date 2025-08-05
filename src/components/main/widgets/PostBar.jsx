import { Heading } from "@/components/ui/Heading";
import Image from "next/image";
import Link from "next/link";

export function PostBar({ data }) {
  console.log(data);

  return (
    <div>
      <div className="mb-3 lg:text-center">
        <Heading level={2} className="mb-1">
          {data.title}
        </Heading>
        <Heading level={3}>{data.subtitle}</Heading>
        <p className="text-primary-600">{data.description}</p>
      </div>

      <div className="grid gap-y-5 md:grid-cols-2 md:gap-x-8">
        {data.items.map((item) => {
          const content = (
            <div key={item.title}>
              {item.image_info && (
                <div className="relative h-100 mb-2">
                  <Image
                    src={item.image_info?.url}
                    alt={item.title}
                    className="rounded-sm mb-3 md:mb-4 object-cover"
                    fill
                  />
                </div>
              )}

              <Heading level={3}>{item.title}</Heading>
              <Heading level={4}>{item.subtitle}</Heading>
              <p className="text-primary-600">{item.description}</p>
            </div>
          );

          return item.url ? (
            <Link href={item.url} key={item.title}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>
    </div>
  );
}
