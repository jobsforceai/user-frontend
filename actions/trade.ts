"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.BACKEND_API_BASE_URL ?? "http://localhost:4000";

type TradeResult = {
  success: boolean;
  error?: string;
  transaction?: Record<string, unknown>;
  bonusMg?: number;
  newBalance?: number;
};

async function tradeRequest(path: string, amountMg: number): Promise<TradeResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sg_token")?.value;
    if (!token) return { success: false, error: "Not authenticated" };

    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sg_token=${token}`,
      },
      body: JSON.stringify({ amountMg }),
      cache: "no-store",
    });

    const json = await response.json() as Record<string, unknown>;

    if (!response.ok) {
      return { success: false, error: (json.message as string) ?? "Request failed" };
    }

    return {
      success: true,
      transaction: json.transaction as Record<string, unknown>,
      bonusMg: json.bonusMg as number | undefined,
      newBalance: json.newBalance as number | undefined,
    };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function buyGold(amountMg: number): Promise<TradeResult> {
  return tradeRequest("/api/v1/trade/buy", amountMg);
}

export async function sellGold(amountMg: number): Promise<TradeResult> {
  return tradeRequest("/api/v1/trade/sell", amountMg);
}
