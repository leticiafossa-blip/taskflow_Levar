"use client";

import { useEffect, useState } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from '@/hooks/useAuth';
import { taskService } from '@/services/task.service';
import { Task } from '@/types/task';
import Link from 'next/link';
import { TaskMetrics } from '@/components/TaskMetrics';
import { Card, Metric, Text, Grid } from "@tremor/react";
import { ListTodo } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const data = await taskService.getTasksByUser(user.uid);
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Lógica de cálculo das métricas
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'completed').length;
  const completedThisWeek = tasks.filter(t => {
    if (t.status !== 'completed' || !t.updatedAt) return false;
    const updatedAt = new Date(t.updatedAt);
    return updatedAt >= startOfWeek;
  }).length;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6 min-h-[calc(100vh-160px)]">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 dark:border-slate-800 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Dashboard Analítico</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Acompanhe seu progresso e o status geral dos seus projetos.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {/* Botão para a futura tela de Tarefas */}
            <Link 
              href="/tasks"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              <ListTodo size={20} />
              Minhas Tarefas
            </Link>
          </div>
        </div>

        {/* Métricas e Gráficos */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-800 rounded-xl p-12 text-center">
            <p className="text-gray-500 dark:text-slate-400 font-medium text-lg">Você ainda não tem tarefas registradas.</p>
            <Link href="/tasks" className="text-blue-600 dark:text-blue-500 hover:underline mt-2 inline-block">
              Clique aqui para acessar a lista e criar sua primeira tarefa!
            </Link>
          </div>
        ) : (
          <>
            <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mb-8">
              <Card className="dark:bg-slate-900 dark:border-slate-800">
                <Text className="dark:text-slate-400">Tarefas Pendentes</Text>
                <Metric className="dark:text-white">{pendingCount}</Metric>
              </Card>
              <Card className="dark:bg-slate-900 dark:border-slate-800">
                <Text className="dark:text-slate-400">Concluídas (Semana)</Text>
                <Metric className="dark:text-emerald-400">{completedThisWeek}</Metric>
              </Card>
              <Card className="dark:bg-slate-900 dark:border-slate-800">
                <Text className="dark:text-slate-400">Tarefas Vencidas</Text>
                <Metric className="dark:text-red-400">{overdueCount}</Metric>
              </Card>
            </Grid>
            <TaskMetrics tasks={tasks} />
          </>
        )}

      </div>
    </ProtectedRoute>
  );
}