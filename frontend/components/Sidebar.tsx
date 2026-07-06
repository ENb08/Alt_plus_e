"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const roleMenus: Record<string, { label: string; href: string }[]> = {
  CONCEPTEUR: [
    { label: "Tableau de bord", href: "/" },
    { label: "Écoles", href: "/ecoles" },
    { label: "Utilisateurs", href: "/utilisateurs" },
  ],
  ADMINISTRATEUR: [
    { label: "Tableau de bord", href: "/" },
    { label: "Classes", href: "/classes" },
    { label: "Enseignants", href: "/enseignants" },
    { label: "Élèves", href: "/eleves" },
    { label: "Frais scolaires", href: "/frais" },
    { label: "Utilisateurs", href: "/utilisateurs" },
  ],
  DIRECTEUR: [
    { label: "Tableau de bord", href: "/" },
    { label: "Classes", href: "/classes" },
    { label: "Enseignants", href: "/enseignants" },
    { label: "Élèves", href: "/eleves" },
    { label: "Rapports", href: "/rapports" },
  ],
  ENSEIGNANT: [
    { label: "Tableau de bord", href: "/" },
    { label: "Mes classes", href: "/classes" },
    { label: "Présences", href: "/presences" },
    { label: "Notes", href: "/notes" },
    { label: "Leçons", href: "/legons" },
  ],
  COMPTABLE: [
    { label: "Tableau de bord", href: "/" },
    { label: "Paiements", href: "/paiements" },
    { label: "Frais", href: "/frais" },
    { label: "Reçus", href: "/recus" },
  ],
  ELEVE: [
    { label: "Tableau de bord", href: "/" },
    { label: "Mes notes", href: "/notes" },
    { label: "Présences", href: "/presences" },
    { label: "Emploi du temps", href: "/emploi-du-temps" },
  ],
  PARENT: [
    { label: "Tableau de bord", href: "/" },
    { label: "Mes enfants", href: "/enfants" },
    { label: "Notes", href: "/notes" },
    { label: "Paiements", href: "/paiements" },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { utilisateur, ecole, logout } = useAuth();
  const menus = roleMenus[utilisateur?.role ?? ""] ?? [];

  return (
    <aside className="flex h-screen w-64 flex-col bg-primary text-white">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent font-bold text-white">
            A
          </div>
          <div>
            <h2 className="text-base font-bold">{ecole?.nom ?? "Alt+E"}</h2>
            <p className="text-xs text-text-muted">{utilisateur?.role ?? "..."}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menus.map((item) => {
          const actif = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                actif
                  ? "bg-accent/10 text-white before:absolute before:left-0 before:top-1/2 before:h-5/6 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-accent"
                  : "text-text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="mb-2 truncate text-sm text-text-muted">{utilisateur?.nom}</p>
        <p className="mb-3 truncate text-xs text-text-muted">{utilisateur?.email}</p>
        <button
          onClick={logout}
          className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-text-muted transition hover:border-error hover:bg-error/10 hover:text-error"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
