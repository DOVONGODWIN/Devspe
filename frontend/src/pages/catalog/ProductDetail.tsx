import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Minus, Plus, ImageOff, ShoppingCart, Check } from "lucide-react";
import type { Product } from "../../types";
import { fetchProduct } from "../../api/products";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";
import Spinner from "../../components/ui/Spinner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { add } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    if (!product) return;
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (loading) return <Spinner label="Chargement du produit..." />;

  if (notFound || !product) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-ink font-semibold">Produit introuvable</p>
        <button onClick={() => nav("/")} className="mt-4 px-5 h-11 rounded-xl2 bg-nex-grad text-white font-bold">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  return (
    <div className="md:py-6">
      {/* Bouton retour */}
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-1 text-sub font-semibold px-4 md:px-0 pt-4 md:pt-0 mb-3"
      >
        <ChevronLeft size={20} /> Retour
      </button>

      <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
        {/* Image */}
        <div className="relative aspect-square md:rounded-[28px] overflow-hidden bg-silver/30 md:shadow-sm">
          {product.image_url && !imgError ? (
            <img src={product.image_url} alt={product.name} onError={() => setImgError(true)}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-sub/50">
              <ImageOff size={48} />
            </div>
          )}
          <button
            onClick={() => setFav((f) => !f)}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow"
          >
            <Heart size={20} className={fav ? "fill-violet2 text-violet2" : "text-sub"} />
          </button>
        </div>

        {/* Infos */}
        <div className="px-4 md:px-0 pt-5 md:pt-0">
          <span className="inline-block text-xs font-semibold text-violet2 bg-violet2/10 px-3 py-1 rounded-full mb-2">
            {product.category.name}
          </span>
          <h1 className="text-2xl font-extrabold text-ink leading-tight">{product.name}</h1>
          <p className="text-3xl font-extrabold text-violet2 mt-2">{formatPrice(product.price)}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
            {product.color && (
              <div>
                <span className="text-sub">Couleur : </span>
                <span className="font-semibold text-ink">{product.color}</span>
              </div>
            )}
            <div>
              <span className="text-sub">Stock : </span>
              <span className={`font-semibold ${outOfStock ? "text-red-500" : "text-ink"}`}>
                {outOfStock ? "Épuisé" : `${product.stock} disponible${product.stock > 1 ? "s" : ""}`}
              </span>
            </div>
            {product.seller.full_name && (
              <div>
                <span className="text-sub">Vendeur : </span>
                <span className="font-semibold text-ink">{product.seller.full_name}</span>
              </div>
            )}
          </div>

          <div className="mt-5">
            <h2 className="font-bold text-ink mb-1">Description</h2>
            <p className="text-sub leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* Quantité + ajout (desktop : inline) */}
          {!outOfStock && (
            <div className="hidden md:flex items-center gap-4 mt-6">
              <QtyStepper qty={qty} setQty={setQty} max={product.stock} />
              <button onClick={handleAdd}
                className="flex-1 h-12 rounded-xl2 bg-nex-grad text-white font-bold flex items-center justify-center gap-2 active:scale-[.98] transition">
                {added ? <><Check size={20} /> Ajouté</> : <><ShoppingCart size={20} /> Ajouter au panier</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barre d'ajout fixe (mobile uniquement) */}
      {!outOfStock && (
        <div
          className="md:hidden fixed left-0 right-0 bottom-0 z-30 bg-white border-t border-silver/50 px-4 pt-3 flex items-center gap-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
        >
          <QtyStepper qty={qty} setQty={setQty} max={product.stock} />
          <button onClick={handleAdd}
            className="flex-1 h-12 rounded-xl2 bg-nex-grad text-white font-bold flex items-center justify-center gap-2 active:scale-[.98] transition">
            {added ? <><Check size={20} /> Ajouté</> : <><ShoppingCart size={20} /> Ajouter</>}
          </button>
        </div>
      )}
    </div>
  );
}

function QtyStepper({ qty, setQty, max }: { qty: number; setQty: (n: number) => void; max: number }) {
  return (
    <div className="flex items-center gap-3 bg-white md:bg-silver/30 rounded-xl2 px-2 h-12 border border-silver/60">
      <button onClick={() => setQty(Math.max(1, qty - 1))}
        className="w-9 h-9 grid place-items-center rounded-lg text-ink disabled:opacity-30" disabled={qty <= 1}>
        <Minus size={18} />
      </button>
      <span className="font-bold text-ink w-6 text-center">{qty}</span>
      <button onClick={() => setQty(Math.min(max, qty + 1))}
        className="w-9 h-9 grid place-items-center rounded-lg text-ink disabled:opacity-30" disabled={qty >= max}>
        <Plus size={18} />
      </button>
    </div>
  );
}