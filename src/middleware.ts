import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fa", "en", "ar"];
const defaultLocale = "fa";

function handleLocale(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const cookieLocale = request.cookies.get("locale")?.value;
  const locale =
    pathnameLocale ??
    (cookieLocale && locales.includes(cookieLocale)
      ? cookieLocale
      : defaultLocale);

  const pathnameHasLocale = !!pathnameLocale;

  if (!pathnameHasLocale) {
    const newUrl = new URL(
      `/${locale}${pathname === "/" ? "" : pathname}`,
      request.url
    );
    return NextResponse.redirect(newUrl);
  }

  const response = NextResponse.next();
  const currentLocale = pathname.split("/")[1];
  if (locales.includes(currentLocale)) {
    response.cookies.set("locale", currentLocale, { path: "/" });
  }

  return response;
}

function handleAuth(request: NextRequest, locale: string): NextResponse | null {
  const { pathname } = request.nextUrl;
  const permissions = request.cookies.get("permissions")?.value;

  if (
    pathname === `/${locale}/login` &&
    permissions?.includes("AccessToAdmin")
  ) {
    const adminUrl = new URL(`/${locale}/admin`, request.url);
    return NextResponse.redirect(adminUrl);
  }

  if (pathname.startsWith(`/${locale}/admin`)) {
    if (!permissions || !permissions.includes("AccessToAdmin")) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const localeResponse = handleLocale(request);
  if (localeResponse.status === 302) {
    return localeResponse;
  }

  const currentLocale = request.nextUrl.pathname.split("/")[1] || defaultLocale;
  const authResponse = handleAuth(request, currentLocale);
  if (authResponse) {
    return authResponse;
  }
  return localeResponse;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
