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
    <aside className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-lg font-bold">{ecole?.nom ?? "Alt+E"}</h2>
        <p className="text-xs text-gray-400">{utilisateur?.role}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {menus.map((item) => {
          const actif = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-2 text-sm transition ${
                actif ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <p className="mb-2 text-sm text-gray-400">{utilisateur?.nom}</p>
        <button
          onClick={logout}
          className="w-full rounded-lg bg-gray-700 px-3 py-2 text-sm text-white transition hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
