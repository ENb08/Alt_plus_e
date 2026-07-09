"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, Users, BookOpen, DollarSign,
  ClipboardCheck, FileText, School, ChevronLeft, LogOut, BarChart3,
  CreditCard, Calendar, Bell, TrendingUp, Settings, ChevronDown,
  Library, PiggyBank,
} from "lucide-react";
import { useState } from "react";

type MenuItem = { label: string; href: string; icon: any; roles?: string[] };

const menuGroups: { category: string; items: MenuItem[] }[] = [
  {
    category: "Tableau de bord",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    category: "Académique",
    items: [
      { label: "Élèves", href: "/eleves", icon: Users, roles: ["ADMINISTRATEUR", "DIRECTEUR", "ENSEIGNANT", "COMPTABLE"] },
      { label: "Enseignants", href: "/enseignants", icon: GraduationCap, roles: ["ADMINISTRATEUR", "DIRECTEUR"] },
      { label: "Classes", href: "/classes", icon: BookOpen, roles: ["ADMINISTRATEUR", "DIRECTEUR", "ENSEIGNANT"] },
      { label: "Présences", href: "/presences", icon: ClipboardCheck, roles: ["ADMINISTRATEUR", "DIRECTEUR", "ENSEIGNANT"] },
      { label: "Notes", href: "/notes", icon: FileText, roles: ["ADMINISTRATEUR", "DIRECTEUR", "ENSEIGNANT"] },
      { label: "Bulletins", href: "/bulletins", icon: FileText, roles: ["ADMINISTRATEUR", "DIRECTEUR", "ENSEIGNANT"] },
    ],
  },
  {
    category: "Finances",
    items: [
      { label: "Paiements", href: "/paiements", icon: DollarSign, roles: ["ADMINISTRATEUR", "COMPTABLE"] },
      { label: "Dépenses", href: "/depenses", icon: TrendingUp, roles: ["ADMINISTRATEUR", "COMPTABLE"] },
      { label: "Comptabilité", href: "/comptabilite", icon: PiggyBank, roles: ["ADMINISTRATEUR", "COMPTABLE"] },
    ],
  },
  {
    category: "Rapports",
    items: [
      { label: "Rapports", href: "/rapports", icon: BarChart3, roles: ["ADMINISTRATEUR", "DIRECTEUR", "COMPTABLE"] },
    ],
  },
  {
    category: "Paramètres",
    items: [
      { label: "Utilisateurs", href: "/utilisateurs", icon: Users, roles: ["ADMINISTRATEUR", "CONCEPTEUR"] },
      { label: "Paramètres", href: "/parametres", icon: Settings, roles: ["ADMINISTRATEUR"] },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { utilisateur, ecole, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const initials = utilisateur?.nom
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "A";

  return (
    <motion.aside
      className="relative z-30 flex flex-col border-r border-gray-100 bg-white"
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Logo */}
      <div className={cn("flex items-center border-b border-gray-100", collapsed ? "h-14 justify-center" : "h-14 gap-3 px-5")}>
        <motion.div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF6B1A] text-xs font-bold text-white shadow-sm shadow-[#FF6B1A]/20"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          A
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-semibold text-[#13233F]">Alt-Q Plus</p>
              <p className="text-[10px] text-gray-400">Gestion Scolaire</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* School context */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="border-b border-gray-50 px-5 py-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-xs font-medium text-[#FF6B1A]">{ecole?.nom ?? "École"}</p>
            <p className="text-[10px] text-gray-400">{utilisateur?.role}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.roles || item.roles.includes(utilisateur?.role ?? "")
          );
          if (visibleItems.length === 0) return null;
          return (
          <div key={group.category} className="mb-3">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-widest text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {group.category}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const actif = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={cn(
                        "flex items-center rounded-xl text-sm font-medium transition-colors",
                        collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5",
                        actif
                          ? "bg-[#FF6B1A]/10 text-[#FF6B1A]"
                          : "text-gray-400 hover:bg-gray-50 hover:text-[#13233F]"
                      )}
                      whileHover={{ x: collapsed ? 0 : 3 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 p-3">
        <div className={cn("flex gap-1", collapsed && "flex-col")}>
          <motion.button
            className={cn(
              "flex items-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#13233F]",
              collapsed ? "justify-center py-2.5" : "gap-2 px-3 py-2.5 text-sm"
            )}
            onClick={() => setCollapsed(!collapsed)}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Réduire
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            className={cn(
              "flex items-center rounded-xl text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500",
              collapsed ? "justify-center py-2.5" : "gap-2 px-3 py-2.5 text-sm"
            )}
            onClick={logout}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="h-4 w-4" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Déconnexion
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* User */}
        {!collapsed && (
          <motion.div
            className="mt-3 flex items-center gap-3 rounded-xl bg-gray-50/50 px-3 py-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FF6B1A]/10 text-[10px] font-bold text-[#FF6B1A]">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-medium text-[#13233F]">{utilisateur?.nom}</p>
              <p className="truncate text-[10px] text-gray-400">{utilisateur?.email}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
