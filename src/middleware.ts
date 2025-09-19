import { betterFetch } from "@better-fetch/fetch";
import { Session } from "better-auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BASE_URL!,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const url = request.nextUrl;

  if (
    session &&
    (url.pathname === "/login" ||
      url.pathname === "/forgot-password" ||
      url.pathname === "/reset-password")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect non-authenticated users trying to access protected routes
  if (
    !session &&
    url.pathname !== "/login" &&
    url.pathname !== "/forgot-password" &&
    url.pathname !== "/reset-password"
  ) {
    const loginUrl = new URL("/login", request.url);
    const fullPath = url.search ? `${url.pathname}${url.search}` : url.pathname;
    loginUrl.searchParams.set("next", fullPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|static|zeus.png|adfast.png|favicon.ico|geojson).*)",
  ],
};
