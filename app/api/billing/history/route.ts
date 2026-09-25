import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/cookies";

export async function GET() {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!access) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/billing/history`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}
