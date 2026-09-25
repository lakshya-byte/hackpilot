import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/cookies";

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value;
}

// `id` is the caller's own team id here — GET /api/v1/pitch/:teamId.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const access = await getAccessToken();
  if (!access) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/pitch/${id}`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}

// `id` is the pitch's own id here — PUT /api/v1/pitch/:id.
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const access = await getAccessToken();
  if (!access) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const body = await request.text();

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/pitch/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body,
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}
