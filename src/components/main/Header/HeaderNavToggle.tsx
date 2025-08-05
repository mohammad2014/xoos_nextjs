"use client";

import { useSidebar } from "@/contexts/SidebarDrawerContext";
import { Menu } from "lucide-react";

export default function HeaderNavToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar} className="p-2">
      <Menu className="w-6 h-6 stroke-1" />
    </button>
  );
}
