export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface SellerMini {
  id: string;
  full_name: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  color: string | null;
  price: string;
  stock: number;
  image_url: string | null;
  is_published: boolean;
  views_count: number;
  created_at: string;
  category: Category;
  seller: SellerMini;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
}

export interface OrderItem {
  id: string;
  product: { id: string; name: string; image_url: string | null };
  quantity: number;
  unit_price: string;
}

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export interface Order {
  id: string;
  total_amount: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface SellerStats {
  total_sales: number;
  total_revenue: string;
  average_basket: string;
  total_products: number;
  published_products: number;
  total_views: number;
  top_products: {
    product_id: string;
    name: string;
    total_sold: number;
    revenue: string;
  }[];
}

export interface CartLine {
  product: Product;
  quantity: number;
}