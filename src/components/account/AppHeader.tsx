import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

export default function AppHeader() {
  return (
    <div className="bg-primary-0 z-50 fixed w-full px-4 py-3">
      <SidebarTrigger />
    </div>
  );
}
