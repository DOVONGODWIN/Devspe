import { api } from "./client";
import type { Order } from "../types";

export interface CheckoutItem {
  product_id: string;
  quantity: number;
}

export interface CheckoutResponse {
  order_id: string;
  checkout_url: string;
}

export async function checkout(items: CheckoutItem[]): Promise<CheckoutResponse> {
  const { data } = await api.post<CheckoutResponse>("/orders/checkout", { items });
  return data;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders/me");
  return data;
}

export async function fetchOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}