import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/cookies";

// Multipart passthrough: the browser never talks to the Go API or the agent
// service directly, it only ever sees this same-origin route — same pattern
// as app/api/profile/avatar/route.ts.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!access) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/pitch/parse-rubric`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}` },
    body: formData,
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}
