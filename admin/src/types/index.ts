export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Category { id: string; name: string; slug: string; }
export interface SellerMini { id: string; full_name: string | null; }

export interface Product {
  id: string; name: string; description: string; color: string | null;
  price: string; stock: number; image_url: string | null; is_published: boolean;
  views_count: number; created_at: string; category: Category; seller: SellerMini;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_products: number;
  published_products: number;
  total_orders: number;
  paid_orders: number;
  pending_orders: number;
  total_revenue: string;
  top_categories: { category_id: string; name: string; product_count: number }[];
}

export interface UserListResponse {
  items: User[]; total: number; page: number; page_size: number;
}

export interface ProductListResponse {
  items: Product[]; total: number; page: number; page_size: number;
}