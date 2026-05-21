import { useEffect, useState } from "react";
import { Users, UserCheck, Package, ShoppingCart, Wallet, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import type { AdminStats } from "../types";
import { fetchAdminStats } from "../api/admin";
import { formatPrice } from "../utils/format";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(() => setStats(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Chargement des statistiques..." />;
  if (!stats) return <div className="text-center py-16 text-sub">Statistiques indisponibles.</div>;

  const cards = [
    { label: "Utilisateurs", value: stats.total_users, sub: `${stats.active_users} actifs`, icon: <Users size={20} /> },
    { label: "Produits", value: stats.total_products, sub: `${stats.published_products} en ligne`, icon: <Package size={20} /> },
    { label: "Commandes", value: stats.total_orders, sub: `${stats.paid_orders} payées`, icon: <ShoppingCart size={20} /> },
    { label: "Revenu total", value: formatPrice(stats.total_revenue), sub: "commandes payées", icon: <Wallet size={20} /> },
    { label: "En attente", value: stats.pending_orders, sub: "commandes", icon: <Clock size={20} /> },
    { label: "Comptes actifs", value: stats.active_users, sub: `sur ${stats.total_users}`, icon: <UserCheck size={20} /> },
  ];

  const chartData = stats.top_categories.map((c) => ({
    name: c.name.length > 14 ? c.name.slice(0, 14) + "…" : c.name,
    produits: c.product_count,
  }));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-1">Tableau de bord</h1>
      <p className="text-sub text-sm mb-6">Vue d'ensemble de la plateforme Nexaa Market</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl2 p-4 shadow-sm">
            <span className="inline-grid place-items-center w-10 h-10 rounded-xl bg-nex-grad text-white mb-3">{c.icon}</span>
            <p className="text-2xl font-extrabold text-ink leading-none">{c.value}</p>
            <p className="text-ink font-semibold text-sm mt-1">{c.label}</p>
            <p className="text-sub text-xs">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl2 p-4 md:p-5 shadow-sm">
        <h2 className="font-bold text-ink mb-4">Produits par catégorie (top 5)</h2>
        {chartData.length === 0 ? (
          <p className="text-sub text-sm py-8 text-center">Aucune donnée.</p>
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5A5C6E" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5A5C6E" }} />
                <Tooltip cursor={{ fill: "rgba(106,63,191,0.06)" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #D6D8F0", fontSize: 13 }} />
                <Bar dataKey="produits" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill="#6A3FBF" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}