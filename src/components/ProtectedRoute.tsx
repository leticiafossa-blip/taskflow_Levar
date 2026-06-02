"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
export function ProtectedRoute({ children }: { children: React.ReactNode }) { const { user, loading } = useAuth(); const router = useRouter(); useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, router, user]); if (loading) return <section className="flex min-h-[calc(100vh-160px)] items-center justify-center"><div className="flex items-center gap-3 text-slate-600"><Loader2 className="animate-spin"/>Carregando autenticação...</div></section>; if (!user) return null; return <>{children}</>; }
