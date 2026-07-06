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

const stats = [
  { label: "Élèves", value: "—", color: "bg-accent" },
  { label: "Enseignants", value: "—", color: "bg-success" },
  { label: "Classes", value: "—", color: "bg-primary-light" },
  { label: "Paiements", value: "—", color: "bg-accent-dark" },
];

export default function DashboardPage() {
  const { utilisateur, ecole } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-dark">Tableau de bord</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {ecole?.nom} — {roleLabels[utilisateur?.role ?? ""] ?? utilisateur?.role}
        </p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-white p-6"
            style={{ boxShadow: "0 1px 3px rgba(16,32,48,0.1), 0 1px 2px rgba(16,32,48,0.06)" }}
          >
            <div className={`mb-3 h-2 w-12 rounded-full ${s.color}`} />
            <p className="text-2xl font-bold text-text-dark">{s.value}</p>
            <p className="text-sm text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-xl border border-border bg-white p-6"
          style={{ boxShadow: "0 1px 3px rgba(16,32,48,0.1), 0 1px 2px rgba(16,32,48,0.06)" }}
        >
          <h2 className="mb-1 text-lg font-semibold text-text-dark">Bienvenue</h2>
          <p className="text-sm text-text-secondary">
            Connecté en tant que <strong>{utilisateur?.nom}</strong>
          </p>
          <p className="mt-4 text-sm text-text-secondary">{utilisateur?.email}</p>
        </div>

        <div
          className="rounded-xl border border-border bg-white p-6"
          style={{ boxShadow: "0 1px 3px rgba(16,32,48,0.1), 0 1px 2px rgba(16,32,48,0.06)" }}
        >
          <h2 className="mb-1 text-lg font-semibold text-text-dark">École</h2>
          <p className="text-sm text-text-secondary">{ecole?.nom}</p>
          <p className="mt-4 text-xs text-text-muted">
            Année scolaire 2026-2027
          </p>
        </div>
      </div>
    </div>
  );
}
