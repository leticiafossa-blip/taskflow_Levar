"use client";

import { useEffect, useState } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from '@/hooks/useAuth';
import { taskService } from '@/services/task.service';
import { Task } from '@/types/task';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import Link from 'next/link'; // <-- Adicionamos a importação do Link

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

  const openEditForm = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6 min-h-[calc(100vh-160px)]">
        {/* Cabeçalho atualizado com os dois botões */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard de Tarefas</h1>
            <p className="text-gray-500 mt-1">Gerencie suas atividades e acompanhe seu progresso.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {/* NOVO BOTÃO DE VOLTAR PARA O PERFIL */}
            <Link 
              href="/user"
              className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2"
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

        {isFormOpen && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {taskToEdit ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
            </h2>
            <TaskForm 
              initialData={taskToEdit} 
              onSubmit={handleCreateOrUpdate} 
              onCancel={() => { setIsFormOpen(false); setTaskToEdit(undefined); }} 
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
            <p className="text-gray-500 font-medium text-lg">Nenhuma tarefa encontrada no seu Dashboard.</p>
            <p className="text-gray-400 mt-1">Clique no botão azul acima para criar a sua primeira tarefa!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={openEditForm} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}