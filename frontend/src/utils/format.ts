export function formatPrice(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:8003/api/v1")
  .replace(/\/api\/v1\/?$/, "");

export function imageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;        // lien externe ou déjà absolu
  return `${API_ORIGIN}${path}`;                    // /uploads/xxx -> http://localhost:8003/uploads/xxx
}