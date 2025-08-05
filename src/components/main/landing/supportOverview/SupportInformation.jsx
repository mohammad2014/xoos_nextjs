"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDictionary } from "@/hooks/use-dictionary";
import Link from "next/link";
export default function SupportInformation({ items }) {
  const { dictionary } = useDictionary();

  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem value={item.title} key={item.title}>
          <AccordionTrigger className="hover:no-underline cursor-pointer">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="text-primary-600">
            <p className="mb-4">{item.description}</p>
            {item.link && (
              <Link
                href={item.link}
                className="bg-primary-100 rounded-sm py-1 px-3"
              >
                {dictionary.forms.next}
              </Link>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
