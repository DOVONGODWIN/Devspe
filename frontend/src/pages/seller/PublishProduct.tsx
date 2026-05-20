import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Check, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import type { Category } from "../../types";
import { fetchCategories, createProduct } from "../../api/products";
import { uploadImage } from "../../api/uploads";
import { imageUrl } from "../../utils/format";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";

export default function PublishProduct() {
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "", description: "", color: "", price: "", stock: "1", image_url: "", category_id: "",
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories().then((cats) => {
      setCategories(cats);
      if (cats.length) setForm((f) => ({ ...f, category_id: cats[0].id }));
    }).catch(() => {});
  }, []);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      set("image_url", url);
    } catch (err) {
      const ax = err as AxiosError<{ detail?: string }>;
      setError(ax.response?.data?.detail || "Échec de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.description.length < 10) {
      setError("La description doit faire au moins 10 caractères.");
      return;
    }
    setLoading(true);
    try {
      await createProduct({
        name: form.name,
        description: form.description,
        color: form.color || null,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        image_url: form.image_url || null,
        category_id: form.category_id,
      });
      nav("/my-products");
    } catch (err) {
      const ax = err as AxiosError<{ detail?: string }>;
      setError(ax.response?.data?.detail || "Impossible de publier le produit.");
    } finally {
      setLoading(false);
    }
  }

  const preview = imageUrl(form.image_url);

  return (
    <div className="px-4 md:px-0 py-4 md:py-6 max-w-2xl mx-auto pb-28 md:pb-6">
      <h1 className="text-2xl font-extrabold text-ink mb-5">Publier un produit</h1>

      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">{error}</div>
        )}

        {/* Upload image */}
        <div>
          <span className="block text-sm font-semibold text-ink mb-1.5">Photo du produit</span>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
            onChange={handleFile} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-full aspect-video rounded-xl2 overflow-hidden border-2 border-dashed border-silver grid place-items-center bg-white relative">
            {uploading ? (
              <div className="flex flex-col items-center text-sub">
                <Loader2 size={32} className="animate-spin mb-1" />
                <p className="text-sm">Envoi en cours...</p>
              </div>
            ) : preview ? (
              <img src={preview} alt="aperçu" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-sub">
                <ImagePlus size={32} className="mx-auto mb-1" />
                <p className="text-sm font-semibold">Ajouter une photo</p>
                <p className="text-xs">JPG, PNG ou WEBP · 5 Mo max</p>
              </div>
            )}
          </button>
          {preview && !uploading && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="text-sm font-semibold text-violet2 mt-2">
              Changer la photo
            </button>
          )}
        </div>

        <TextField label="Nom du produit" required value={form.name}
          onChange={(e) => set("name", e.target.value)} placeholder="Ex : Baya lumineuse" />

        <div>
          <span className="block text-sm font-semibold text-ink mb-1.5">Description</span>
          <textarea required value={form.description} onChange={(e) => set("description", e.target.value)}
            rows={4} placeholder="Décrivez votre produit (10 caractères minimum)"
            className="w-full px-4 py-3 rounded-xl2 bg-white border border-silver/70 outline-none focus:border-primary resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Couleur" value={form.color}
            onChange={(e) => set("color", e.target.value)} placeholder="Vert" />
          <div>
            <span className="block text-sm font-semibold text-ink mb-1.5">Catégorie</span>
            <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}
              className="w-full h-12 px-4 rounded-xl2 bg-white border border-silver/70 outline-none focus:border-primary">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Prix (€)" type="number" step="0.01" min="0.01" required value={form.price}
            onChange={(e) => set("price", e.target.value)} placeholder="12.50" />
          <TextField label="Stock" type="number" min="0" required value={form.stock}
            onChange={(e) => set("stock", e.target.value)} placeholder="1" />
        </div>

        <Button type="submit" loading={loading} disabled={uploading}>
          <Check size={18} /> Publier le produit
        </Button>
      </form>
    </div>
  );
}