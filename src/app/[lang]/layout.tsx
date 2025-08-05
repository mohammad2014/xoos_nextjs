// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import "@/app/_styles/globals.css";
import localFont from "next/font/local";
import { type Locale } from "@/lib/dict";
import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "@/components/account/AuthInitializer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

// Persian fonts
const iranYekanBold = localFont({
  src: "../../../public/fonts/IRANYekanXFaNum-DemiBold.woff2",
  variable: "--font-primary-bold",
  display: "swap",
});

const iranYekan = localFont({
  src: "../../../public/fonts/IRANYekanXFaNum-Light.woff2",
  variable: "--font-primary",
  display: "swap",
});

// English fonts
const NeueMontrealMedium = localFont({
  src: "../../../public/fonts/NeueMontreal-Medium.otf",
  variable: "--font-primary-bold",
  display: "swap",
});

const NeueMontreal = localFont({
  src: "../../../public/fonts/NeueMontreal-Regular.otf",
  variable: "--font-primary",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Test | Test",
    template: "Test | %s",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  const fontClassName =
    lang === "en"
      ? `${NeueMontreal.variable} ${NeueMontrealMedium.variable}`
      : `${iranYekan.variable} ${iranYekanBold.variable}`;

  return (
    <html lang={lang} dir={lang === "fa" ? "rtl" : "ltr"}>
      <body className={`${fontClassName} antialiased`}>
        <NuqsAdapter>
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster theme="light" position="top-center" richColors />
        </NuqsAdapter>
      </body>
    </html>
  );
}
