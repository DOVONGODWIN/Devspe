import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || "Identifiants incorrects.");
      } else {
        setError((err as Error).message || "Connexion impossible.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-nexbg">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-nex-grad mb-3">
            <ShoppingBag size={26} color="#fff" />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Nexaa Admin</h1>
          <p className="text-sub text-sm flex items-center gap-1 mt-1">
            <ShieldCheck size={14} /> Back-office réservé aux administrateurs
          </p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-[28px] shadow-xl shadow-ink/5 p-6 flex flex-col gap-4">
          {error && <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">{error}</div>}
          <label className="block">
            <span className="block text-sm font-semibold text-ink mb-1.5">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nexaa.com"
              className="w-full h-12 px-4 rounded-xl2 bg-white border border-silver/70 outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-ink mb-1.5">Mot de passe</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl2 bg-white border border-silver/70 outline-none focus:border-primary" />
          </label>
          <button type="submit" disabled={loading}
            className="w-full h-12 rounded-xl2 bg-nex-grad text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}