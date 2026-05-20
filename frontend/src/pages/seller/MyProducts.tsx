import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageOff, Plus, Trash2, Eye, EyeOff, Package } from "lucide-react";
import type { Product } from "../../types";
import { fetchMyProducts, updateProduct, deleteProduct } from "../../api/products";
import { formatPrice } from "../../utils/format";
import Spinner from "../../components/ui/Spinner";

export default function MyProducts() {
  const nav = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchMyProducts();
      setProducts(res.items);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(p: Product) {
    setBusy(p.id);
    try {
      const updated = await updateProduct(p.id, { is_published: !p.is_published });
      setProducts((list) => list.map((x) => (x.id === p.id ? updated : x)));
    } catch { /* */ } finally { setBusy(null); }
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Supprimer "${p.name}" ? Cette action est irréversible.`)) return;
    setBusy(p.id);
    try {
      await deleteProduct(p.id);
      setProducts((list) => list.filter((x) => x.id !== p.id));
    } catch (e) {
      alert("Suppression impossible (le produit est peut-être lié à des commandes).");
    } finally { setBusy(null); }
  }

  if (loading) return <Spinner label="Chargement de vos produits..." />;

  return (
    <div className="px-4 md:px-0 py-4 md:py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-extrabold text-ink">Mes produits</h1>
        <button onClick={() => nav("/sell")}
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-nex-grad text-white font-bold text-sm">
          <Plus size={18} /> Publier
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <span className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-silver/40 mb-4">
            <Package size={28} className="text-sub" />
          </span>
          <p className="text-ink font-bold">Aucun produit publié</p>
          <p className="text-sub text-sm mt-1">Mettez en vente vos invendus dès maintenant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl2 p-3 shadow-sm flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-silver/30 grid place-items-center shrink-0">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  : <ImageOff size={22} className="text-sub/50" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ink text-sm line-clamp-1">{p.name}</h3>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.is_published ? "bg-green-50 text-green-600" : "bg-silver/50 text-sub"
                  }`}>
                    {p.is_published ? "En ligne" : "Masqué"}
                  </span>
                </div>
                <p className="text-xs text-sub">{p.category.name}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-sub">
                  <span className="font-extrabold text-violet2 text-sm">{formatPrice(p.price)}</span>
                  <span>Stock {p.stock}</span>
                  <span className="flex items-center gap-0.5"><Eye size={12} /> {p.views_count}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => togglePublish(p)} disabled={busy === p.id}
                    className="flex items-center gap-1 text-xs font-semibold text-ink bg-silver/40 px-2.5 py-1.5 rounded-lg disabled:opacity-50">
                    {p.is_published ? <><EyeOff size={13} /> Masquer</> : <><Eye size={13} /> Publier</>}
                  </button>
                  <button onClick={() => handleDelete(p)} disabled={busy === p.id}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg disabled:opacity-50">
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}