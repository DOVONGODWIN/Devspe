import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product, CartLine } from "../types";

interface CartCtx {
  lines: CartLine[];
  count: number;
  total: number;
  add: (product: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "nexaa_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(lines)); }, [lines]);

  function add(product: Product, qty = 1) {
    setLines(prev => {
      const found = prev.find(l => l.product.id === product.id);
      if (found) {
        return prev.map(l => l.product.id === product.id
          ? { ...l, quantity: Math.min(l.quantity + qty, product.stock) } : l);
      }
      return [...prev, { product, quantity: qty }];
    });
  }

  function setQty(productId: string, qty: number) {
    setLines(prev => qty <= 0
      ? prev.filter(l => l.product.id !== productId)
      : prev.map(l => l.product.id === productId ? { ...l, quantity: qty } : l));
  }

  function remove(productId: string) {
    setLines(prev => prev.filter(l => l.product.id !== productId));
  }

  function clear() { setLines([]); }

  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const total = lines.reduce((s, l) => s + parseFloat(l.product.price) * l.quantity, 0);

  return (
    <Ctx.Provider value={{ lines, count, total, add, setQty, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
  return ctx;
}