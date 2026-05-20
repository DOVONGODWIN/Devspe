import { useEffect, useState } from "react";
import { Package, ImageOff } from "lucide-react";
import type { Order } from "../../types";
import { fetchMyOrders } from "../../api/orders";
import { formatPrice } from "../../utils/format";
import Spinner from "../../components/ui/Spinner";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  paid: { text: "Payée", cls: "bg-green-50 text-green-600" },
  pending: { text: "En attente", cls: "bg-orange-50 text-orange-500" },
  cancelled: { text: "Annulée", cls: "bg-red-50 text-red-500" },
  refunded: { text: "Remboursée", cls: "bg-silver/40 text-sub" },
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Chargement des commandes..." />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <span className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-silver/40 mb-4">
          <Package size={28} className="text-sub" />
        </span>
        <p className="text-ink font-bold">Aucune commande</p>
        <p className="text-sub text-sm mt-1">Vos achats apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0 py-4 md:py-6">
      <h1 className="text-2xl font-extrabold text-ink mb-5">Mes commandes</h1>
      <div className="flex flex-col gap-4">
        {orders.map((o) => {
          const st = STATUS_LABEL[o.status] || STATUS_LABEL.pending;
          return (
            <div key={o.id} className="bg-white rounded-xl2 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-sub">Commande</p>
                  <p className="font-mono text-xs text-ink">#{o.id.slice(0, 8)}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${st.cls}`}>{st.text}</span>
              </div>
              <div className="flex flex-col gap-2">
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-silver/30 grid place-items-center shrink-0">
                      {it.product.image_url
                        ? <img src={it.product.image_url} alt={it.product.name} className="w-full h-full object-cover" />
                        : <ImageOff size={18} className="text-sub/50" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink line-clamp-1">{it.product.name}</p>
                      <p className="text-xs text-sub">x{it.quantity} · {formatPrice(it.unit_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-px bg-silver/50 my-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-sub">{new Date(o.created_at).toLocaleDateString("fr-FR")}</span>
                <span className="font-extrabold text-violet2">{formatPrice(o.total_amount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}