"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { utilisateur, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !utilisateur) {
      router.push("/login");
    }
  }, [utilisateur, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!utilisateur) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">{children}</main>
    </div>
  );
}
