import { useEffect, useState } from "react";
import { TrendingUp, Wallet, ShoppingBag, Eye, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import type { SellerStats } from "../../types";
import { fetchSellerStats } from "../../api/stats";
import { formatPrice } from "../../utils/format";
import Spinner from "../../components/ui/Spinner";

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerStats().then(setStats).catch(() => setStats(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Chargement des statistiques..." />;
  if (!stats) return <div className="text-center py-20 text-sub">Statistiques indisponibles.</div>;

  const cards = [
    { label: "Ventes", value: stats.total_sales, icon: <ShoppingBag size={20} />, },
    { label: "Revenu", value: formatPrice(stats.total_revenue), icon: <Wallet size={20} />, },
    { label: "Panier moyen", value: formatPrice(stats.average_basket), icon: <TrendingUp size={20} />, },
    { label: "Vues totales", value: stats.total_views, icon: <Eye size={20} />, },
  ];

  const chartData = stats.top_products.map((p) => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
    ventes: p.total_sold,
    revenue: parseFloat(p.revenue),
  }));

  return (
    <div className="px-4 md:px-0 py-4 md:py-6">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Mes ventes</h1>
      <p className="text-sub text-sm mb-5">
        {stats.published_products} produit{stats.published_products > 1 ? "s" : ""} en ligne
        {" · "}{stats.total_products} au total
      </p>

      {/* Cartes KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl2 p-4 shadow-sm">
            <span className="inline-grid place-items-center w-10 h-10 rounded-xl bg-nex-grad text-white mb-3">
              {c.icon}
            </span>
            <p className="text-2xl font-extrabold text-ink leading-none">{c.value}</p>
            <p className="text-sub text-sm mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Graphique top produits */}
      <div className="bg-white rounded-xl2 p-4 md:p-5 shadow-sm">
        <h2 className="font-bold text-ink mb-4">Top produits (quantités vendues)</h2>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-sub">
            <Package size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune vente pour le moment.</p>
          </div>
        ) : (
          <>
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5A5C6E" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5A5C6E" }} />
                  <Tooltip
                    cursor={{ fill: "rgba(106,63,191,0.06)" }}
                    contentStyle={{ borderRadius: 12, border: "1px solid #D6D8F0", fontSize: 13 }}
                  />
                  <Bar dataKey="ventes" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, i) => <Cell key={i} fill="#6A3FBF" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Détail top produits */}
            <div className="mt-4 flex flex-col gap-2">
              {stats.top_products.map((p, i) => (
                <div key={p.product_id} className="flex items-center gap-3 py-1">
                  <span className="grid place-items-center w-6 h-6 rounded-lg bg-violet2/10 text-violet2 text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink line-clamp-1">{p.name}</span>
                  <span className="text-xs text-sub">{p.total_sold} vendu{p.total_sold > 1 ? "s" : ""}</span>
                  <span className="text-sm font-bold text-violet2">{formatPrice(p.revenue)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}