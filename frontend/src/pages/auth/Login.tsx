import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";

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
      const ax = err as AxiosError<{ detail?: string }>;
      setError(ax.response?.data?.detail || "Connexion impossible. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Bon retour" subtitle="Connectez-vous à votre compte Nexaa">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">{error}</div>
        )}
        <TextField label="Email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
        <TextField label="Mot de passe" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <Button type="submit" loading={loading}>Se connecter</Button>
      </form>
      <p className="text-center text-sm text-sub mt-5">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-primary font-bold">Créer un compte</Link>
      </p>
    </AuthLayout>
  );
}