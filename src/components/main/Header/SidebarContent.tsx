"use client";

import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

import SidebarMenu from "./SidebarMenu";
import SidebarDetails from "./SidebarDetails";

import { useSidebar } from "@/contexts/SidebarDrawerContext";
import { Locale } from "@/lib/dict";
import { useDirection } from "@/hooks/use-direction";
import { Heading } from "@/components/ui/Heading";
import { MenuItem } from "@/lib/menuApi";

type SidebarContentProps = {
  lang: Locale;
  mainItems: MenuItem[];
  mainDescription: string;
  introItems: MenuItem[];
  introDescription: string;
};

export default function SidebarContent({
  lang,
  mainItems,
  mainDescription,
  introItems,
  introDescription,
}: SidebarContentProps) {
  const {
    isSidebarOpen,
    closeSidebar,
    selectedItemId,
    setSelectedItemId,
    setSubDrawerOpen,
  } = useSidebar();

  const direction = useDirection(lang ?? "fa");

  const handleItemClick = (id: number) => {
    setSelectedItemId(id);
    setSubDrawerOpen(true);
  };

  const selectedItem = mainItems.find((item) => item.id === selectedItemId);

  return (
    <Sheet
      open={isSidebarOpen}
      onOpenChange={(open) => {
        if (!open) closeSidebar();
      }}
    >
      <SheetContent
        side={direction}
        className="w-72 p-0 bg-primary-0 text-primary-900"
      >
        <SheetHeader className="p-6">
          <Heading className="text-sm text-primary-900">
            {mainDescription}
          </Heading>
        </SheetHeader>

        <div className="px-6 pb- h-full">
          <SidebarMenu
            // @ts-expect-error - TS can’t verify dynamic field path at runtime
            mainItems={mainItems}
            // @ts-expect-error - TS can’t verify dynamic field path at runtime
            introItems={introItems}
            introDescription={introDescription}
            onItemClick={handleItemClick}
          />
        </div>
        <SidebarDetails
          selectedItem={selectedItem}
          onClose={() => {
            setSubDrawerOpen(false);
            setSelectedItemId(null);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
