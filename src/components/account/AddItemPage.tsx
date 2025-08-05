"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "../ui/Heading";
import { useDictionary } from "@/hooks/use-dictionary";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AddItemPage({ label }: { label: string }) {
  const { dictionary } = useDictionary();
  const pathname = usePathname();
  const path = pathname.substring(3);

  return (
    <>
      <div className="bg-primary-0 border-primary-300 mt-3 flex items-center justify-between rounded-md border p-4">
        <Heading level={3}>{label}</Heading>

        <Button>
          <Link href={`${path}/create`}>{dictionary.common.add}</Link>
        </Button>
      </div>
    </>
  );
}
