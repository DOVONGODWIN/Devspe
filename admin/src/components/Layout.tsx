import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Package, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const items = [
    { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/users", label: "Utilisateurs", icon: Users },
    { to: "/products", label: "Produits", icon: Package },
  ];

  const isActive = (to: string) => to === "/" ? pathname === "/" : pathname.startsWith(to);

  async function handleLogout() { await logout(); nav("/login"); }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-nexbg">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-silver/50 p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-nex-grad">
            <ShoppingBag size={18} color="#fff" />
          </span>
          <span className="font-extrabold text-ink">Nexaa Admin</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {items.map(({ to, label, icon: Icon }) => (
            <button key={to} onClick={() => nav(to)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition ${
                isActive(to) ? "bg-nex-grad text-white" : "text-sub hover:bg-silver/30 hover:text-ink"
              }`}>
              <Icon size={19} /> {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-silver/50 pt-3">
          <p className="px-3 text-xs text-sub mb-2 truncate">{user?.email}</p>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50">
            <LogOut size={19} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Top bar mobile */}
      <header className="md:hidden bg-white border-b border-silver/50 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-nex-grad">
            <ShoppingBag size={16} color="#fff" />
          </span>
          <span className="font-extrabold text-ink text-sm">Nexaa Admin</span>
        </div>
        <button onClick={handleLogout} className="text-red-600"><LogOut size={20} /></button>
      </header>

      {/* Contenu */}
      <main className="flex-1 min-w-0">
        <div className="max-w-[1100px] mx-auto p-4 md:p-8">{children}</div>
        {/* Nav bottom mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-silver/50 flex"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {items.map(({ to, label, icon: Icon }) => (
            <button key={to} onClick={() => nav(to)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
                isActive(to) ? "text-violet2" : "text-sub"
              }`}>
              <Icon size={20} /> {label}
            </button>
          ))}
        </nav>
        <div className="md:hidden h-20" />
      </main>
    </div>
  );
}