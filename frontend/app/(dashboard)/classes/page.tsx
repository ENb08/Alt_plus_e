"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Plus, Search, Trash2, Edit3, X, AlertCircle,
  GraduationCap, Users, UserCheck,
} from "lucide-react";
import { api } from "@/lib/api";

type Classe = {
  id: string;
  nom_classe: string;
  section: string;
  niveau: string;
  annee_scolaire_id: string;
  titulaire_id: string | null;
  titulaire: {
    id: string;
    utilisateur: { id: string; nom: string; prenom: string | null; email: string };
  } | null;
  _count: { eleves: number };
};

type Enseignant = {
  id: string;
  specialite: string | null;
  est_titulaire: boolean;
  utilisateur: { id: string; nom: string; prenom: string | null; email: string };
};

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { token: token || undefined };
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nomClasse, setNomClasse] = useState("");
  const [section, setSection] = useState("Primaire");
  const [niveau, setNiveau] = useState("");
  const [titulaireId, setTitulaireId] = useState("");
  const [erreur, setErreur] = useState("");
  const [saving, setSaving] = useState(false);

  const loadClasses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/classes", authHeaders());
      setClasses(data.classes);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEnseignants = useCallback(async () => {
    try {
      const data = await api("/api/classes/enseignants/list", authHeaders());
      setEnseignants(data.enseignants);
    } catch {}
  }, []);

  useEffect(() => { loadClasses(); loadEnseignants(); }, [loadClasses, loadEnseignants]);

  function lockScroll() { document.body.style.overflow = "hidden"; }
  function unlockScroll() { document.body.style.overflow = ""; }

  function openCreate() {
    setEditId(null);
    setNomClasse("");
    setSection("Primaire");
    setNiveau("");
    setTitulaireId("");
    setErreur("");
    setShowForm(true);
    lockScroll();
  }

  function openEdit(c: Classe) {
    setEditId(c.id);
    setNomClasse(c.nom_classe);
    setSection(c.section);
    setNiveau(c.niveau);
    setTitulaireId(c.titulaire_id || "");
    setErreur("");
    setShowForm(true);
    lockScroll();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErreur("");
    try {
      const body: any = { nom_classe: nomClasse, section, niveau };
      if (titulaireId) body.titulaire_id = titulaireId;

      if (editId) {
        await api(`/api/classes/${editId}`, { method: "PUT", body, ...authHeaders() });
      } else {
        await api("/api/classes", { method: "POST", body, ...authHeaders() });
      }
      setShowForm(false);
      unlockScroll();
      loadClasses();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette classe ? Cette action est irréversible.")) return;
    try {
      await api(`/api/classes/${id}`, { method: "DELETE", ...authHeaders() });
      loadClasses();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    }
  }

  const sectionColor = (s: string) => {
    switch (s) {
      case "Maternelle": return "bg-pink-50 text-pink-600";
      case "Primaire": return "bg-blue-50 text-blue-600";
      case "Secondaire": return "bg-purple-50 text-purple-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233F]">Classes</h1>
          <p className="text-sm text-gray-400">Gérer les classes de votre école</p>
        </div>
        <motion.button onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#FF6B1A] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 hover:bg-[#FF6B1A]/90"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="h-4 w-4" />
          Nouvelle classe
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
                {editId ? "Modifier" : "Nouvelle"} classe
              </h2>
              <button onClick={() => { setShowForm(false); unlockScroll(); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nom de la classe *</label>
                <input type="text" value={nomClasse} required onChange={(e) => setNomClasse(e.target.value)}
                  placeholder="Ex: 6ème A"
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Section *</label>
                  <select value={section} onChange={(e) => setSection(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10">
                    <option value="Maternelle">Maternelle</option>
                    <option value="Primaire">Primaire</option>
                    <option value="Secondaire">Secondaire</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Niveau *</label>
                  <input type="text" value={niveau} required onChange={(e) => setNiveau(e.target.value)}
                    placeholder="Ex: 6ème"
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Enseignant titulaire</label>
                <select value={titulaireId} onChange={(e) => setTitulaireId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10">
                  <option value="">Non attribué</option>
                  {enseignants.map((ens) => (
                    <option key={ens.id} value={ens.id}>
                      {ens.utilisateur.nom}{ens.utilisateur.prenom ? ` ${ens.utilisateur.prenom}` : ""} — {ens.utilisateur.email}
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
                <th className="px-4 py-3">Classe</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Niveau</th>
                <th className="px-4 py-3">Élèves</th>
                <th className="px-4 py-3">Titulaire</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 text-[#13233F] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-[#FF6B1A]" />
                      {c.nom_classe}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sectionColor(c.section)}`}>
                      {c.section}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.niveau}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-3.5 w-3.5" />
                      {c._count.eleves}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.titulaire ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                        <UserCheck className="h-3.5 w-3.5 text-green-500" />
                        {c.titulaire.utilisateur.nom}
                        {c.titulaire.utilisateur.prenom && ` ${c.titulaire.utilisateur.prenom}`}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
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
              {classes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    Aucune classe trouvée
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
