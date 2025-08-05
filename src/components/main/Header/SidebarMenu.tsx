"use client";

import Link from "next/link";
import { MenuItem } from "@/types/menu";
import { Heading } from "@/components/ui/Heading";
import { ChevronLeft } from "lucide-react";

type SidebarMenuProps = {
  mainItems: MenuItem[];
  introItems: MenuItem[];
  introDescription: string;
  onItemClick: (id: number) => void;
};

export default function SidebarMenu({
  mainItems,
  introItems,
  introDescription,
  onItemClick,
}: SidebarMenuProps) {
  return (
    <div className="space-y-12 flex flex-col justify-between h-full">
      <div>
        {mainItems.length > 0 && (
          <div>
            <ul className="space-y-4">
              {mainItems.map((item) => (
                <li key={item.id}>
                  {item.children && item.children.length > 0 ? (
                    <Heading
                      level={1}
                      variant="secondary"
                      onClick={() => onItemClick(item.id)}
                      className="w-full flex items-center justify-between text-start text-primary-900 text-sm hover:text-primary-600 transition-colors"
                      aria-expanded={item.children.some(
                        (child) => child.id === item.id
                      )}
                      aria-controls={`submenu-${item.id}`}
                    >
                      {item.title}
                      <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
                    </Heading>
                  ) : (
                    <Link
                      href={item.link || "#"}
                      className="block text-primary-900 text-sm hover:text-primary-600 transition-colors"
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        {introItems.length > 0 && (
          <div className="space-y-3">
            {introDescription && (
              <p className="text-sm text-primary-600 mt-3">
                {introDescription}
              </p>
            )}
            <ul className="space-y-4">
              {introItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link || "#"}
                    className="block text-sm text-primary-900 hover:text-gray-700 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
