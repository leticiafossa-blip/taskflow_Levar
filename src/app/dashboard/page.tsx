"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { taskService } from "@/services/task.service";
import { Task } from "@/types/task";
import Link from "next/link";
import { TaskMetrics } from "@/components/TaskMetrics";
import { ListTodo } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await taskService.getTasksByUser(user.uid);
        setTasks(data);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const pendingCount = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const overdueCount = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < today &&
      task.status !== "completed"
  ).length;

  const completedThisWeek = tasks.filter((task) => {
    if (task.status !== "completed" || !task.updatedAt) {
      return false;
    }

    const updatedAt = new Date(task.updatedAt);
    return updatedAt >= startOfWeek;
  }).length;

  return (
    <ProtectedRoute>
      <div className="mx-auto min-h-[calc(100vh-160px)] max-w-6xl p-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-4 dark:border-slate-800 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
              Dashboard Analítico
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Acompanhe seu progresso e o status geral dos seus projetos.
            </p>
          </div>

          <div className="flex w-full gap-3 md:w-auto">
            <Link
              href="/tasks"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 md:flex-none"
            >
              <ListTodo size={20} />
              Minhas Tarefas
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-lg font-medium text-gray-500 dark:text-slate-400">
              Você ainda não tem tarefas registradas.
            </p>

            <Link
              href="/tasks"
              className="mt-2 inline-block text-blue-600 hover:underline dark:text-blue-500"
            >
              Clique aqui para acessar a lista e criar sua primeira tarefa!
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tarefas Pendentes
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
                  {pendingCount}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Concluídas (Semana)
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {completedThisWeek}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tarefas Vencidas
                </p>

                <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
                  {overdueCount}
                </p>
              </div>
            </div>

            <TaskMetrics tasks={tasks} />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
