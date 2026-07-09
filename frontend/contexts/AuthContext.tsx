"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "@/lib/api";

type Utilisateur = {
  id: string;
  nom: string;
  email: string;
  role: string;
};

type Ecole = {
  id: string;
  nom: string;
  slug: string;
};

type AuthContextType = {
  token: string | null;
  utilisateur: Utilisateur | null;
  ecole: Ecole | null;
  loading: boolean;
  login: (email: string, motDePasse: string, ecoleSlug?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [ecole, setEcole] = useState<Ecole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      setToken(saved);
      api("/api/auth/me", { token: saved })
        .then((data) => {
          setUtilisateur(data.utilisateur);
          setEcole(data.utilisateur.ecole);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function getEcoleSlug(): string {
    if (typeof window === "undefined") return "default";
    const saved = localStorage.getItem("ecole_slug");
    if (saved) return saved;
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") return "default";
    if (hostname.includes("onrender.com") || hostname.includes("vercel.app")) return "default";
    const parts = hostname.split(".");
    if (parts.length >= 2 && parts[0] !== "www") return parts[0];
    return "default";
  }

  const login = async (email: string, motDePasse: string, ecoleSlug?: string) => {
    const slug = ecoleSlug || getEcoleSlug();
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, mot_de_passe: motDePasse, ecole_slug: slug },
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("ecole_slug", slug);
    setToken(data.token);
    setUtilisateur(data.utilisateur);
    setEcole(data.ecole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUtilisateur(null);
    setEcole(null);
  };

  return (
    <AuthContext.Provider value={{ token, utilisateur, ecole, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
