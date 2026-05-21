import { api } from "./client";
import type { AdminStats, UserListResponse, ProductListResponse, User, Product } from "../types";

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>("/stats/admin");
  return data;
}

export async function fetchUsers(params: { page?: number; search?: string; is_active?: boolean }): Promise<UserListResponse> {
  const { data } = await api.get<UserListResponse>("/admin/users/", { params });
  return data;
}

export async function updateUser(id: string, payload: { is_active?: boolean; role?: "user" | "admin" }): Promise<User> {
  const { data } = await api.patch<User>(`/admin/users/${id}`, payload);
  return data;
}

export async function fetchAllProducts(params: { page?: number; search?: string }): Promise<ProductListResponse> {
  const { data } = await api.get<ProductListResponse>("/admin/products/", { params });
  return data;
}

export async function updateProduct(id: string, payload: { is_published?: boolean }): Promise<Product> {
  const { data } = await api.patch<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}