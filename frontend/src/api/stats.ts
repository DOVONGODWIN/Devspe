import { api } from "./client";
import type { SellerStats } from "../types";

export async function fetchSellerStats(): Promise<SellerStats> {
  const { data } = await api.get<SellerStats>("/stats/seller/me");
  return data;
}