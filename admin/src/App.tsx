import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

function Placeholder({ title }: { title: string }) {
  return <div className="bg-white rounded-xl2 p-8 text-center shadow-sm"><h2 className="text-xl font-bold text-ink">{title}</h2></div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout><Placeholder title="Tableau de bord" /></Layout></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Layout><Placeholder title="Utilisateurs" /></Layout></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Layout><Placeholder title="Produits" /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}