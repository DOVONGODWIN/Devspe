import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Plus, ShoppingCart, User, ShoppingBag, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const link = (to: string, label: string, icon: React.ReactNode) => {
    const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
    return (
      <button
        onClick={() => nav(to)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${
          active ? "bg-nex-grad text-white" : "text-sub hover:text-ink hover:bg-silver/40"
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    nav("/login");
  }

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-silver/50">
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center gap-6">
        <button onClick={() => nav("/")} className="flex items-center gap-2 shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-nex-grad">
            <ShoppingBag size={18} color="#fff" />
          </span>
          <span className="font-extrabold text-ink text-lg tracking-tight">Nexaa Market</span>
        </button>

        <nav className="flex items-center gap-1 ml-2">
          {link("/", "Accueil", <Home size={17} />)}
          {link("/categories", "Catégories", <LayoutGrid size={17} />)}
          {link("/sell", "Vendre", <Plus size={17} />)}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => nav("/cart")}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sub hover:text-ink hover:bg-silver/40 font-semibold text-sm"
          >
            <ShoppingCart size={18} />
            Panier
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-violet2 text-white text-[10px] font-bold grid place-items-center">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-nex-grad text-white font-semibold text-sm"
              >
                <User size={18} />
                {user.full_name?.split(" ")[0] || "Profil"}
                <ChevronDown size={15} className={`transition ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-ink/10 border border-silver/50 py-2 z-50">
                    <MenuItem label="Mon profil" onClick={() => { setMenuOpen(false); nav("/profile"); }} icon={<User size={16} />} />
                    <MenuItem label="Mes produits" onClick={() => { setMenuOpen(false); nav("/my-products"); }} icon={<ShoppingBag size={16} />} />
                    <MenuItem label="Mes ventes" onClick={() => { setMenuOpen(false); nav("/dashboard"); }} icon={<LayoutGrid size={16} />} />
                    <div className="h-px bg-silver/50 my-1.5 mx-2" />
                    <MenuItem label="Se déconnecter" onClick={handleLogout} icon={<LogOut size={16} />} danger />
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => nav("/login")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-nex-grad text-white font-semibold text-sm"
            >
              <User size={18} />
              Connexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ label, onClick, icon, danger }: {
  label: string; onClick: () => void; icon: React.ReactNode; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition hover:bg-silver/30 ${
        danger ? "text-red-600" : "text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}