import { useEffect, useState, useCallback } from "react";
import { Search, Eye, EyeOff, Trash2, ImageOff } from "lucide-react";
import type { Product } from "../types";
import { fetchAllProducts, updateProduct, deleteProduct } from "../api/admin";
import { formatPrice, imageUrl } from "../utils/format";
import Spinner from "../components/Spinner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllProducts({ search: search || undefined, page: 1 });
      setProducts(res.items);
    } catch { setProducts([]); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  async function togglePublish(p: Product) {
    setBusy(p.id);
    try {
      const updated = await updateProduct(p.id, { is_published: !p.is_published });
      setProducts((list) => list.map((x) => x.id === p.id ? updated : x));
    } catch { /* */ } finally { setBusy(null); }
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Supprimer "${p.name}" ? Irréversible.`)) return;
    setBusy(p.id);
    try {
      await deleteProduct(p.id);
      setProducts((list) => list.filter((x) => x.id !== p.id));
    } catch {
      alert("Suppression impossible (produit lié à des commandes).");
    } finally { setBusy(null); }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-4">Produits</h1>

      <form onSubmit={(e) => { e.preventDefault(); load(); }} className="mb-4">
        <div className="flex items-center gap-2 bg-white rounded-xl2 px-4 h-12 shadow-sm max-w-md">
          <Search size={18} className="text-sub" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit"
            className="flex-1 bg-transparent outline-none text-ink" />
        </div>
      </form>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((p) => {
            const img = imageUrl(p.image_url);
            return (
              <div key={p.id} className="bg-white rounded-xl2 p-3 shadow-sm flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-silver/30 grid place-items-center shrink-0">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <ImageOff size={22} className="text-sub/50" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink text-sm line-clamp-1">{p.name}</h3>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.is_published ? "bg-green-50 text-green-600" : "bg-silver/50 text-sub"
                    }`}>{p.is_published ? "En ligne" : "Masqué"}</span>
                  </div>
                  <p className="text-xs text-sub">{p.category.name} · {p.seller.full_name || "—"}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-sub">
                    <span className="font-extrabold text-violet2 text-sm">{formatPrice(p.price)}</span>
                    <span>Stock {p.stock}</span>
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
            );
          })}
          {products.length === 0 && <p className="text-sub text-center py-8 col-span-full">Aucun produit.</p>}
        </div>
      )}
    </div>
  );
}