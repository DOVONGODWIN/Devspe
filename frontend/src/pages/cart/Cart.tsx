import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ImageOff, ShoppingCart, AlertCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { checkout } from "../../api/orders";
import { formatPrice } from "../../utils/format";
import { AxiosError } from "axios";

export default function Cart() {
  const { lines, total, setQty, remove, count } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!user) { nav("/login"); return; }
    setError("");
    setLoading(true);
    try {
      const items = lines.map((l) => ({ product_id: l.product.id, quantity: l.quantity }));
      const res = await checkout(items);
      window.location.href = res.checkout_url;
    } catch (err) {
      const ax = err as AxiosError<{ detail?: string }>;
      setError(ax.response?.data?.detail || "Impossible de procéder au paiement.");
      setLoading(false);
    }
  }

  if (count === 0) {
    return (
      <div className="text-center py-20 px-4">
        <span className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-silver/40 mb-4">
          <ShoppingCart size={28} className="text-sub" />
        </span>
        <p className="text-ink font-bold text-lg">Votre panier est vide</p>
        <p className="text-sub text-sm mt-1">Découvrez nos produits et trouvez votre bonheur.</p>
        <button onClick={() => nav("/")} className="mt-5 px-6 h-12 rounded-xl2 bg-nex-grad text-white font-bold">
          Explorer le catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0 py-4 md:py-6">
      <h1 className="text-2xl font-extrabold text-ink mb-5">Mon panier</h1>

      <div className="md:grid md:grid-cols-3 md:gap-6 md:items-start">
        {/* Lignes */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {lines.map((l) => (
            <CartLine key={l.product.id} line={l} onQty={setQty} onRemove={remove} />
          ))}
        </div>

        {/* Récapitulatif */}
        <div className="mt-5 md:mt-0 bg-white rounded-xl2 p-5 shadow-sm md:sticky md:top-20">
          <h2 className="font-bold text-ink mb-3">Récapitulatif</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-sub">Sous-total ({count} article{count > 1 ? "s" : ""})</span>
            <span className="font-semibold text-ink">{formatPrice(total)}</span>
          </div>
          <div className="h-px bg-silver/60 my-3" />
          <div className="flex justify-between mb-4">
            <span className="font-bold text-ink">Total</span>
            <span className="font-extrabold text-violet2 text-lg">{formatPrice(total)}</span>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm font-medium px-3 py-2.5 rounded-xl mb-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button onClick={handleCheckout} disabled={loading}
            className="w-full h-12 rounded-xl2 bg-nex-grad text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[.98] transition">
            {loading
              ? <><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Redirection...</>
              : "Passer au paiement"}
          </button>
          {!user && (
            <p className="text-xs text-sub text-center mt-2">Connexion requise pour payer.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CartLine({ line, onQty, onRemove }: {
  line: { product: any; quantity: number };
  onQty: (id: string, n: number) => void;
  onRemove: (id: string) => void;
}) {
  const { product, quantity } = line;
  const lineTotal = parseFloat(product.price) * quantity;
  return (
    <div className="bg-white rounded-xl2 p-3 shadow-sm flex gap-3">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-silver/30 shrink-0 grid place-items-center">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          : <ImageOff size={24} className="text-sub/50" />}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-ink text-sm line-clamp-1">{product.name}</h3>
        <p className="text-xs text-sub">{product.category.name}</p>
        <p className="font-extrabold text-violet2 mt-1">{formatPrice(lineTotal)}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button onClick={() => onRemove(product.id)} className="text-sub hover:text-red-500 p-1">
          <Trash2 size={18} />
        </button>
        <div className="flex items-center gap-1 bg-silver/30 rounded-lg px-1">
          <button onClick={() => onQty(product.id, quantity - 1)}
            className="w-7 h-7 grid place-items-center text-ink">
            <Minus size={15} />
          </button>
          <span className="font-bold text-ink text-sm w-5 text-center">{quantity}</span>
          <button onClick={() => onQty(product.id, Math.min(product.stock, quantity + 1))}
            className="w-7 h-7 grid place-items-center text-ink disabled:opacity-30"
            disabled={quantity >= product.stock}>
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}