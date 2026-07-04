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
  login: (email: string, motDePasse: string) => Promise<void>;
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

  function getSubdomain(): string | undefined {
    if (typeof window === "undefined") return undefined;
    const parts = window.location.hostname.split(".");
    if (parts.length >= 2 && parts[0] !== "localhost" && parts[0] !== "www") {
      return parts[0];
    }
    return undefined;
  }

  const login = async (email: string, motDePasse: string) => {
    const body: Record<string, string> = { email, mot_de_passe: motDePasse };
    const slug = getSubdomain();
    if (slug) body.ecole_slug = slug;
    const data = await api("/api/auth/login", {
      method: "POST",
      body,
    });
    localStorage.setItem("token", data.token);
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
