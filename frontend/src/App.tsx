import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/catalog/Home";
import ProductDetail from "./pages/catalog/ProductDetail";
import Cart from "./pages/cart/Cart";
import CheckoutSuccess from "./pages/cart/CheckoutSuccess";
import CheckoutCancel from "./pages/cart/CheckoutCancel";
import Profile from "./pages/profile/Profile";
import PublishProduct from "./pages/seller/PublishProduct";
import MyOrders from "./pages/profile/MyOrders";
import MyProducts from "./pages/seller/MyProducts";
import SellerDashboard from "./pages/seller/SellerDashboard";

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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Pages avec shell + bottom nav */}
      <Route path="/" element={<AppShell><Home /></AppShell>} />
      <Route path="/product/:id" element={<AppShell><ProductDetail /></AppShell>} />
      <Route path="/categories" element={<AppShell><Placeholder title="Catégories" /></AppShell>} />
      <Route path="/cart" element={<AppShell><Cart /></AppShell>} />
      <Route path="/checkout/success" element={<AppShell><CheckoutSuccess /></AppShell>} />
      <Route path="/checkout/cancel" element={<AppShell><CheckoutCancel /></AppShell>} />

      {/* Pages protégées */}
      <Route path="/profile" element={<ProtectedRoute><AppShell><Profile /></AppShell></ProtectedRoute>} />
      <Route path="/sell" element={<ProtectedRoute><AppShell><PublishProduct /></AppShell></ProtectedRoute>} />
      <Route path="/my-products" element={<ProtectedRoute><AppShell><MyProducts /></AppShell></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><AppShell><MyOrders /></AppShell></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><AppShell><SellerDashboard /></AppShell></ProtectedRoute>} />

      <Route path="*" element={<Placeholder title="Page introuvable" />} />
    </Routes>
  );
}