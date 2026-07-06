"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, Mail, User, Lock, ArrowRight, Sparkles, Check, AlertCircle } from "lucide-react";

function sanitizeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function InscriptionPage() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [email, setEmail] = useState("");
  const [nomAdmin, setNomAdmin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slugManuallyEdited && nom) {
      setSlug(sanitizeSlug(nom));
    }
  }, [nom, slugManuallyEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");

    if (password !== confirmPassword) {
      setErreur("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register-ecole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom_ecole: nom,
          slug: slug || undefined,
          email_admin: email,
          mot_de_passe_admin: password,
          nom_admin: nomAdmin || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erreur || "Erreur lors de l'inscription");

      localStorage.setItem("token", data.token);
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
      {/* Left — Brand panel */}
      <motion.div
        className="relative hidden w-[55%] flex-col overflow-hidden bg-[#13233F] lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Blobs */}
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
        </div>

        <motion.div className="relative z-10 flex items-center gap-3 px-12 pt-10" {...fadeUp(0.2)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Alt-Q Plus</span>
        </motion.div>

        <div className="relative z-10 flex flex-1 items-center px-16">
          <div className="space-y-6">
            <motion.div {...fadeUp(0.4)}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                <Sparkles className="h-3 w-3 text-[#FF6B1A]" />
                Nouvelle inscription
              </div>
            </motion.div>

            <motion.h2 className="text-3xl font-bold leading-tight text-white" {...fadeUp(0.5)}>
              Créez votre établissement scolaire{" "}
              <span className="text-[#FF6B1A]">en quelques clics</span>
            </motion.h2>

            <motion.p className="text-sm leading-relaxed text-white/60" {...fadeUp(0.6)}>
              Rejoignez Alt-Q Plus et modernisez la gestion de votre école.
              Gérez les inscriptions, les présences, les notes et les paiements
              depuis une plateforme unique et sécurisée.
            </motion.p>

            <motion.div className="space-y-3" {...fadeUp(0.7)}>
              {[
                "Gestion multi-école avec isolation des données",
                "Cartes étudiants avec QR Code dynamique",
                "Présences, notes, bulletins et paiements centralisés",
                "Accès parent et portail dédié",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B1A]/20">
                    <Check className="h-3 w-3 text-[#FF6B1A]" />
                  </div>
                  {item}
                </div>
              ))}
            </motion.div>

            {/* Bottom decorative */}
            <motion.div
              className="flex items-center gap-4 pt-6 text-xs text-white/30"
              {...fadeUp(0.9)}
            >
              <span>Securisé</span>
              <span className="h-3 w-px bg-white/10" />
              <span>Hébergé en Europe</span>
              <span className="h-3 w-px bg-white/10" />
              <span>SLA 99.9%</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right — Form */}
      <div className="flex w-full items-center justify-center overflow-y-auto bg-[#F8FAFC] px-6 py-8 lg:w-[45%]">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Mobile brand */}
          <motion.div className="mb-6 text-center lg:hidden" {...fadeUp(0)}>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B1A] text-white shadow-lg shadow-[#FF6B1A]/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-[#13233F]">Alt-Q Plus</h1>
            <p className="text-sm text-gray-400">Inscription</p>
          </motion.div>

          <div className="hidden lg:block" {...fadeUp(0.3)}>
            <h2 className="text-2xl font-bold text-[#13233F]">Créer votre école</h2>
            <p className="mt-1 text-sm text-gray-400">
              Déjà inscrit ?{" "}
              <Link href="/login" className="font-medium text-[#FF6B1A] hover:text-[#FF6B1A]/80 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>

          <AnimatePresence>
            {erreur && (
              <motion.div
                className="mb-4 mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{erreur}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <motion.div {...fadeUp(0.5)}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                <Building2 className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                Nom de l&apos;école
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#13233F] placeholder:text-gray-300 transition-all focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10 hover:border-gray-300"
                placeholder="Ex: Complexe Scolaire Bonsomi"
              />
            </motion.div>

            <motion.div {...fadeUp(0.55)}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                <span className="mr-1.5 inline text-gray-400">🔗</span>
                Sous-domaine
              </label>
              <div className="group relative flex items-center">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(sanitizeSlug(e.target.value)); setSlugManuallyEdited(true); }}
                  required
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-28 text-sm text-[#13233F] placeholder:text-gray-300 transition-all focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10 hover:border-gray-300"
                  placeholder="mon-ecole"
                />
                <span className="pointer-events-none absolute right-4 text-xs text-gray-400">
                  .altq-plus.app
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {slugManuallyEdited ? "Modifié manuellement" : "Généré automatiquement depuis le nom"}
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div {...fadeUp(0.6)}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  <User className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                  Admin
                </label>
                <input
                  type="text"
                  value={nomAdmin}
                  onChange={(e) => setNomAdmin(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#13233F] placeholder:text-gray-300 transition-all focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10 hover:border-gray-300"
                  placeholder="Votre nom"
                />
              </motion.div>

              <motion.div {...fadeUp(0.65)}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  <Mail className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#13233F] placeholder:text-gray-300 transition-all focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10 hover:border-gray-300"
                  placeholder="admin@ecole.cd"
                />
              </motion.div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div {...fadeUp(0.7)}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  <Lock className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#13233F] placeholder:text-gray-300 transition-all focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10 hover:border-gray-300"
                  placeholder="••••••••"
                />
              </motion.div>

              <motion.div {...fadeUp(0.75)}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  <Lock className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                  Confirmer
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#13233F] placeholder:text-gray-300 transition-all focus:border-[#FF6B1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B1A]/10 hover:border-gray-300"
                  placeholder="••••••••"
                />
              </motion.div>
            </div>

            <motion.div {...fadeUp(0.8)}>
              <button
                type="submit"
                disabled={loading}
                className="group relative h-11 w-full overflow-hidden rounded-xl bg-[#FF6B1A] text-sm font-semibold text-white shadow-lg shadow-[#FF6B1A]/20 transition-all hover:bg-[#FF6B1A]/90 hover:shadow-xl hover:shadow-[#FF6B1A]/30 active:scale-[0.98] disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      Créer mon école
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </motion.div>
          </form>

          <motion.p className="mt-6 text-center text-xs text-gray-400" {...fadeUp(0.9)}>
            En créant votre école, vous acceptez les{" "}
            <a href="#" className="text-[#FF6B1A] hover:underline">conditions d&apos;utilisation</a>{" "}
            et la{" "}
            <a href="#" className="text-[#FF6B1A] hover:underline">politique de confidentialité</a>.
          </motion.p>

          <motion.div className="mt-4 text-center lg:hidden" {...fadeUp(1)}>
            <span className="text-sm text-gray-400">
              Déjà inscrit ?{" "}
              <Link href="/login" className="font-medium text-[#FF6B1A] hover:text-[#FF6B1A]/80 transition-colors">
                Se connecter
              </Link>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
