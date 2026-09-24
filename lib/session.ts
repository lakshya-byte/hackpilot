import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "./api";
import { ACCESS_COOKIE } from "./cookies";
import type { Profile, Team } from "./types";

// By the time a Server Component renders, proxy.ts has already refreshed the
// access token cookie if it was missing/expired (and redirected to /sign-in
// if there was no valid refresh token either) — so this only needs to read
// the cookie and call the backend, not manage refresh itself. Server
// Components cannot set cookies, which is why that logic lives in proxy.ts.
export async function getProfileOrRedirect(): Promise<Profile> {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!access) {
    redirect("/sign-in");
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/users/me/profile`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/sign-in");
  }
  if (!res.ok) {
    throw new Error(`failed to load profile (${res.status})`);
  }

  return res.json();
}

// Returns null when the user has no team yet (404 from the backend), rather
// than treating that as an error — "no team" is a normal, expected state.
export async function getMyTeamOrRedirect(): Promise<Team | null> {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!access) {
    redirect("/sign-in");
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/teams/me`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/sign-in");
  }
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`failed to load team (${res.status})`);
  }

  return res.json();
}
