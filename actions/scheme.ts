"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.BACKEND_API_BASE_URL ?? "http://localhost:4000";

type SchemeInstallment = {
  dueDate: string;
  paidDate?: string;
  amountPaise: number;
  status: "pending" | "paid" | "missed" | "advance";
};

export type SchemeData = {
  _id: string;
  slabAmountPaise: number;
  bonusAmountPaise: number;
  status: "active" | "completed" | "withdrawn" | "penalized";
  startDate: string;
  installments: SchemeInstallment[];
  missedCount: number;
  createdAt: string;
};

async function schemeFetch<T>(path: string, method = "GET", body?: unknown): Promise<{ data?: T; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sg_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: `sg_token=${token}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });

    const json = await response.json() as Record<string, unknown>;
    if (!response.ok) return { error: (json.message as string) ?? "Request failed" };
    return { data: json as T };
  } catch {
    return { error: "Network error" };
  }
}

export async function getSchemes() {
  return schemeFetch<{ schemes: SchemeData[] }>("/api/v1/scheme");
}

export async function getScheme(schemeId: string) {
  return schemeFetch<{ scheme: SchemeData }>(`/api/v1/scheme/${schemeId}`);
}

export async function enrollScheme(slabAmountPaise: number, sgxCode?: string) {
  return schemeFetch<{ scheme: SchemeData }>("/api/v1/scheme/enroll", "POST", {
    slabAmountPaise,
    ...(sgxCode ? { sgxCode } : {}),
  });
}

export async function paySchemeInstallment(schemeId: string) {
  return schemeFetch<{ scheme: SchemeData }>(`/api/v1/scheme/${schemeId}/pay`, "POST");
}

export async function verifySgxCode(code: string, monthlyAmountPaise: number) {
  return schemeFetch<{ valid: boolean; code: string; reward?: string; error?: string }>(
    "/api/v1/trade/sgx/verify",
    "POST",
    { code, monthlyAmountPaise }
  );
}

export async function redeemSchemeAction(schemeId: string) {
  return schemeFetch<{
    totalPaidPaise: number;
    bonusPaise: number;
    totalValuePaise: number;
    goldCreditedMg: number;
    pricePerGramPaise: number;
  }>(`/api/v1/scheme/${schemeId}/redeem`, "POST");
}
