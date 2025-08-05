import Header from "@/components/main/Header/Header";
import Footer from "@/components/main/landing/shared/footer/Footer";
import { SidebarProvider } from "@/contexts/SidebarDrawerContext";
import { ReactNode } from "react";

export default async function MainLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const awaitedParams = await params;
  const { lang } = awaitedParams;

  return (
    <main className="flex flex-col min-h-screen">
      <SidebarProvider>
        <Header lang={lang} />
        <div>{children}</div>
        <Footer />
      </SidebarProvider>
    </main>
  );
}
