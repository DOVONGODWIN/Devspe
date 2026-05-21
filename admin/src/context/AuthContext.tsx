import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api, tokenStore } from "../api/client";
import type { User, TokenResponse } from "../types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    if (!tokenStore.access) { setUser(null); setLoading(false); return; }
    try {
      const { data } = await api.get<User>("/auth/me");
      setUser(data);
    } catch { setUser(null); } finally { setLoading(false); }
  }

  useEffect(() => { refreshUser(); }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post<TokenResponse>("/auth/login", { email, password });
    tokenStore.set(data);
    const me = await api.get<User>("/auth/me");
    if (me.data.role !== "admin") {
      tokenStore.clear();
      throw new Error("Accès réservé aux administrateurs.");
    }
    setUser(me.data);
  }

  async function logout() {
    const refresh = tokenStore.refresh;
    try { if (refresh) await api.post("/auth/logout", { refresh_token: refresh }); } catch { /* */ }
    tokenStore.clear();
    setUser(null);
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth dans AuthProvider");
  return ctx;
}