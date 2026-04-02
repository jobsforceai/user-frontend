import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.BACKEND_API_BASE_URL ?? "http://localhost:4000";
const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const DEFAULT_NEXT_PATH = "/dashboard";

function normalizeNextPath(raw: string | null) {
  if (!raw) return DEFAULT_NEXT_PATH;
  if (!raw.startsWith("/")) return DEFAULT_NEXT_PATH;
  if (raw.startsWith("//")) return DEFAULT_NEXT_PATH;
  if (raw.startsWith("/auth/exchange")) return DEFAULT_NEXT_PATH;
  return raw;
}

function loginRedirect(request: NextRequest, reason: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", reason);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest) {
  const handoffToken = request.nextUrl.searchParams.get("token");
  const nextPath = normalizeNextPath(request.nextUrl.searchParams.get("next"));

  if (!handoffToken) {
    return loginRedirect(request, "handoff_missing");
  }

  try {
    const exchangeResponse = await fetch(`${API_BASE}/api/v1/auth/mobile-handoff-exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: handoffToken }),
      cache: "no-store",
    });

    const payload = (await exchangeResponse.json().catch(() => ({}))) as {
      token?: string;
      message?: string;
    };

    if (!exchangeResponse.ok || !payload.token) {
      return loginRedirect(request, "handoff_failed");
    }

    const destination = new URL(nextPath, request.url);
    const response = NextResponse.redirect(destination);
    response.cookies.set("sg_token", payload.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
    return response;
  } catch {
    return loginRedirect(request, "handoff_error");
  }
}
