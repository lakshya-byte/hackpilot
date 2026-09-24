import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/cookies";

async function getAccess() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const access = await getAccess();
  if (!access) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const body = await request.text();

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/teams/${id}`, {
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const access = await getAccess();
  if (!access) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/teams/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access}` },
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}
