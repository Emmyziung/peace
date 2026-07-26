import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "site_access";
const ACCESS_COOKIE_VALUE = "roses-are-red-3456";
const PUBLIC_API_PATHS = new Set(["/api/unlock"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow _next assets, images, and favicon without auth
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico" ||
    PUBLIC_API_PATHS.has(pathname)
  ) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get(ACCESS_COOKIE)?.value === ACCESS_COOKIE_VALUE;

  // If the user has access and lands on /unlock, send them to the public homepage
  if (hasAccess && pathname === "/unlock") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user does NOT have access and is NOT on /unlock, redirect to /unlock
  if (!hasAccess && pathname !== "/unlock") {
    return NextResponse.redirect(new URL("/unlock", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes and let middleware filter/allow static and API paths above.
  matcher: ["/(.*)"],
};
