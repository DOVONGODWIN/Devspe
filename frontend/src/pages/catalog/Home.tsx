import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, X, ShoppingBag } from "lucide-react";
import type { Product, Category } from "../../types";
import { fetchProducts, fetchCategories } from "../../api/products";
import ProductCard from "../../components/product/ProductCard";
import Spinner from "../../components/ui/Spinner";

const PAGE_SIZE = 12;

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({
        page,
        page_size: PAGE_SIZE,
        search: search || undefined,
        category_id: activeCat || undefined,
        min_price: minPrice ? parseFloat(minPrice) : undefined,
        max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      });
      setProducts(res.items);
      setTotal(res.total);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeCat, minPrice, maxPrice]);

  useEffect(() => { load(); }, [load]);

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  function resetFilters() {
    setMinPrice(""); setMaxPrice(""); setActiveCat(null); setSearch(""); setPage(1);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="px-4 md:px-0 pt-4">
      {/* Recherche */}
      <form onSubmit={applySearch} className="mb-4">
        <div className="flex items-center gap-2 bg-white rounded-xl2 px-4 h-12 shadow-sm">
          <Search size={20} className="text-sub" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher des produits"
            className="flex-1 bg-transparent outline-none text-ink placeholder:text-sub/60"
          />
          {search && (
            <button type="button" onClick={() => { setSearch(""); setPage(1); }}>
              <X size={18} className="text-sub" />
            </button>
          )}
        </div>
      </form>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[28px] bg-nex-grad p-6 md:p-10 mb-5">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute right-6 bottom-2 w-28 h-28 rounded-full bg-white/5" />
        <div className="relative">
          <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur mb-3">
            <ShoppingBag size={24} color="#fff" />
          </span>
          <h1 className="text-white text-2xl md:text-4xl font-extrabold leading-tight">Nexaa Market</h1>
          <p className="text-white/85 mt-1 max-w-md">
            Donnez une seconde vie aux invendus. Achetez malin, vendez facilement.
          </p>
        </div>
      </div>

      {/* Chips catégories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        <Chip label="Tout" active={activeCat === null} onClick={() => { setActiveCat(null); setPage(1); }} />
        {categories.map((c) => (
          <Chip key={c.id} label={c.name} active={activeCat === c.id}
            onClick={() => { setActiveCat(c.id); setPage(1); }} />
        ))}
      </div>

      {/* Barre filtres prix */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 bg-white rounded-xl px-3 h-10 shadow-sm text-sm font-semibold text-ink shrink-0"
        >
          <SlidersHorizontal size={16} /> Filtres
        </button>
        {(activeCat || minPrice || maxPrice || search) && (
          <button onClick={resetFilters} className="text-sm font-semibold text-violet2 px-2">
            Réinitialiser
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl2 p-4 mb-5 shadow-sm flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[120px]">
            <span className="block text-xs font-semibold text-sub mb-1">Prix min</span>
            <input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0" className="w-full h-10 px-3 rounded-xl border border-silver/70 outline-none focus:border-primary" />
          </label>
          <label className="flex-1 min-w-[120px]">
            <span className="block text-xs font-semibold text-sub mb-1">Prix max</span>
            <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="999" className="w-full h-10 px-3 rounded-xl border border-silver/70 outline-none focus:border-primary" />
          </label>
          <button onClick={() => { setPage(1); load(); }}
            className="h-10 px-6 rounded-xl bg-nex-grad text-white font-bold">OK</button>
        </div>
      )}

      {/* Grille produits */}
      {loading ? (
        <Spinner label="Chargement des produits..." />
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink font-semibold">Aucun produit trouvé</p>
          <p className="text-sub text-sm mt-1">Essayez de modifier vos filtres.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="px-4 h-10 rounded-xl bg-white shadow-sm font-semibold text-ink disabled:opacity-40">
                Précédent
              </button>
              <span className="text-sm text-sub px-2">Page {page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
                className="px-4 h-10 rounded-xl bg-white shadow-sm font-semibold text-ink disabled:opacity-40">
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`shrink-0 px-4 h-9 rounded-full text-sm font-semibold transition ${
        active ? "bg-nex-grad text-white shadow-sm" : "bg-white text-sub border border-silver/60"
      }`}>
      {label}
    </button>
  );
}