import { api } from "./client";
import type { ProductListResponse, Product, Category } from "../types";

export interface ProductFilters {
  page?: number;
  page_size?: number;
  search?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
}

export async function fetchProducts(filters: ProductFilters): Promise<ProductListResponse> {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.page_size) params.page_size = filters.page_size;
  if (filters.search) params.search = filters.search;
  if (filters.category_id) params.category_id = filters.category_id;
  if (filters.min_price != null) params.min_price = filters.min_price;
  if (filters.max_price != null) params.max_price = filters.max_price;

  const { data } = await api.get<ProductListResponse>("/products/", { params });
  return data;
}

export async function fetchProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories/");
  return data;
}
export interface ProductPayload {
  name: string;
  description: string;
  color?: string | null;
  price: number;
  stock: number;
  image_url?: string | null;
  category_id: string;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const { data } = await api.post<Product>("/products/", payload);
  return data;
}

export async function fetchMyProducts(): Promise<ProductListResponse> {
  const { data } = await api.get<ProductListResponse>("/products/me", {
    params: { page_size: 100 },
  });
  return data;
}

export async function updateProduct(id: string, payload: Partial<ProductPayload> & { is_published?: boolean }): Promise<Product> {
  const { data } = await api.patch<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}