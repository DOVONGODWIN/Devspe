import { useNavigate } from "react-router-dom";
import { Heart, ImageOff } from "lucide-react";
import { useState } from "react";
import type { Product } from "../../types";
import { formatPrice, imageUrl } from "../../utils/format";

export default function ProductCard({ product }: { product: Product }) {
  const nav = useNavigate();
  const [fav, setFav] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => nav(`/product/${product.id}`)}
      className="bg-white rounded-xl2 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
    >
      <div className="relative aspect-square bg-silver/30">
        {imageUrl(product.image_url) && !imgError ? (
          <img
            src={imageUrl(product.image_url)!}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-sub/50">
            <ImageOff size={32} />
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setFav((f) => !f); }}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-sm"
          aria-label="Favori"
        >
          <Heart size={18} className={fav ? "fill-violet2 text-violet2" : "text-sub"} />
        </button>
        {product.stock === 0 && (
          <span className="absolute bottom-2 left-2 bg-ink/80 text-white text-xs font-semibold px-2 py-1 rounded-lg">
            Épuisé
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-sub mb-0.5">{product.category.name}</p>
        <h3 className="font-semibold text-ink text-sm leading-tight line-clamp-1">{product.name}</h3>
        <p className="font-extrabold text-violet2 mt-1.5">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}