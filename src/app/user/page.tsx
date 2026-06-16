"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ShieldCheck, UserRoundCheck, MailCheck, Trash2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { deleteCurrentUserAccount, sendVerificationAgain, signOutUser } from "@/services/auth.service";

export default function UserPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  async function handleSendVerification() {
    if (!user) return;
    try {
      setSendingEmail(true);
      await sendVerificationAgain(user);
      toast.success("E-mail de verificação enviado!");
    } catch (error: any) {
      toast.error("Erro ao enviar e-mail. Aguarde uns minutos.");
    } finally {
      setSendingEmail(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    const confirmed = window.confirm("Tem certeza que deseja excluir sua conta permanentemente?");
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteCurrentUserAccount(user);
      toast.success("Conta excluída com sucesso.");
      router.push("/");
    } catch (error: any) {
      toast.error("Erro ao excluir conta. Saia e entre novamente por segurança.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleLogout() {
    await signOutUser();
    toast.success("Você saiu da conta.");
    router.push("/");
  }

  return (
    <ProtectedRoute>
      <section className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-slate-950 p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <ShieldCheck size={18} />
              Área da Conta
            </span>

            <h1 className="mt-5 text-4xl font-bold">
              Meu Perfil
            </h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              Gerencie seus dados de acesso, segurança e exclusão de conta.
            </p>

            <div className="mt-8">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
              >
                📋 Acessar o Dashboard de Tarefas
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <UserRoundCheck className="text-blue-600" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">Dados do Usuário</h2>
              <p className="mt-2 text-slate-600">Nome: <strong>{user?.displayName || "Não informado"}</strong></p>
              <p className="mt-1 break-all text-slate-600">E-mail: <strong>{user?.email}</strong></p>
            </div>
            <button onClick={handleLogout} className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
              Sair da conta
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <MailCheck className={user?.emailVerified ? "text-green-600" : "text-amber-600"} />
              <h2 className="mt-4 text-xl font-bold text-slate-950">Verificação</h2>
              <p className="mt-2 text-slate-600">Status: <strong>{user?.emailVerified ? "Verificado" : "Não verificado"}</strong></p>
            </div>
            {!user?.emailVerified ? (
              <button onClick={handleSendVerification} disabled={sendingEmail} className="mt-6 w-full inline-flex justify-center items-center gap-2 rounded-xl border border-blue-600 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60">
                <RefreshCcw size={16} />
                {sendingEmail ? "Enviando..." : "Reenviar e-mail"}
              </button>
            ) : (
              <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 text-center border border-green-100">
                E-mail confirmado.
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <Trash2 className="text-red-600" />
              <h2 className="mt-4 text-xl font-bold text-red-950">Excluir conta</h2>
              <p className="mt-2 text-red-800 text-sm">A exclusão apagará seus dados e tarefas permanentemente.</p>
            </div>
            <button onClick={handleDeleteAccount} disabled={deleting} className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
              {deleting ? "Excluindo..." : "Excluir permanentemente"}
            </button>
          </article>
        </div>
      </section>
    </ProtectedRoute>
  );
}