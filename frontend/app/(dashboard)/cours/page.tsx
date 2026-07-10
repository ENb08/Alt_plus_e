"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, Trash2, Edit3, X, AlertCircle,
  BookOpen, Users, UserCheck, Hash,
} from "lucide-react";
import { api } from "@/lib/api";

type Cours = {
  id: string;
  intitule: string;
  coefficient: number;
  classe: { id: string; nom_classe: string; section: string; niveau: string };
  enseignant: {
    id: string;
    utilisateur: { id: string; nom: string; prenom: string | null; email: string };
  } | null;
  _count: { seances: number; notes: number; legons: number };
};

type Classe = { id: string; nom_classe: string; section: string; niveau: string };
type Enseignant = {
  id: string;
  utilisateur: { id: string; nom: string; prenom: string | null; email: string };
};

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { token: token || undefined };
}

export default function CoursPage() {
  const [cours, setCours] = useState<Cours[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [intitule, setIntitule] = useState("");
  const [coefficient, setCoefficient] = useState(1);
  const [classeId, setClasseId] = useState("");
  const [enseignantId, setEnseignantId] = useState("");
  const [erreur, setErreur] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCours = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/cours", authHeaders());
      setCours(data.cours);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadClasses = useCallback(async () => {
    try {
      const data = await api("/api/cours/classes/list", authHeaders());
      setClasses(data.classes);
    } catch {}
  }, []);

  const loadEnseignants = useCallback(async () => {
    try {
      const data = await api("/api/enseignants", authHeaders());
      setEnseignants(data.enseignants);
    } catch {}
  }, []);

  useEffect(() => { loadCours(); loadClasses(); loadEnseignants(); }, [loadCours, loadClasses, loadEnseignants]);

  function lockScroll() { document.body.style.overflow = "hidden"; }
  function unlockScroll() { document.body.style.overflow = ""; }

  function openCreate() {
    setEditId(null);
    setIntitule(""); setCoefficient(1); setEnseignantId("");
    setClasseId(classes[0]?.id || "");
    setErreur(""); setShowForm(true); lockScroll();
  }

  function openEdit(c: Cours) {
    setEditId(c.id);
    setIntitule(c.intitule);
    setCoefficient(c.coefficient);
    setClasseId(c.classe.id);
    setEnseignantId(c.enseignant?.id || "");
    setErreur(""); setShowForm(true); lockScroll();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErreur("");
    try {
      const body: any = { intitule, coefficient, classe_id: classeId };
      if (enseignantId) body.enseignant_id = enseignantId;

      if (editId) {
        await api(`/api/cours/${editId}`, { method: "PUT", body, ...authHeaders() });
      } else {
        await api("/api/cours", { method: "POST", body, ...authHeaders() });
      }
      setShowForm(false); unlockScroll(); loadCours();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce cours ?")) return;
    try {
      await api(`/api/cours/${id}`, { method: "DELETE", ...authHeaders() });
      loadCours();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233F]">Cours</h1>
          <p className="text-sm text-gray-400">Gérer les matières et leur affectation</p>
        </div>
        <motion.button onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#FF6B1A] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 hover:bg-[#FF6B1A]/90"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="h-4 w-4" />
          Nouveau cours
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
                {editId ? "Modifier" : "Nouveau"} cours
              </h2>
              <button onClick={() => { setShowForm(false); unlockScroll(); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Intitulé *</label>
                <input type="text" value={intitule} required onChange={(e) => setIntitule(e.target.value)}
                  placeholder="Ex: Mathématiques"
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Coefficient</label>
                  <input type="number" min={1} value={coefficient} onChange={(e) => setCoefficient(Number(e.target.value))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Classe *</label>
                  <select value={classeId} onChange={(e) => setClasseId(e.target.value)} required
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10">
                    {classes.length === 0 && <option value="">Aucune classe</option>}
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nom_classe} ({c.section})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Enseignant</label>
                <select value={enseignantId} onChange={(e) => setEnseignantId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10">
                  <option value="">Non affecté</option>
                  {enseignants.map((ens) => (
                    <option key={ens.id} value={ens.id}>
                      {ens.utilisateur.nom}{ens.utilisateur.prenom ? ` ${ens.utilisateur.prenom}` : ""}
                    </option>
                  ))}
                </select>
              </div>

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
                <th className="px-4 py-3">Intitulé</th>
                <th className="px-4 py-3">Coeff.</th>
                <th className="px-4 py-3">Classe</th>
                <th className="px-4 py-3">Enseignant</th>
                <th className="px-4 py-3">Activité</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cours.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 text-[#13233F] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-[#FF6B1A]" />
                      {c.intitule}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Hash className="h-3 w-3" />
                      {c.coefficient}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.classe.nom_classe}</td>
                  <td className="px-4 py-3">
                    {c.enseignant ? (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <UserCheck className="h-3.5 w-3.5 text-green-500" />
                        {c.enseignant.utilisateur.nom}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{c._count.legons} leçons</span>
                      <span>{c._count.seances} séances</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#FF6B1A]">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cours.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    Aucun cours trouvé
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
