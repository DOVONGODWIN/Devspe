import { useNavigate } from "react-router-dom";
import { User, Package, ShoppingBag, TrendingUp, LogOut, ChevronRight, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  async function handleLogout() {
    await logout();
    nav("/login");
  }

  if (!user) return null;

  const menu = [
    { label: "Mes produits", icon: <ShoppingBag size={20} />, to: "/my-products" },
    { label: "Mes commandes", icon: <Package size={20} />, to: "/orders" },
    { label: "Mes ventes", icon: <TrendingUp size={20} />, to: "/dashboard" },
  ];

  return (
    <div className="pb-28 md:pb-6">
      {/* Bandeau */}
      <div className="bg-nex-grad px-6 pt-8 pb-10 md:rounded-[28px] md:mt-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 32px)" }}>
        <div className="flex items-center gap-4">
          <span className="grid place-items-center w-16 h-16 rounded-full bg-white/15 backdrop-blur shrink-0">
            <User size={30} color="#fff" />
          </span>
          <div className="min-w-0">
            <h1 className="text-white text-xl font-extrabold truncate">
              {user.full_name || "Utilisateur"}
            </h1>
            <p className="text-white/80 text-sm flex items-center gap-1 truncate">
              <Mail size={14} /> {user.email}
            </p>
            {user.role === "admin" && (
              <span className="inline-block mt-1 text-[11px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                Administrateur
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 md:px-0 mt-5">
        <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
          {menu.map((m, i) => (
            <button key={m.to} onClick={() => nav(m.to)}
              className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-silver/20 transition ${
                i > 0 ? "border-t border-silver/50" : ""
              }`}>
              <span className="text-violet2">{m.icon}</span>
              <span className="font-semibold text-ink flex-1 text-left">{m.label}</span>
              <ChevronRight size={18} className="text-sub" />
            </button>
          ))}
        </div>

        <button onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 h-12 rounded-xl2 bg-white border border-red-200 text-red-600 font-bold hover:bg-red-50 transition">
          <LogOut size={18} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}