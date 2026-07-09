"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Users, DollarSign, TrendingUp, CheckCheck, QrCode, Clock, UserCheck, BarChart3, Sparkles } from "lucide-react";

function FloatingCard({ icon: Icon, label, value, color, delay, x, y, rotate }: {
  icon: any; label: string; value: string; color: string; delay: number; x: number; y: number; rotate: number;
}) {
  return (
    <motion.div
      className="absolute flex items-center gap-3 rounded-2xl border border-white/10 bg-white/90 p-4 shadow-lg backdrop-blur-md"
      style={{ left: `${x}%`, top: `${y}%`, rotate: `${rotate}deg` }}
      animate={{ y: [0, -8, -4, 0] }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}15` }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm font-bold text-[#13233F]">{value}</p>
      </div>
    </motion.div>
  );
}

function FloatingChart() {
  return (
    <motion.div
      className="absolute rounded-2xl border border-white/10 bg-white/90 p-4 shadow-lg backdrop-blur-md"
      style={{ left: "55%", top: "55%", rotate: "3deg" }}
      animate={{ y: [0, -6, -3, 0] }}
      transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      <p className="mb-2 text-xs font-medium text-gray-500">Présences</p>
      <div className="flex items-end gap-1.5">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <motion.div
            key={i}
            className="w-3 rounded-t-sm"
            style={{ height: h * 0.6, backgroundColor: i === 5 ? "#FF6B1A" : "#13233F" }}
            initial={{ height: 0 }}
            animate={{ height: h * 0.6 }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const qrPattern = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1];

function FloatingQr() {
  return (
    <motion.div
      className="absolute rounded-2xl border border-white/10 bg-white/90 p-3 shadow-lg backdrop-blur-md"
      style={{ left: "12%", top: "58%" }}
      animate={{ y: [0, -10, -5, 0], rotate: [0, 2, -1, 0] }}
      transition={{ duration: 8, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="grid grid-cols-4 gap-0.5">
        {qrPattern.map((v, i) => (
          <div key={i} className={`h-1.5 w-1.5 rounded-sm ${v ? "bg-[#13233F]" : "bg-transparent"}`} />
        ))}
      </div>
      <p className="mt-1 text-[10px] text-gray-400">QR Élève</p>
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{Math.round(count)}{suffix}</span>;
}

function StatsBar() {
  return (
    <motion.div
      className="absolute bottom-12 left-12 right-12 z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/80 p-5 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      {[
        { icon: Users, label: "Élèves", value: 1240, color: "#FF6B1A" },
        { icon: UserCheck, label: "Enseignants", value: 86, color: "#13233F" },
        { icon: BookOpen, label: "Classes", value: 32, color: "#10B981" },
        { icon: DollarSign, label: "Revenus", value: 45800, color: "#FF6B1A", prefix: "$" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${item.color}12` }}>
            <item.icon className="h-4 w-4" style={{ color: item.color }} />
          </div>
          <div>
            <p className="text-lg font-bold text-[#13233F]">
              {item.prefix}<AnimatedCounter value={item.value} />
            </p>
            <p className="text-xs text-gray-400">{item.label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function SceneIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" fill="none">
      {/* School building */}
      <rect x="140" y="120" width="120" height="100" rx="8" fill="#13233F" opacity="0.9" />
      <rect x="150" y="130" width="40" height="40" rx="4" fill="#FF6B1A" opacity="0.2" />
      <rect x="210" y="130" width="40" height="40" rx="4" fill="#FF6B1A" opacity="0.2" />
      <rect x="150" y="185" width="100" height="8" rx="2" fill="#FF6B1A" opacity="0.3" />
      <rect x="140" y="218" width="120" height="4" rx="2" fill="#13233F" opacity="0.3" />
      {/* Door */}
      <rect x="185" y="175" width="30" height="45" rx="6" fill="#FF6B1A" opacity="0.4" />
      {/* Roof */}
      <path d="M130 125 L200 80 L270 125" fill="#13233F" />
      {/* Students */}
      <circle cx="120" cy="205" r="6" fill="#13233F" />
      <rect x="115" y="210" width="10" height="14" rx="3" fill="#13233F" opacity="0.7" />
      <circle cx="170" cy="232" r="5" fill="#FF6B1A" />
      <rect x="166" y="236" width="8" height="12" rx="2" fill="#FF6B1A" opacity="0.7" />
      <circle cx="230" cy="210" r="6" fill="#13233F" />
      <rect x="225" y="215" width="10" height="14" rx="3" fill="#13233F" opacity="0.7" />
      <circle cx="280" cy="205" r="5" fill="#FF6B1A" />
      <rect x="276" y="209" width="8" height="12" rx="2" fill="#FF6B1A" opacity="0.7" />
      {/* Laptop */}
      <rect x="295" y="170" width="30" height="20" rx="3" fill="#13233F" />
      <rect x="298" y="173" width="24" height="14" rx="1" fill="#FF6B1A" opacity="0.2" />
      <path d="M295 190 L300 200 L320 200 L325 190" fill="#13233F" opacity="0.6" />
      {/* Sparkles */}
      <circle cx="100" cy="140" r="2" fill="#FF6B1A" opacity="0.6" />
      <circle cx="300" cy="130" r="1.5" fill="#FF6B1A" opacity="0.4" />
      <circle cx="340" cy="180" r="2" fill="#FF6B1A" opacity="0.5" />
      <circle cx="60" cy="180" r="1.5" fill="#FF6B1A" opacity="0.3" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const slugRef = useRef<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("email")) setEmail(params.get("email")!);
    if (params.get("success") === "inscription") {
      if (params.get("slug")) slugRef.current = params.get("slug");
      setSuccess("École créée ! Connectez-vous avec vos identifiants.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      await login(email, motDePasse, slugRef.current ?? undefined);
      router.push("/");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  });

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Left Side — Scene */}
      <motion.div
        className="relative hidden w-[60%] flex-col overflow-hidden bg-[#13233F] lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,107,26,0.12) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,107,26,0.08) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/3 top-1/3 h-[200px] w-[200px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,107,26,0.06) 0%, transparent 70%)" }}
            animate={{ x: [0, 30, -10, 0], y: [0, -20, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Brand */}
        <motion.div className="relative z-10 flex items-center gap-3 px-12 pt-10" {...fadeUp(0.2)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Alt-Q Plus</span>
        </motion.div>

        {/* Scene area */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-12">
          <div className="relative h-full w-full">
            {/* Main illustration */}
            <motion.div
              className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="h-40 w-60">
                <SceneIllustration />
              </div>
            </motion.div>

            {/* Floating cards */}
            <div className="absolute inset-0">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <FloatingCard icon={Users} label="Élèves" value="1 240" color="#FF6B1A" delay={0} x={8} y={18} rotate={-2} />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <FloatingCard icon={TrendingUp} label="Taux de réussite" value="94%" color="#10B981" delay={0.5} x={62} y={12} rotate={2} />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <FloatingCard icon={Clock} label="Présences" value="97%" color="#13233F" delay={1} x={5} y={42} rotate={1} />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <FloatingChart />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <FloatingQr />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                <FloatingCard icon={CheckCheck} label="Bulletins" value="Validés" color="#8B5CF6" delay={1.5} x={68} y={42} rotate={-1} />
              </motion.div>
            </div>

            {/* Bottom stats bar */}
            <StatsBar />
          </div>
        </div>
      </motion.div>

      {/* Right Side — Form */}
      <div className="flex w-full items-center justify-center bg-[#F8FAFC] px-6 lg:w-[40%]">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Mobile brand */}
          <motion.div className="mb-8 text-center lg:hidden" {...fadeUp(0)}>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B1A] text-white shadow-lg shadow-[#FF6B1A]/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-[#13233F]">Alt-Q Plus</h1>
            <p className="text-sm text-gray-400">Gestion Scolaire</p>
          </motion.div>

          {/* Title */}
          <motion.div className="hidden lg:block" {...fadeUp(0.3)}>
            <h2 className="text-2xl font-bold text-[#13233F]">Bienvenue</h2>
            <p className="mt-1 text-sm text-gray-400">Connectez-vous à votre espace</p>
          </motion.div>

          {/* Error / Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                key="success"
                className="mb-5 mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span>{success}</span>
              </motion.div>
            )}
            {erreur && (
              <motion.div
                key="erreur"
                className="mb-5 mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span>{erreur}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="mt-8 space-y-5" {...fadeUp(0.5)}>
            <motion.div {...fadeUp(0.6)}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Adresse email</label>
              <div className="group relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#13233F] placeholder:text-gray-300 transition-all focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10 group-hover:border-gray-300"
                  placeholder="admin@ecole.demo"
                />
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.7)}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="group relative">
                <input
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#13233F] placeholder:text-gray-300 transition-all focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10 group-hover:border-gray-300"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div className="flex items-center justify-between" {...fadeUp(0.8)}>
              <label className="flex items-center gap-2 text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF6B1A] focus:ring-[#FF6B1A]/20"
                />
                Se souvenir de moi
              </label>
              <button type="button" className="text-sm text-[#FF6B1A] transition-colors hover:text-[#FF6B1A]/80">
                Mot de passe oublié ?
              </button>
            </motion.div>

            <motion.div {...fadeUp(0.9)}>
              <button
                type="submit"
                disabled={loading}
                className="group relative h-11 w-full overflow-hidden rounded-xl bg-[#FF6B1A] text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 transition-all hover:bg-[#FF6B1A]/90 hover:shadow-xl hover:shadow-[#FF6B1A]/30 active:scale-[0.98] disabled:opacity-60"
              >
                <span className="relative z-10">{loading ? "Connexion..." : "Se connecter"}</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </motion.div>
          </motion.form>

          {/* Inscription link */}
          <motion.div className="mt-4 text-center" {...fadeUp(1)}>
            <span className="text-sm text-gray-400">
              Pas encore inscrit ?{" "}
              <a href="/inscription" className="font-medium text-[#FF6B1A] transition-colors hover:text-[#FF6B1A]/80">
                Créer mon école
              </a>
            </span>
          </motion.div>

          {/* Test credentials */}
          <motion.div
            className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            {...fadeUp(1.1)}
          >
            <p className="text-xs font-medium text-[#13233F]">🔑 Identifiants de test</p>
            <p className="mt-1.5 text-xs text-gray-400">
              Email : <span className="font-mono text-[#FF6B1A]">admin@ecole.demo</span>
            </p>
            <p className="text-xs text-gray-400">
              Mot de passe : <span className="font-mono text-[#FF6B1A]">admin123</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
