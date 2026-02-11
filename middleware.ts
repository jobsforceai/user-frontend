import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard", "/wallet", "/buy", "/sell", "/scheme", "/delivery", "/profile"];
const authPages = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sg_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAuthPage = authPages.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/wallet/:path*",
    "/buy/:path*",
    "/sell/:path*",
    "/scheme/:path*",
    "/delivery/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
