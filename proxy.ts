import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
} from "@/lib/cookies";

function isExpiredOrUnreadable(jwt: string): boolean {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    if (typeof payload.exp !== "number") return false;
    return Date.now() >= payload.exp * 1000 - 5000; // 5s clock-skew buffer
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;

  if (access && !isExpiredOrUnreadable(access)) {
    return NextResponse.next();
  }

  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Access token missing/expired but a refresh token is present — rotate it
  // here, since this is a request-interception layer (unlike a Server
  // Component) and can write Set-Cookie headers on the response.
  try {
    const backendRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!backendRes.ok) {
      const redirectRes = NextResponse.redirect(new URL("/sign-in", request.url));
      redirectRes.cookies.delete(ACCESS_COOKIE);
      redirectRes.cookies.delete(REFRESH_COOKIE);
      return redirectRes;
    }

    const data = await backendRes.json();
    const response = NextResponse.next();
    response.cookies.set(ACCESS_COOKIE, data.access_token, accessCookieOptions());
    response.cookies.set(REFRESH_COOKIE, data.refresh_token, refreshCookieOptions());
    return response;
  } catch {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/teams/:path*",
    "/ideas/:path*",
    "/research/:path*",
    "/checklist/:path*",
    "/framework/:path*",
    "/pitch/:path*",
  ],
};
