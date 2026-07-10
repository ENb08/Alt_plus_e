"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Edit3, X, AlertCircle, FileText, BookOpen,
  Download, Printer, Paperclip, Eye, Upload,
} from "lucide-react";
import { api } from "@/lib/api";

type Lecon = {
  id: string;
  titre: string;
  objectifs: string | null;
  date_creation: string;
  cours: { id: string; intitule: string; coefficient: number };
  enseignant: { id: string; utilisateur: { id: string; nom: string; prenom: string | null } };
  _count: { fichiers: number };
};

type LeconDetail = Lecon & {
  materiel: string | null;
  deroulement: string | null;
  evaluation: string | null;
  fichiers: { id: string; nom_fichier: string; url_fichier: string; type: string }[];
};

type Cours = { id: string; intitule: string; coefficient: number };

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { token: token || undefined };
}

export default function LegonsPage() {
  const [legons, setLegons] = useState<Lecon[]>([]);
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [titre, setTitre] = useState("");
  const [objectifs, setObjectifs] = useState("");
  const [materiel, setMateriel] = useState("");
  const [deroulement, setDeroulement] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [coursId, setCoursId] = useState("");
  const [erreur, setErreur] = useState("");
  const [saving, setSaving] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<LeconDetail | null>(null);

  const loadLegons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/legons", authHeaders());
      setLegons(data.legons);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCours = useCallback(async () => {
    try {
      const data = await api("/api/cours", authHeaders());
      setCours(data.cours);
    } catch {}
  }, []);

  useEffect(() => { loadLegons(); loadCours(); }, [loadLegons, loadCours]);

  function lockScroll() { document.body.style.overflow = "hidden"; }
  function unlockScroll() { document.body.style.overflow = ""; }

  function openCreate() {
    setEditId(null);
    setTitre(""); setObjectifs(""); setMateriel(""); setDeroulement(""); setEvaluation("");
    setCoursId(cours[0]?.id || "");
    setErreur(""); setShowForm(true); lockScroll();
  }

  function openEdit(l: Lecon) {
    setEditId(l.id);
    setTitre(l.titre); setObjectifs(l.objectifs || ""); setCoursId(l.cours.id);
    setMateriel(""); setDeroulement(""); setEvaluation("");
    setErreur(""); setShowForm(true); lockScroll();
    loadDetail(l.id);
  }

  async function loadDetail(id: string) {
    try {
      const data = await api(`/api/legons/${id}`, authHeaders());
      setDetail(data.lecon);
      setMateriel(data.lecon.materiel || "");
      setDeroulement(data.lecon.deroulement || "");
      setEvaluation(data.lecon.evaluation || "");
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErreur("");
    try {
      const body: any = { titre, objectifs, materiel, deroulement, evaluation, cours_id: coursId };

      if (editId) {
        await api(`/api/legons/${editId}`, { method: "PUT", body, ...authHeaders() });
      } else {
        await api("/api/legons", { method: "POST", body, ...authHeaders() });
      }
      setShowForm(false); unlockScroll(); loadLegons();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette leçon ?")) return;
    try {
      await api(`/api/legons/${id}`, { method: "DELETE", ...authHeaders() });
      loadLegons();
      if (detailId === id) { setDetailId(null); setDetail(null); }
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    }
  }

  async function handleDeleteFile(leconId: string, fichierId: string) {
    try {
      await api(`/api/legons/${leconId}/fichiers/${fichierId}`, { method: "DELETE", ...authHeaders() });
      loadDetail(leconId);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    }
  }

  async function handleAddFile(leconId: string, file: File) {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const url = ev.target?.result as string;
      try {
        await api(`/api/legons/${leconId}/fichiers`, {
          method: "POST",
          body: { nom_fichier: file.name, url_fichier: url, type: file.type },
          ...authHeaders(),
        });
        loadDetail(leconId);
      } catch (err) {
        setErreur(err instanceof Error ? err.message : "Erreur");
      }
    };
    reader.readAsDataURL(file);
  }

  function handlePrint(lecon: LeconDetail) {
    const win = window.open("", "_blank");
    if (!win) return;
    const content = `
      <html><head><title>${lecon.titre}</title>
      <style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:auto}
      h1{color:#13233F;border-bottom:2px solid #FF6B1A;padding-bottom:10px}
      h2{color:#13233F;margin-top:30px;font-size:16px}
      p{line-height:1.6;color:#333}
      .meta{color:#666;font-size:14px;margin-bottom:30px}
      .fichier{padding:8px 12px;background:#f5f5f5;border-radius:8px;display:inline-block;margin:4px}
      @media print{body{padding:20px}}</style></head>
      <body>
      <h1>${lecon.titre}</h1>
      <div class="meta">
        <p>Cours : ${lecon.cours.intitule} (Coeff. ${lecon.cours.coefficient})</p>
        <p>Enseignant : ${lecon.enseignant.utilisateur.nom} ${lecon.enseignant.utilisateur.prenom || ""}</p>
        <p>Date : ${new Date(lecon.date_creation).toLocaleDateString()}</p>
      </div>
      ${lecon.objectifs ? `<h2>Objectifs</h2><p>${lecon.objectifs.replace(/\n/g, "<br>")}</p>` : ""}
      ${lecon.materiel ? `<h2>Matériel</h2><p>${lecon.materiel.replace(/\n/g, "<br>")}</p>` : ""}
      ${lecon.deroulement ? `<h2>Déroulement</h2><p>${lecon.deroulement.replace(/\n/g, "<br>")}</p>` : ""}
      ${lecon.evaluation ? `<h2>Évaluation</h2><p>${lecon.evaluation.replace(/\n/g, "<br>")}</p>` : ""}
      ${lecon.fichiers?.length ? `<h2>Fichiers joints</h2><p>${lecon.fichiers.map(f => f.nom_fichier).join(", ")}</p>` : ""}
      </body></html>`;
    win.document.write(content);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233F]">Fiches de leçons</h1>
          <p className="text-sm text-gray-400">Créer et gérer les fiches pédagogiques</p>
        </div>
        <motion.button onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#FF6B1A] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 hover:bg-[#FF6B1A]/90"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="h-4 w-4" />
          Nouvelle leçon
        </motion.button>
      </div>

      {erreur && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {erreur}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm pt-10 pb-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setShowForm(false); unlockScroll(); }}>
          <motion.div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#13233F]">
                {editId ? "Modifier" : "Nouvelle"} leçon
              </h2>
              <button onClick={() => { setShowForm(false); unlockScroll(); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Titre *</label>
                  <input type="text" value={titre} required onChange={(e) => setTitre(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Cours *</label>
                  <select value={coursId} onChange={(e) => setCoursId(e.target.value)} required
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10">
                    {cours.length === 0 && <option value="">Aucun cours</option>}
                    {cours.map((c) => (
                      <option key={c.id} value={c.id}>{c.intitule}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Objectifs</label>
                  <textarea value={objectifs} onChange={(e) => setObjectifs(e.target.value)} rows={3}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Matériel</label>
                  <textarea value={materiel} onChange={(e) => setMateriel(e.target.value)} rows={3}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Déroulement</label>
                  <textarea value={deroulement} onChange={(e) => setDeroulement(e.target.value)} rows={5}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Évaluation</label>
                  <textarea value={evaluation} onChange={(e) => setEvaluation(e.target.value)} rows={3}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
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

      {/* Detail panel */}
      {detailId && detail && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm pt-10 pb-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setDetailId(null); setDetail(null); }}>
          <motion.div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#13233F]">{detail.titre}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => handlePrint(detail)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#FF6B1A]" title="Imprimer">
                  <Printer className="h-4 w-4" />
                </button>
                <button onClick={() => { setDetailId(null); setDetail(null); }}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-4 text-gray-500">
                <span>Cours : <strong>{detail.cours.intitule}</strong></span>
                <span>Coeff. : <strong>{detail.cours.coefficient}</strong></span>
                <span>Date : <strong>{new Date(detail.date_creation).toLocaleDateString()}</strong></span>
              </div>
              <div className="text-gray-500">
                Enseignant : <strong>{detail.enseignant.utilisateur.nom} {detail.enseignant.utilisateur.prenom || ""}</strong>
              </div>

              {detail.objectifs && (
                <div>
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Objectifs</h3>
                  <p className="whitespace-pre-wrap text-gray-700">{detail.objectifs}</p>
                </div>
              )}
              {detail.materiel && (
                <div>
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Matériel</h3>
                  <p className="whitespace-pre-wrap text-gray-700">{detail.materiel}</p>
                </div>
              )}
              {detail.deroulement && (
                <div>
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Déroulement</h3>
                  <p className="whitespace-pre-wrap text-gray-700">{detail.deroulement}</p>
                </div>
              )}
              {detail.evaluation && (
                <div>
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Évaluation</h3>
                  <p className="whitespace-pre-wrap text-gray-700">{detail.evaluation}</p>
                </div>
              )}

              {/* Fichiers */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Fichiers joints ({detail.fichiers.length})
                </h3>
                <div className="space-y-2">
                  {detail.fichiers.map((f) => (
                    <div key={f.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{f.nom_fichier}</span>
                        <span className="text-[10px] text-gray-400">{f.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <a href={f.url_fichier} download={f.nom_fichier}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-blue-500">
                          <Download className="h-3.5 w-3.5" />
                        </a>
                        <button onClick={() => handleDeleteFile(detail.id, f.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-400 hover:border-[#FF6B1A] hover:text-[#FF6B1A]">
                    <Upload className="h-4 w-4" />
                    Ajouter un fichier
                    <input type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddFile(detail.id, file);
                    }} />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Table */}
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
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Cours</th>
                <th className="px-4 py-3">Enseignant</th>
                <th className="px-4 py-3">Fichiers</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {legons.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 text-[#13233F] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-[#FF6B1A]" />
                      {l.titre}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{l.cours.intitule}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {l.enseignant.utilisateur.nom} {l.enseignant.utilisateur.prenom || ""}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{l._count.fichiers}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(l.date_creation).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setDetailId(l.id); loadDetail(l.id); }}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-500" title="Voir">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEdit(l)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#FF6B1A]">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(l.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {legons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    <FileText className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    Aucune leçon trouvée
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
