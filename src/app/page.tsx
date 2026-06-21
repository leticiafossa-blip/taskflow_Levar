import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, LockKeyhole, Sparkles } from "lucide-react";

const features = [
  "Login com e-mail e senha",
  "Login social com Google e GitHub",
  "Proteção de rotas autenticadas",
  "Exclusão de conta do usuário",
];

export default function HomePage() {
  return (
    // Adicionado dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
    <section className="min-h-[calc(100vh-160px)] transition-colors duration-300 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
            <Sparkles size={16} />
            Sistema de gestão de tarefas
          </span>

          {/* Adicionado dark:text-white */}
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl transition-colors">
            TaskFlow: organize suas tarefas com segurança e praticidade.
          </h1>

          {/* Adicionado dark:text-slate-300 */}
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300 transition-colors">
            Plataforma criada com Next.js, Tailwind CSS e Firebase Authentication
            para gerenciamento seguro de acesso de usuários e organização de tarefas.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Criar conta
              <ArrowRight size={18} />
            </Link>

            {/* Adicionado dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 font-semibold text-slate-800 dark:text-white transition hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Entrar
            </Link>
          </div>

          <ul className="mt-8 grid gap-3 text-slate-700 dark:text-slate-300 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="text-blue-600 dark:text-blue-500" size={18} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Adicionado dark:bg-slate-900 dark:border-slate-800 */}
        <div className="rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl shadow-blue-900/10 transition-colors">
          <div className="rounded-2xl bg-slate-950 dark:bg-slate-950 p-5 text-white border border-transparent dark:border-slate-800">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Demonstração do sistema</p>
                <h2 className="text-xl font-bold text-white">Dashboard TaskFlow</h2>
              </div>
              <LayoutDashboard className="text-blue-300" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Pendentes</p>
                <strong className="text-3xl text-white">12</strong>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Concluídas</p>
                <strong className="text-3xl text-white">08</strong>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Vencidas</p>
                <strong className="text-3xl text-white">03</strong>
              </div>
            </div>

            {/* Adicionado dark:bg-slate-800 dark:text-white */}
            <div className="mt-5 rounded-2xl bg-white dark:bg-slate-800 p-5 text-slate-950 dark:text-white transition-colors">
              <div className="mb-4 flex items-center gap-2">
                <LockKeyhole size={18} className="text-blue-600 dark:text-blue-400" />
                <strong>Área protegida</strong>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-4/5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}