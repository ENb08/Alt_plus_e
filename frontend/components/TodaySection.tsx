"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, GraduationCap, AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const todayItems = [
  { icon: TrendingUp, label: "Nouveaux élèves", value: "23", color: "#FF6B1A", bg: "bg-[#FF6B1A]/8" },
  { icon: Clock, label: "Paiements reçus", value: "12", color: "#10B981", bg: "bg-emerald-50" },
  { icon: AlertTriangle, label: "Absences", value: "3", color: "#EF4444", bg: "bg-red-50" },
  { icon: GraduationCap, label: "Examens prévus", value: "5", color: "#8B5CF6", bg: "bg-purple-50" },
  { icon: Calendar, label: "Enseignants absents", value: "2", color: "#F59E0B", bg: "bg-amber-50" },
];

export default function TodaySection() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-premium"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-[#FF6B1A]" />
        <h2 className="text-sm font-semibold text-[#13233F]">Aujourd&apos;hui</h2>
        <span className="text-xs text-gray-400">&mdash; {today}</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {todayItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className="group relative overflow-hidden rounded-xl border border-gray-50 p-4 transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -1 }}
            >
              <div className="flex items-start justify-between">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", item.bg)}>
                  <Icon className="h-4 w-4" style={{ color: item.color }} />
                </div>
                <span className="text-lg font-bold text-[#13233F]">{item.value}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">{item.label}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
