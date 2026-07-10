"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, Mail, User, Calendar, Phone,
  MapPin, Globe, AlertTriangle, School, BookOpen, Building,
  UserCheck, Camera,
} from "lucide-react";
import { api } from "@/lib/api";

type EleveDetail = {
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

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { token: token || undefined };
}

export default function EleveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [eleve, setEleve] = useState<EleveDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(`/api/eleves/${params.id}`, authHeaders());
      setEleve(data.eleve);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF6B1A] border-t-transparent" />
          <span className="text-sm">Chargement...</span>
        </div>
      </div>
    );
  }

  if (erreur || !eleve) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">{erreur || "Élève introuvable"}</p>
        <button onClick={() => router.push("/eleves")} className="mt-4 text-sm text-[#FF6B1A] hover:underline">
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.push("/eleves")}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#FF6B1A]">
        <ArrowLeft className="h-4 w-4" />
        Retour aux élèves
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Photo & identity card */}
        <div className="lg:col-span-1">
          <motion.div className="rounded-2xl border border-gray-100 bg-white p-6 text-center"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gray-100">
              {eleve.photo_url ? (
                <img src={eleve.photo_url} alt={eleve.utilisateur.nom}
                  className="h-28 w-28 rounded-full object-cover" />
              ) : (
                <Camera className="h-10 w-10 text-gray-300" />
              )}
            </div>
            <h2 className="text-lg font-bold text-[#13233F]">
              {eleve.utilisateur.nom}
              {eleve.utilisateur.prenom && ` ${eleve.utilisateur.prenom}`}
            </h2>
            {eleve.postnom && <p className="text-sm text-gray-400">{eleve.postnom}</p>}
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                <GraduationCap className="h-3 w-3" />
                {eleve.matricule}
              </span>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${eleve.sexe === "M" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>
                {eleve.sexe === "M" ? "Masculin" : "Féminin"}
              </span>
              <span className="inline-flex rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                {eleve.classe.nom_classe}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Info details */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div className="rounded-2xl border border-gray-100 bg-white p-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="mb-4 text-sm font-semibold text-[#13233F]">Informations personnelles</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow icon={User} label="Nom" value={eleve.utilisateur.nom} />
              <InfoRow icon={User} label="Prénom" value={eleve.utilisateur.prenom || "—"} />
              <InfoRow icon={User} label="Postnom" value={eleve.postnom || "—"} />
              <InfoRow icon={Mail} label="Email" value={eleve.utilisateur.email} />
              <InfoRow icon={Calendar} label="Date naissance" value={new Date(eleve.date_naissance).toLocaleDateString()} />
              <InfoRow icon={Globe} label="Nationalité" value={eleve.nationalite || "—"} />
            </div>
          </motion.div>

          <motion.div className="rounded-2xl border border-gray-100 bg-white p-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="mb-4 text-sm font-semibold text-[#13233F]">Contact & scolarité</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow icon={MapPin} label="Adresse" value={eleve.adresse || "—"} />
              <InfoRow icon={Phone} label="Tél. parent" value={eleve.telephone_parent || "—"} />
              <InfoRow icon={Building} label="École provenance" value={eleve.ecole_provenance || "—"} />
              <InfoRow icon={BookOpen} label="Classe actuelle" value={eleve.classe.nom_classe} />
              <InfoRow icon={UserCheck} label="Section" value={eleve.classe.section} />
              <InfoRow icon={School} label="Niveau" value={eleve.classe.niveau} />
            </div>
          </motion.div>

          {eleve.allergies_medicales && (
            <motion.div className="rounded-2xl border border-amber-100 bg-amber-50 p-6"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-800">Allergies / informations médicales</h3>
                  <p className="mt-1 text-sm text-amber-700">{eleve.allergies_medicales}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-[#13233F]">{value}</p>
      </div>
    </div>
  );
}
