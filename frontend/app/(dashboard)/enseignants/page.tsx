"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  UserPlus, Users, Search, Trash2, Edit3, X, AlertCircle,
  GraduationCap, BookOpen, FileText, Star,
} from "lucide-react";
import { api } from "@/lib/api";

type Enseignant = {
  id: string;
  specialite: string | null;
  est_titulaire: boolean;
  utilisateur: { id: string; nom: string; prenom: string | null; email: string; actif: boolean };
  _count: { cours: number; classes: number; legons: number };
};

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { token: token || undefined };
}

export default function EnseignantsPage() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [estTitulaire, setEstTitulaire] = useState(false);
  const [erreur, setErreur] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/enseignants", authHeaders());
      setEnseignants(data.enseignants);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function lockScroll() { document.body.style.overflow = "hidden"; }
  function unlockScroll() { document.body.style.overflow = ""; }

  function openCreate() {
    setEditId(null);
    setNom(""); setPrenom(""); setEmail(""); setMotDePasse("");
    setSpecialite(""); setEstTitulaire(false);
    setErreur(""); setShowForm(true); lockScroll();
  }

  function openEdit(e: Enseignant) {
    setEditId(e.id);
    setNom(e.utilisateur.nom);
    setPrenom(e.utilisateur.prenom || "");
    setEmail(e.utilisateur.email);
    setMotDePasse("");
    setSpecialite(e.specialite || "");
    setEstTitulaire(e.est_titulaire);
    setErreur(""); setShowForm(true); lockScroll();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErreur("");
    try {
      const body: any = { nom, email, mot_de_passe: motDePasse, est_titulaire: estTitulaire };
      if (prenom) body.prenom = prenom;
      if (specialite) body.specialite = specialite;

      if (editId) {
        delete body.mot_de_passe;
        if (motDePasse) body.mot_de_passe = motDePasse;
        await api(`/api/enseignants/${editId}`, { method: "PUT", body, ...authHeaders() });
      } else {
        await api("/api/enseignants", { method: "POST", body, ...authHeaders() });
      }
      setShowForm(false); unlockScroll(); load();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Désactiver cet enseignant ?")) return;
    try {
      await api(`/api/enseignants/${id}`, { method: "DELETE", ...authHeaders() });
      load();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233F]">Enseignants</h1>
          <p className="text-sm text-gray-400">Gérer les enseignants de votre école</p>
        </div>
        <motion.button onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#FF6B1A] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 hover:bg-[#FF6B1A]/90"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <UserPlus className="h-4 w-4" />
          Nouvel enseignant
        </motion.button>
      </div>

      {erreur && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {erreur}
        </div>
      )}

      {showForm && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm pt-10 pb-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setShowForm(false); unlockScroll(); }}>
          <motion.div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#13233F]">
                {editId ? "Modifier" : "Nouvel"} enseignant
              </h2>
              <button onClick={() => { setShowForm(false); unlockScroll(); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
                  <input type="text" value={nom} required onChange={(e) => setNom(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Prénom</label>
                  <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {editId ? "Nouveau mot de passe (laisser vide)" : "Mot de passe *"}
                </label>
                <input type="password" value={motDePasse} required={!editId} onChange={(e) => setMotDePasse(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Spécialité</label>
                <input type="text" value={specialite} onChange={(e) => setSpecialite(e.target.value)}
                  placeholder="Ex: Mathématiques, Français..."
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 cursor-pointer hover:border-[#FF6B1A]">
                <input type="checkbox" checked={estTitulaire} onChange={(e) => setEstTitulaire(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF6B1A] focus:ring-[#FF6B1A]" />
                <span className="text-sm text-gray-700">Enseignant titulaire</span>
              </label>

              <motion.button type="submit" disabled={saving}
                className="h-10 w-full rounded-xl bg-[#FF6B1A] text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 hover:bg-[#FF6B1A]/90 disabled:opacity-60"
                whileTap={{ scale: 0.98 }}>
                {saving ? "Enregistrement..." : editId ? "Modifier" : "Créer"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-left text-xs font-medium text-gray-400">
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Spécialité</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Activité</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enseignants.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 text-[#13233F] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">
                    {e.utilisateur.nom}
                    {e.utilisateur.prenom && <span className="text-gray-400"> {e.utilisateur.prenom}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{e.utilisateur.email}</td>
                  <td className="px-4 py-3 text-gray-500">{e.specialite || "—"}</td>
                  <td className="px-4 py-3">
                    {e.est_titulaire ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                        <Star className="h-3 w-3" />
                        Titulaire
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">Non titulaire</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" />{e._count.cours}</span>
                      <span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" />{e._count.classes}</span>
                      <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" />{e._count.legons}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(e)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#FF6B1A]">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(e.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {enseignants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    Aucun enseignant trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
