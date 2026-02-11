"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.BACKEND_API_BASE_URL ?? "http://localhost:4000";

export type StoreData = {
  id: string;
  name: string;
  city: string;
  state: string;
};

export type DeliveryData = {
  _id: string;
  amountMg: number;
  productType: "coin" | "bar";
  productWeightMg: number;
  coinChargePaise: number;
  gstPaise: number;
  totalChargePaise: number;
  pickupStoreId: string;
  status: string;
  createdAt: string;
};

async function deliveryFetch<T>(path: string, method = "GET", body?: unknown): Promise<{ data?: T; error?: string }> {
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

export async function getStores(): Promise<StoreData[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/delivery/stores`, { cache: "no-store" });
    const json = await response.json() as { stores: StoreData[] };
    return json.stores;
  } catch {
    return [];
  }
}

export async function getDeliveries() {
  return deliveryFetch<{ deliveries: DeliveryData[] }>("/api/v1/delivery");
}

export async function createDelivery(data: {
  amountMg: number;
  productType: "coin" | "bar";
  productWeightMg: number;
  pickupStoreId: string;
}) {
  return deliveryFetch<{ delivery: DeliveryData }>("/api/v1/delivery", "POST", data);
}
