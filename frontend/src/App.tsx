import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6">
      <div className="mt-6 rounded-xl2 bg-white p-8 text-center shadow-sm">
        <p className="text-sub">Écran à venir</p>
        <h2 className="text-ink text-xl font-bold mt-1">{title}</h2>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Auth (hors shell, pas de bottom nav) */}
      <Route path="/login" element={<Placeholder title="Connexion" />} />
      <Route path="/register" element={<Placeholder title="Inscription" />} />

      {/* Pages avec shell + bottom nav */}
      <Route path="/" element={<AppShell><Placeholder title="Catalogue" /></AppShell>} />
      <Route path="/product/:id" element={<AppShell><Placeholder title="Détail produit" /></AppShell>} />
      <Route path="/categories" element={<AppShell><Placeholder title="Catégories" /></AppShell>} />
      <Route path="/cart" element={<AppShell><Placeholder title="Panier" /></AppShell>} />

      {/* Pages protégées */}
      <Route path="/profile" element={<ProtectedRoute><AppShell><Placeholder title="Profil" /></AppShell></ProtectedRoute>} />
      <Route path="/sell" element={<ProtectedRoute><AppShell><Placeholder title="Publier un produit" /></AppShell></ProtectedRoute>} />
      <Route path="/my-products" element={<ProtectedRoute><AppShell><Placeholder title="Mes produits" /></AppShell></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><AppShell><Placeholder title="Mes commandes" /></AppShell></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><AppShell><Placeholder title="Mes ventes" /></AppShell></ProtectedRoute>} />
      <Route path="/checkout/success" element={<Placeholder title="Paiement réussi" />} />
      <Route path="/checkout/cancel" element={<Placeholder title="Paiement annulé" />} />

      <Route path="*" element={<Placeholder title="Page introuvable" />} />
    </Routes>
  );
}