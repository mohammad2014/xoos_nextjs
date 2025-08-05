"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  // از مسیر فعلی locale رو استخراج کن
  const locale = useMemo(() => {
    const segments = pathname.split("/");
    const maybeLocale = segments[1];
    // console.log(maybeLocale);

    return ["fa", "en"].includes(maybeLocale) ? maybeLocale : "fa";
  }, [pathname]);

  const redirectToLogin = useCallback(() => {
    router.push(`/${locale}/login`);
  }, [router, locale]);

  const redirectAfterLogin = useCallback(() => {
    router.push(`/${locale}/admin`);
  }, [router, locale]);

  return { redirectToLogin, redirectAfterLogin, locale };
}
