import { Heading } from "@/components/ui/Heading";
import { MenuItem } from "@/lib/menuApi";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SidebarDetailsProps = {
  selectedItem?: MenuItem;
  onClose: () => void;
};

export default function SidebarDetails({
  selectedItem,
  onClose,
}: SidebarDetailsProps) {
  if (!selectedItem) return null;

  const sortedChildren = [...(selectedItem.children ?? [])].sort((a, b) => {
    if (a.imageUrl && !b.imageUrl) return 1; // a has image, b doesn't -> a goes after
    if (!a.imageUrl && b.imageUrl) return -1;
    return 0;
  });

  return (
    <div className="h-screen absolute top-0 w-full bg-primary-0 z-50 p-5 left-0 lg:ltr:left-4/5 lg:ltr:translate-x-[20%] rtl:right-0 lg:rtl:right-4/5 lg:rtl:-translate-x-[20%] flex flex-col">
      <button
        className="cursor-pointer flex gap-x-1 items-center mb-12"
        onClick={onClose}
      >
        <ChevronRight className="w-4 h-4 ltr:rotate-180" />
        <p></p>
      </button>

      <div className="flex flex-col gap-y-1 mb-9">
        <Heading
          level={1}
          variant="secondary"
          className="text-primary-600 text-sm"
        >
          {selectedItem?.title}
        </Heading>
      </div>

      {/* 👇 scrollable area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {sortedChildren.map((child) => (
          <Link
            href={child.link}
            key={child.id}
            className="flex gap-x-3 items-center mb-6"
          >
            {child.imageUrl && (
              <Image
                src={child.imageUrl}
                alt={child.imageName ?? "تصویر بدون عنوان"}
                height={150}
                width={200}
                className="w-27 h-17 rounded-sm object-contain bg-primary-100 p-2"
              />
            )}
            <Heading
              level={3}
              variant="secondary"
              className="text-primary-900 text-sm"
            >
              {child.title}
            </Heading>
          </Link>
        ))}
      </div>
    </div>
  );
}
