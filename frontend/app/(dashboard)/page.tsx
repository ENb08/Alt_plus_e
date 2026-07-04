"use client";

import { useAuth } from "@/contexts/AuthContext";

const roleLabels: Record<string, string> = {
  CONCEPTEUR: "Concepteur",
  ADMINISTRATEUR: "Administrateur",
  DIRECTEUR: "Directeur",
  ENSEIGNANT: "Enseignant",
  COMPTABLE: "Comptable",
  ELEVE: "Élève",
  PARENT: "Parent",
};

export default function DashboardPage() {
  const { utilisateur, ecole } = useAuth();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Tableau de bord</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500">Bienvenue</h2>
          <p className="mt-1 text-lg font-semibold text-gray-800">{utilisateur?.nom}</p>
          <p className="text-sm text-gray-500">{roleLabels[utilisateur?.role ?? ""] ?? utilisateur?.role}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500">École</h2>
          <p className="mt-1 text-lg font-semibold text-gray-800">{ecole?.nom}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500">Email</h2>
          <p className="mt-1 text-lg font-semibold text-gray-800">{utilisateur?.email}</p>
        </div>
      </div>
    </div>
  );
}
