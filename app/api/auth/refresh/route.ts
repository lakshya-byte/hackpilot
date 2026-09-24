import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { ACCESS_COOKIE, REFRESH_COOKIE, accessCookieOptions, refreshCookieOptions } from "@/lib/cookies";

// Used by client components for a silent refresh when a proxied API call
// comes back 401 mid-session (proxy.ts already handles the common case of an
// expired token on page navigation; this covers a token expiring while the
// user is active on an already-loaded page).
export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refresh) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    const response = NextResponse.json({ error: data.error ?? "session expired" }, { status: backendRes.status });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, data.access_token, accessCookieOptions());
  response.cookies.set(REFRESH_COOKIE, data.refresh_token, refreshCookieOptions());
  return response;
}
