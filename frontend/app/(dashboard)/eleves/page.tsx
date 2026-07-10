"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Users, Search, Trash2, Edit3, X, AlertCircle, GraduationCap, Eye, Camera, Upload } from "lucide-react";
import { api } from "@/lib/api";

type Eleve = {
  id: string;
  matricule: string;
  postnom: string | null;
  sexe: string;
  date_naissance: string;
  adresse: string | null;
  telephone_parent: string | null;
  photo_url: string | null;
  nationalite: string | null;
  allergies_medicales: string | null;
  ecole_provenance: string | null;
  utilisateur: { id: string; nom: string; prenom: string | null; email: string; actif: boolean };
  classe: { id: string; nom_classe: string; section: string; niveau: string };
};

type Classe = {
  id: string;
  nom_classe: string;
  section: string;
  niveau: string;
};

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { token: token || undefined };
}

export default function ElevesPage() {
  const router = useRouter();
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [postnom, setPostnom] = useState("");
  const [sexe, setSexe] = useState("M");
  const [dateNaissance, setDateNaissance] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephoneParent, setTelephoneParent] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [nationalite, setNationalite] = useState("");
  const [allergiesMedicales, setAllergiesMedicales] = useState("");
  const [ecoleProvenance, setEcoleProvenance] = useState("");
  const [classeId, setClasseId] = useState("");
  const [erreur, setErreur] = useState("");
  const [saving, setSaving] = useState(false);

  const loadEleves = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const path = q ? `/api/eleves?q=${encodeURIComponent(q)}` : "/api/eleves";
      const data = await api(path, authHeaders());
      setEleves(data.eleves);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadClasses = useCallback(async () => {
    try {
      const data = await api("/api/eleves/classes/list", authHeaders());
      setClasses(data.classes);
    } catch {}
  }, []);

  useEffect(() => { loadEleves(); loadClasses(); }, [loadEleves, loadClasses]);

  function lockScroll() { document.body.style.overflow = "hidden"; }
  function unlockScroll() { document.body.style.overflow = ""; }

  function openCreate() {
    setEditId(null);
    setNom(""); setPrenom(""); setEmail(""); setMotDePasse(""); setPostnom("");
    setSexe("M"); setDateNaissance(""); setAdresse("");
    setTelephoneParent(""); setPhotoUrl(""); setPhotoFile(null); setNationalite(""); setAllergiesMedicales("");
    setEcoleProvenance(""); setClasseId(classes[0]?.id || "");
    setErreur("");
    setShowForm(true);
    lockScroll();
  }

  function openEdit(e: Eleve) {
    setEditId(e.id);
    setNom(e.utilisateur.nom);
    setPrenom(e.utilisateur.prenom || "");
    setEmail(e.utilisateur.email);
    setMotDePasse("");
    setPostnom(e.postnom || "");
    setSexe(e.sexe);
    setDateNaissance(e.date_naissance.split("T")[0]);
    setAdresse(e.adresse || "");
    setTelephoneParent(e.telephone_parent || "");
    setPhotoUrl(e.photo_url || "");
    setPhotoFile(null);
    setNationalite(e.nationalite || "");
    setAllergiesMedicales(e.allergies_medicales || "");
    setEcoleProvenance(e.ecole_provenance || "");
    setClasseId(e.classe.id);
    setErreur("");
    setShowForm(true);
    lockScroll();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErreur("");
    try {
      const body: any = { nom, email, sexe, date_naissance: dateNaissance, classe_id: classeId };
      if (prenom) body.prenom = prenom;
      if (postnom) body.postnom = postnom;
      if (photoUrl) body.photo_url = photoUrl;
      if (adresse) body.adresse = adresse;
      if (telephoneParent) body.telephone_parent = telephoneParent;
      if (nationalite) body.nationalite = nationalite;
      if (allergiesMedicales) body.allergies_medicales = allergiesMedicales;
      if (ecoleProvenance) body.ecole_provenance = ecoleProvenance;

      if (editId) {
        if (motDePasse) body.mot_de_passe = motDePasse;
        await api(`/api/eleves/${editId}`, { method: "PUT", body, ...authHeaders() });
      } else {
        body.mot_de_passe = motDePasse;
        await api("/api/eleves", { method: "POST", body, ...authHeaders() });
      }
      setShowForm(false);
      unlockScroll();
      loadEleves(query || undefined);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Désactiver cet élève ?")) return;
    try {
      await api(`/api/eleves/${id}`, { method: "DELETE", ...authHeaders() });
      loadEleves(query || undefined);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadEleves(query || undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233F]">Élèves</h1>
          <p className="text-sm text-gray-400">Gérer les élèves de votre école</p>
        </div>
        <motion.button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#FF6B1A] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 hover:bg-[#FF6B1A]/90"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus className="h-4 w-4" />
          Nouvel élève
        </motion.button>
      </div>

      {erreur && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {erreur}
        </div>
      )}

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, email, matricule..."
            className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10"
          />
        </div>
        <motion.button
          type="submit"
          className="flex h-10 items-center gap-2 rounded-xl bg-[#13233F] px-4 text-sm font-medium text-white hover:bg-[#13233F]/90"
          whileTap={{ scale: 0.98 }}
        >
          <Search className="h-4 w-4" />
          Rechercher
        </motion.button>
      </form>

      {showForm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm pt-10 pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setShowForm(false); unlockScroll(); }}
        >
          <motion.div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#13233F]">
                {editId ? "Modifier" : "Nouvel"} élève
              </h2>
              <button onClick={() => { setShowForm(false); unlockScroll(); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Photo" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-300" />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Photo</label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:border-[#FF6B1A] hover:text-[#FF6B1A]">
                    <Upload className="h-4 w-4" />
                    Choisir une photo
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoFile(file);
                        const reader = new FileReader();
                        reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                  {photoUrl && (
                    <button type="button" onClick={() => { setPhotoUrl(""); setPhotoFile(null); }}
                      className="text-xs text-red-400 hover:text-red-500">
                      Supprimer la photo
                    </button>
                  )}
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Postnom</label>
                  <input type="text" value={postnom} onChange={(e) => setPostnom(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nationalité</label>
                  <input type="text" value={nationalite} onChange={(e) => setNationalite(e.target.value)}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Sexe *</label>
                  <select value={sexe} onChange={(e) => setSexe(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10">
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Date naissance *</label>
                  <input type="date" value={dateNaissance} required onChange={(e) => setDateNaissance(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Classe *</label>
                <select value={classeId} onChange={(e) => setClasseId(e.target.value)} required
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10">
                  {classes.length === 0 && <option value="">Aucune classe disponible</option>}
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom_classe} ({c.section} - {c.niveau})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Adresse</label>
                <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Téléphone parent</label>
                  <input type="text" value={telephoneParent} onChange={(e) => setTelephoneParent(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">École provenance</label>
                  <input type="text" value={ecoleProvenance} onChange={(e) => setEcoleProvenance(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Allergies médicales</label>
                <textarea value={allergiesMedicales} onChange={(e) => setAllergiesMedicales(e.target.value)}
                  className="h-20 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10" />
              </div>

              <motion.button
                type="submit" disabled={saving}
                className="h-10 w-full rounded-xl bg-[#FF6B1A] text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 hover:bg-[#FF6B1A]/90 disabled:opacity-60"
                whileTap={{ scale: 0.98 }}
              >
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
                <th className="px-4 py-3">Matricule</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Classe</th>
                <th className="px-4 py-3">Sexe</th>
                <th className="px-4 py-3">Tél. parent</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eleves.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 text-[#13233F] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                      <GraduationCap className="h-3 w-3" />
                      {e.matricule}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {e.utilisateur.nom}
                    {e.utilisateur.prenom && <span className="text-gray-400"> {e.utilisateur.prenom}</span>}
                    {e.postnom && <span className="text-gray-400"> {e.postnom}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{e.utilisateur.email}</td>
                  <td className="px-4 py-3 text-gray-500">{e.classe.nom_classe}</td>
                  <td className="px-4 py-3">{e.sexe === "M" ? "Masculin" : "Féminin"}</td>
                  <td className="px-4 py-3 text-gray-400">{e.telephone_parent || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/eleves/${e.id}`)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-500"
                        title="Voir la fiche"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEdit(e)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#FF6B1A]"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {eleves.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    Aucun élève trouvé
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
