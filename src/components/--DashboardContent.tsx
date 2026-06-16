"use client";

import {
  ShieldCheck,
  UserRoundCheck,
  MailCheck,
  Trash2,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link"; // <-- Importamos o Link para a navegação
import { useAuth } from "@/hooks/useAuth";
import {
  deleteCurrentUserAccount,
  sendVerificationAgain,
  signOutUser,
} from "@/services/auth.service";

export function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  async function handleSendVerification() {
    if (!user) {
      toast.error("Usuário não encontrado. Faça login novamente.");
      return;
    }

    if (user.emailVerified) {
      toast.info("Seu e-mail já está verificado.");
      return;
    }

    try {
      setSendingEmail(true);

      await sendVerificationAgain(user);

      toast.success("E-mail de verificação enviado com sucesso!", {
        description: "Verifique sua caixa de entrada e também o spam.",
      });
    } catch (error: any) {
      const errorCode = error?.code;

      if (errorCode === "auth/too-many-requests") {
        toast.error("Muitas tentativas de envio.", {
          description: "Aguarde alguns minutos antes de tentar novamente.",
        });
        return;
      }

      if (errorCode === "auth/user-token-expired") {
        toast.error("Sua sessão expirou.", {
          description: "Saia da conta e entre novamente.",
        });
        return;
      }

      toast.error("Não foi possível enviar o e-mail de verificação.", {
        description: "Tente sair da conta, entrar novamente e reenviar.",
      });
    } finally {
      setSendingEmail(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) {
      toast.error("Usuário não encontrado. Faça login novamente.");
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteCurrentUserAccount(user);

      toast.success("Conta excluída com sucesso.");
      router.push("/");
    } catch (error: any) {
      const errorCode = error?.code;

      if (errorCode === "auth/requires-recent-login") {
        toast.error("Por segurança, faça login novamente.", {
          description:
            "Saia da conta, entre novamente e tente excluir a conta outra vez.",
        });
        return;
      }

      toast.error("Não foi possível excluir a conta.", {
        description: "Tente sair e entrar novamente antes de excluir.",
      });
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
    <section className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-6 py-10">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-slate-950 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            <ShieldCheck size={18} />
            Área segura
          </span>

          <h1 className="mt-5 text-4xl font-bold">
            Bem-vindo ao Dashboard TaskFlow
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Esta área é exclusiva para usuários autenticados. Aqui você pode
            visualizar seus dados de acesso, acompanhar o status da conta e
            gerenciar suas tarefas.
          </p>

          {/* NOVO BOTÃO DE TAREFAS ADICIONADO AQUI */}
          <div className="mt-8">
            <Link 
              href="/tasks" 
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
            >
              📋 Gerenciar Minhas Tarefas
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <UserRoundCheck className="text-blue-600" />

            <h2 className="mt-4 text-xl font-bold text-slate-950">
              Usuário autenticado
            </h2>

            <p className="mt-2 text-slate-600">
              Nome: <strong>{user?.displayName || "Não informado"}</strong>
            </p>

            <p className="mt-1 break-all text-slate-600">
              E-mail: <strong>{user?.email}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Sair da conta
          </button>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <MailCheck
              className={user?.emailVerified ? "text-green-600" : "text-amber-600"}
            />

            <h2 className="mt-4 text-xl font-bold text-slate-950">
              Verificação de e-mail
            </h2>

            <p className="mt-2 text-slate-600">
              Status:{" "}
              <strong>
                {user?.emailVerified
                  ? "E-mail verificado"
                  : "E-mail ainda não verificado"}
              </strong>
            </p>
          </div>

          {!user?.emailVerified ? (
            <button
              type="button"
              onClick={handleSendVerification}
              disabled={sendingEmail}
              className="mt-6 w-full inline-flex justify-center items-center gap-2 rounded-xl border border-blue-600 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw size={16} />
              {sendingEmail ? "Enviando..." : "Reenviar verificação"}
            </button>
          ) : (
            <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 text-center border border-green-100">
              Sua conta já está verificada.
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <Trash2 className="text-red-600" />

            <h2 className="mt-4 text-xl font-bold text-red-950">
              Excluir conta
            </h2>

            <p className="mt-2 text-red-800 text-sm">
              Ao excluir sua conta, o acesso ao sistema e todas as suas tarefas serão removidos de forma permanente.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Excluindo..." : "Excluir minha conta"}
          </button>
        </article>
      </div>
    </section>
  );
}