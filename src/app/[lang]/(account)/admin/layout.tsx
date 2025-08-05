import { AppSidebar } from "@/components/account/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import AppHeader from "@/components/account/AppHeader";
import { Locale } from "@/lib/dict";

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  return (
    <SidebarProvider>
      <NuqsAdapter>
        <AppSidebar lang={lang} />
        <SidebarInset className="bg-primary-100">
          <AppHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 mt-16">{children}</div>
        </SidebarInset>
      </NuqsAdapter>
    </SidebarProvider>
  );
}
