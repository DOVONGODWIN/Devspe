import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, fullName);
      nav("/");
    } catch (err) {
      const ax = err as AxiosError<{ detail?: string }>;
      setError(ax.response?.data?.detail || "Inscription impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez Nexaa Market en quelques secondes">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">{error}</div>
        )}
        <TextField label="Nom complet" type="text" value={fullName}
          onChange={(e) => setFullName(e.target.value)} placeholder="Godwin Messanh" />
        <TextField label="Email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
        <TextField label="Mot de passe" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" />
        <Button type="submit" loading={loading}>Créer mon compte</Button>
      </form>
      <p className="text-center text-sm text-sub mt-5">
        Déjà inscrit ?{" "}
        <Link to="/login" className="text-primary font-bold">Se connecter</Link>
      </p>
    </AuthLayout>
  );
}