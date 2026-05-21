import { useEffect, useState, useCallback } from "react";
import { Search, ShieldCheck, ShieldOff, Ban, CheckCircle2 } from "lucide-react";
import type { User } from "../types";
import { fetchUsers, updateUser } from "../api/admin";
import Spinner from "../components/Spinner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers({ search: search || undefined, page: 1 });
      setUsers(res.items);
    } catch { setUsers([]); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(u: User) {
    setBusy(u.id);
    try {
      const updated = await updateUser(u.id, { is_active: !u.is_active });
      setUsers((list) => list.map((x) => x.id === u.id ? updated : x));
    } catch { /* */ } finally { setBusy(null); }
  }

  async function toggleAdmin(u: User) {
    setBusy(u.id);
    try {
      const updated = await updateUser(u.id, { role: u.role === "admin" ? "user" : "admin" });
      setUsers((list) => list.map((x) => x.id === u.id ? updated : x));
    } catch { /* */ } finally { setBusy(null); }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-4">Utilisateurs</h1>

      <form onSubmit={(e) => { e.preventDefault(); load(); }} className="mb-4">
        <div className="flex items-center gap-2 bg-white rounded-xl2 px-4 h-12 shadow-sm max-w-md">
          <Search size={18} className="text-sub" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par email ou nom"
            className="flex-1 bg-transparent outline-none text-ink" />
        </div>
      </form>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-silver/50 text-left text-sub">
                  <th className="px-4 py-3 font-semibold">Utilisateur</th>
                  <th className="px-4 py-3 font-semibold">Rôle</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-silver/30 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{u.full_name || "—"}</p>
                      <p className="text-sub text-xs">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        u.role === "admin" ? "bg-violet2/10 text-violet2" : "bg-silver/40 text-sub"
                      }`}>{u.role === "admin" ? "Admin" : "Utilisateur"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        u.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                      }`}>{u.is_active ? "Actif" : "Désactivé"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleAdmin(u)} disabled={busy === u.id}
                          title={u.role === "admin" ? "Rétrograder" : "Promouvoir admin"}
                          className="p-2 rounded-lg hover:bg-silver/40 text-violet2 disabled:opacity-40">
                          {u.role === "admin" ? <ShieldOff size={17} /> : <ShieldCheck size={17} />}
                        </button>
                        <button onClick={() => toggleActive(u)} disabled={busy === u.id}
                          title={u.is_active ? "Désactiver" : "Réactiver"}
                          className={`p-2 rounded-lg disabled:opacity-40 ${u.is_active ? "text-red-500 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}>
                          {u.is_active ? <Ban size={17} /> : <CheckCircle2 size={17} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-sub">Aucun utilisateur trouvé.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}