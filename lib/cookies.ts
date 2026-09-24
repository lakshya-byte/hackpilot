export const ACCESS_COOKIE = "hp_access_token";
export const REFRESH_COOKIE = "hp_refresh_token";

const secure = process.env.NODE_ENV === "production";

// maxAge is a client-side hint only — the source of truth for expiry is the
// JWT's own `exp` claim (checked in proxy.ts) and the backend's refresh
// token TTL. Keeping these roughly in sync with the backend defaults just
// avoids the browser holding onto a cookie long after the token inside it
// is dead.
export function accessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 15,
  };
}

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}
