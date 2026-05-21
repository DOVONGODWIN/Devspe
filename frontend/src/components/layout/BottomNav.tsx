import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, LayoutGrid, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useHideOnScroll } from "../../hooks/useHideOnScroll";

export default function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { count } = useCart();
  const hidden = useHideOnScroll();

  
  if (pathname.startsWith("/product/")) return null;

  const items = [
    
    { to: "/", icon: Home, key: "home" },
    { to: "/profile", icon: User, key: "profile" },
    { to: "/categories", icon: LayoutGrid, key: "menu" },
    { to: "/sell", icon: Plus, key: "sell", center: true },
    { to: "/cart", icon: ShoppingCart, key: "cart", badge: count },
  ];

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav
      className="md:hidden fixed left-0 right-0 bottom-0 z-40 flex justify-center pointer-events-none transition-transform duration-300 ease-out"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        transform: hidden ? "translateY(140%)" : "translateY(0)",
      }}
    >
      <div className="pointer-events-auto mx-3 mb-1 w-full max-w-[420px] bg-white rounded-[26px] shadow-[0_8px_30px_rgba(20,23,43,0.18)] px-2 py-2 flex items-center justify-between">
        {items.map(({ to, icon: Icon, key, center, badge }) => {
          const active = isActive(to);
          if (center) {
            return (
              <button key={key} onClick={() => nav(to)} aria-label="Publier un produit" className="flex-1 flex justify-center">
                <span className="grid place-items-center w-12 h-12 rounded-full bg-nex-grad shadow-lg shadow-violet2/40 -mt-1 active:scale-95 transition">
                  <Icon size={24} color="#fff" strokeWidth={2.6} />
                </span>
              </button>
            );
          }
          return (
            <button key={key} onClick={() => nav(to)} className="flex-1 flex flex-col items-center gap-0.5 relative">
              <span className={`grid place-items-center w-11 h-11 rounded-2xl transition ${active ? "bg-nex-grad" : "bg-transparent"}`}>
                <Icon size={21} color={active ? "#fff" : "#5A5C6E"} strokeWidth={active ? 2.4 : 2} />
              </span>
              {badge ? (
                <span className="absolute top-0 right-[18%] min-w-[18px] h-[18px] px-1 rounded-full bg-violet2 text-white text-[10px] font-bold grid place-items-center">
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}