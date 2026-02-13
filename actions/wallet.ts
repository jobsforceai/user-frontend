"use server";

import { callBackend } from "@/actions/assets";

export type WalletData = {
  balanceMg: number;
  totalPurchasedMg: number;
  totalBonusMg: number;
};

export type TransactionData = {
  _id: string;
  type: "buy" | "sell" | "bonus" | "storage_reward" | "scheme_credit" | "withdrawal";
  amountMg: number;
  pricePerGramPaise: number;
  totalPaise: number;
  bonusMg: number;
  status: string;
  createdAt: string;
};

export async function getWallet(): Promise<WalletData> {
  return callBackend<WalletData>("/api/v1/wallet");
}

export async function getTransactions(page = 1, limit = 20) {
  return callBackend<{
    transactions: TransactionData[];
    total: number;
    page: number;
    limit: number;
  }>(`/api/v1/wallet/transactions?page=${page}&limit=${limit}`);
}

export type StorageBenefitStatus = {
  eligible: boolean;
  thresholdMg: number;
  rewardMg: number;
  balanceMg: number;
  claimedThisMonth: boolean;
};

export async function getStorageBenefitStatus() {
  return callBackend<StorageBenefitStatus>("/api/v1/wallet/storage-benefit");
}

export async function claimStorageBenefit() {
  return callBackend<{ creditedMg: number; newBalance: number }>("/api/v1/wallet/storage-benefit/claim", {
    method: "POST",
  });
}
