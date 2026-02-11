"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.BACKEND_API_BASE_URL ?? "http://localhost:4000";

export type User = {
  id: string;
  phone: string;
  name: string;
  email?: string;
  accountType: "regular" | "jeweller";
};

async function authFetch<T>(path: string, body: Record<string, unknown>): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const json = await response.json() as Record<string, unknown>;

    if (!response.ok) {
      return { error: (json.message as string) ?? "Request failed" };
    }

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const match = setCookie.match(/sg_token=([^;]+)/);
      if (match) {
        const cookieStore = await cookies();
        cookieStore.set("sg_token", match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
      }
    }

    return { data: json as T };
  } catch {
    return { error: "Network error" };
  }
}

export async function register(data: {
  phone: string;
  password: string;
  name: string;
  email?: string;
}): Promise<{ user?: User; error?: string }> {
  const result = await authFetch<{ user: User }>("/api/v1/auth/register", data);
  if (result.error) return { error: result.error };
  return { user: result.data?.user };
}

export async function login(data: {
  phone: string;
  password: string;
}): Promise<{ user?: User; error?: string }> {
  const result = await authFetch<{ user: User }>("/api/v1/auth/login", data);
  if (result.error) return { error: result.error };
  return { user: result.data?.user };
}

export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sg_token")?.value;

    await fetch(`${API_BASE}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `sg_token=${token}` } : {}),
      },
      cache: "no-store",
    });
  } catch {
    // ignore
  }

  const cookieStore = await cookies();
  cookieStore.delete("sg_token");
}

export async function getMe(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sg_token")?.value;
    if (!token) return null;

    const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `sg_token=${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const json = await response.json() as { user: User };
    return json.user;
  } catch {
    return null;
  }
}
