import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.BACKEND_API_BASE_URL ?? "http://localhost:4000";

export async function GET() {
  try {
    // Fetch live price
    const priceRes = await fetch(`${API_BASE}/api/v1/trade/price`, { cache: "no-store" });
    const priceData = priceRes.ok ? await priceRes.json() : { pricePerGramPaise: 0, gstPercent: 3 };

    // Fetch wallet for bonus calculation
    let balanceMg = 0;
    let totalPurchasedMg = 0;
    let totalBonusMg = 0;
    const cookieStore = await cookies();
    const token = cookieStore.get("sg_token")?.value;
    if (token) {
      try {
        const walletRes = await fetch(`${API_BASE}/api/v1/wallet`, {
          headers: { Cookie: `sg_token=${token}` },
          cache: "no-store",
        });
        if (walletRes.ok) {
          const wallet = await walletRes.json();
          balanceMg = wallet.balanceMg ?? 0;
          totalPurchasedMg = wallet.totalPurchasedMg ?? 0;
          totalBonusMg = wallet.totalBonusMg ?? 0;
        }
      } catch { /* ignore */ }
    }

    return NextResponse.json({
      ...priceData,
      balanceMg,
      totalPurchasedMg,
      totalBonusMg,
      bonusThresholdMg: 1000,
      bonusMaxMg: 100,
      bonusPercent: 10,
    });
  } catch {
    return NextResponse.json({ pricePerGramPaise: 0, gstPercent: 3 }, { status: 500 });
  }
}
