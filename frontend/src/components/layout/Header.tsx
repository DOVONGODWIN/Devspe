import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Plus, ShoppingCart, User, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { count } = useCart();
  const { user } = useAuth();

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
          <button
            onClick={() => nav(user ? "/profile" : "/login")}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-nex-grad text-white font-semibold text-sm"
          >
            <User size={18} />
            {user ? (user.full_name?.split(" ")[0] || "Profil") : "Connexion"}
          </button>
        </div>
      </div>
    </header>
  );
}