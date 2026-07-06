"use client";

import { motion } from "framer-motion";
import Background from "@/components/Background";
import HeroSection from "@/components/HeroSection";
import TodaySection from "@/components/TodaySection";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, GraduationCap, BookOpen, DollarSign,
  TrendingUp, Clock, UserCheck, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line,
} from "recharts";

const monthlyData = [
  { month: "Sep", inscriptions: 45, paiements: 32000, depenses: 18000, sorties: 28 },
  { month: "Oct", inscriptions: 32, paiements: 28500, depenses: 19500, sorties: 22 },
  { month: "Nov", inscriptions: 28, paiements: 31000, depenses: 17500, sorties: 25 },
  { month: "Dec", inscriptions: 15, paiements: 22000, depenses: 16000, sorties: 18 },
  { month: "Jan", inscriptions: 38, paiements: 35000, depenses: 20000, sorties: 30 },
  { month: "Fév", inscriptions: 42, paiements: 38000, depenses: 21000, sorties: 35 },
  { month: "Mar", inscriptions: 30, paiements: 29000, depenses: 18500, sorties: 27 },
  { month: "Avr", inscriptions: 35, paiements: 33000, depenses: 19000, sorties: 31 },
  { month: "Mai", inscriptions: 40, paiements: 36000, depenses: 20500, sorties: 33 },
  { month: "Juin", inscriptions: 25, paiements: 27000, depenses: 17000, sorties: 20 },
];

const presenceData = [
  { day: "Lun", taux: 94, prevu: 92 },
  { day: "Mar", taux: 97, prevu: 93 },
  { day: "Mer", taux: 95, prevu: 91 },
  { day: "Jeu", taux: 98, prevu: 92 },
  { day: "Ven", taux: 92, prevu: 90 },
  { day: "Sam", taux: 88, prevu: 85 },
];

const classData = [
  { classe: "3e A", eleves: 42, moyenne: 14.5 },
  { classe: "3e B", eleves: 38, moyenne: 13.2 },
  { classe: "4e A", eleves: 35, moyenne: 15.1 },
  { classe: "4e B", eleves: 40, moyenne: 12.8 },
  { classe: "5e A", eleves: 37, moyenne: 14.8 },
  { classe: "5e B", eleves: 33, moyenne: 13.5 },
  { classe: "6e A", eleves: 45, moyenne: 11.9 },
  { classe: "6e B", eleves: 39, moyenne: 12.4 },
];

const recentActivity = [
  { action: "Nouvel élève inscrit", detail: "Jean Kabamba — 3e A", time: "Il y a 2 min", type: "success" },
  { action: "Paiement enregistré", detail: "Frais scolaire — Marthe Lelo", time: "Il y a 15 min", type: "payment" },
  { action: "Présence validée", detail: "Cours de Mathématiques — 4e B", time: "Il y a 1h", type: "presence" },
  { action: "Note ajoutée", detail: "Interro d'Anglais — 2e C", time: "Il y a 2h", type: "grade" },
  { action: "Bulletin généré", detail: "Trimestre 1 — 5e A", time: "Il y a 3h", type: "document" },
  { action: "Absence signalée", detail: "M. Kazadi — Congé maladie", time: "Il y a 4h", type: "alert" },
];

const sparklineData1 = [12, 18, 14, 22, 20, 28, 26, 32, 30, 38, 36, 42];
const sparklineData2 = [8, 7, 9, 8, 10, 9, 8, 9, 10, 9, 10, 11];
const sparklineData3 = [5, 5, 6, 5, 6, 6, 5, 6, 6, 5, 6, 5];
const sparklineData4 = [28000, 30000, 25000, 32000, 29000, 35000, 31000, 38000, 34000, 42000, 38000, 45800];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const activityDotColors: Record<string, string> = {
  success: "bg-green-500",
  payment: "bg-[#FF6B1A]",
  presence: "bg-blue-500",
  grade: "bg-purple-500",
  document: "bg-gray-500",
  alert: "bg-amber-500",
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name === "inscriptions" ? `${p.value} inscrits` :
             p.name === "taux" || p.name === "prevu" ? `${p.value}%` :
             `${p.value.toLocaleString()} FC`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  return (
    <motion.div
      className="relative min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Background />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 p-4 pb-12 lg:p-8">
        {/* Hero */}
        <motion.div variants={itemVariants}>
          <HeroSection />
        </motion.div>

        {/* Today Section */}
        <motion.div variants={itemVariants}>
          <TodaySection />
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
          <StatsCard
            title="Élèves"
            value={1240}
            icon={Users}
            trend={{ value: "+12%", positive: true }}
            sparklineData={sparklineData1}
            delay={0.05}
          />
          <StatsCard
            title="Enseignants"
            value={86}
            icon={GraduationCap}
            trend={{ value: "+3%", positive: true }}
            sparklineData={sparklineData2}
            variant="secondary"
            delay={0.1}
          />
          <StatsCard
            title="Classes"
            value={32}
            icon={BookOpen}
            sparklineData={sparklineData3}
            variant="info"
            delay={0.15}
          />
          <StatsCard
            title="Revenus"
            value={45800}
            prefix=""
            icon={DollarSign}
            variant="accent"
            trend={{ value: "+8%", positive: true }}
            sparklineData={sparklineData4}
            delay={0.2}
          />
        </motion.div>

        {/* Charts */}
        <motion.div className="grid gap-5 lg:grid-cols-2" variants={itemVariants}>
          {/* Inscriptions & Revenus */}
          <Card className="border-gray-100 shadow-premium">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-[#13233F]">
                  Inscriptions & Revenus
                </CardTitle>
                <p className="text-xs text-gray-400">Année scolaire 2026-2027</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs">
                  <span className="h-2 w-2 rounded-full bg-[#FF6B1A]" />
                  Inscriptions
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Revenus
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barGap={4} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Bar yAxisId="left" dataKey="inscriptions" fill="#FF6B1A" radius={[4, 4, 0, 0]} maxBarSize={24} />
                    <Bar yAxisId="right" dataKey="paiements" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Présences */}
          <Card className="border-gray-100 shadow-premium">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-[#13233F]">
                  Taux de présence
                </CardTitle>
                <p className="text-xs text-gray-400">Cette semaine</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3" />
                94% moyen
              </span>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={presenceData}>
                    <defs>
                      <linearGradient id="presenceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B1A" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#FF6B1A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="prevuGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#13233F" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#13233F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="prevu" stroke="#13233F" strokeWidth={1} fill="url(#prevuGrad)" strokeDasharray="4 4" dot={false} />
                    <Area type="monotone" dataKey="taux" stroke="#FF6B1A" strokeWidth={2} fill="url(#presenceGrad)" dot={{ fill: "#FF6B1A", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom section */}
        <motion.div className="grid gap-5 lg:grid-cols-3" variants={itemVariants}>
          {/* Classes performance */}
          <Card className="border-gray-100 shadow-premium lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[#13233F]">
                Performance par classe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={classData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="classe" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <YAxis domain={[0, 20]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="moyenne" stroke="#FF6B1A" strokeWidth={2} dot={{ fill: "#FF6B1A", r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity feed */}
          <Card className="border-gray-100 shadow-premium">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[#13233F]">
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {recentActivity.map((a, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 border-b border-gray-50 py-3 last:border-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <div className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", activityDotColors[a.type])} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#13233F]">{a.action}</p>
                    <p className="truncate text-xs text-gray-400">{a.detail}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-gray-400">{a.time}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

