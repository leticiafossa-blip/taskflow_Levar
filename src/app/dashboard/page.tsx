"use client";

import { useEffect, useState } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from '@/hooks/useAuth';
import { taskService } from '@/services/task.service';
import { Task } from '@/types/task';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import Link from 'next/link';
import { TaskMetrics } from '@/components/TaskMetrics';
import { Card, Metric, Text, Grid } from "@tremor/react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
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

  // Lógica de cálculo das métricas exigidas
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

  const handleCreateOrUpdate = async (data: any) => {
    if (!user) return;
    try {
      if (taskToEdit && taskToEdit.id) {
        await taskService.updateTask(taskToEdit.id, data);
      } else {
        await taskService.createTask({ ...data, userId: user.uid });
      }
      setIsFormOpen(false);
      setTaskToEdit(undefined);
      fetchTasks(); 
    } catch (error) {
      console.error("Erro ao guardar tarefa:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem a certeza que deseja eliminar esta tarefa?")) {
      try {
        await taskService.deleteTask(id);
        fetchTasks(); 
      } catch (error) {
        console.error("Erro ao eliminar:", error);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6 min-h-[calc(100vh-160px)]">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 dark:border-slate-800 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Dashboard de Tarefas</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Gerencie suas atividades e acompanhe seu progresso.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link 
              href="/user"
              className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              👤 Meu Perfil
            </Link>
            <button 
              onClick={() => { setTaskToEdit(undefined); setIsFormOpen(true); }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-colors flex-1 md:flex-none"
            >
              + Nova Tarefa
            </button>
          </div>
        </div>

        {/* Métricas e Gráficos */}
        {!loading && tasks.length > 0 && (
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

        {/* Formulário */}
        {isFormOpen && (
          <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {taskToEdit ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
            </h2>
            <TaskForm 
              initialData={taskToEdit} 
              onSubmit={handleCreateOrUpdate} 
              onCancel={() => { setIsFormOpen(false); setTaskToEdit(undefined); }} 
            />
          </div>
        )}

        {/* Grid de Tarefas */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : tasks.length === 0 ? (
          <div className="bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-800 rounded-xl p-12 text-center">
            <p className="text-gray-500 dark:text-slate-400 font-medium text-lg">Nenhuma tarefa encontrada.</p>
            <p className="text-gray-400 dark:text-slate-500 mt-1">Clique no botão azul para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={(t) => { setTaskToEdit(t); setIsFormOpen(true); }} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}