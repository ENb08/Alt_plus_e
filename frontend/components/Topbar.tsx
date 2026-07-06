"use client";

import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Search, Bell, GraduationCap, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";

export default function Topbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { ecole, utilisateur, logout } = useAuth();

  const initials = utilisateur?.nom
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <motion.header
      className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-100/80 bg-white/70 px-4 shadow-sm backdrop-blur-xl lg:px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <motion.button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#13233F] lg:hidden"
          onClick={onMenuToggle}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="h-4 w-4" />
        </motion.button>

        {/* Logo + School */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-premium text-white shadow-sm max-lg:hidden">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="max-lg:hidden">
            <p className="text-sm font-semibold text-[#13233F]">{ecole?.nom ?? "Alt-Q Plus"}</p>
            <p className="text-[10px] text-gray-400">Année scolaire 2026-2027</p>
          </div>
          <span className="mx-2 text-gray-200 max-lg:hidden">|</span>
          <span className="text-xs text-gray-400 max-lg:hidden">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <motion.button
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#13233F]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="h-4 w-4" />
        </motion.button>

        {/* Notifications */}
        <motion.button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#13233F]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="h-4 w-4" />
          <motion.span
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF6B1A]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-[#13233F]">{utilisateur?.nom}</p>
                <p className="text-xs text-gray-400">{utilisateur?.role}</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#FF6B1A]/10 text-[11px] font-semibold text-[#FF6B1A]">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-[#13233F]">{utilisateur?.nom}</p>
              <p className="text-xs text-gray-400">{utilisateur?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
