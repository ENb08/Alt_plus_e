"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      await login(email, motDePasse);
      router.push("/");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-gradient-start to-primary-gradient-end">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
        style={{ boxShadow: "0 10px 25px rgba(16,32,48,0.15)" }}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-2xl font-bold text-white">
            E
          </div>
          <h1 className="text-2xl font-bold text-text-dark">Alt+E</h1>
          <p className="mt-1 text-sm text-text-secondary">Gestion Scolaire</p>
        </div>

        {erreur && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-error">
            <span>{erreur}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-text-dark placeholder-text-muted transition focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="admin@ecole.demo"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-text-dark placeholder-text-muted transition focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="admin123"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
