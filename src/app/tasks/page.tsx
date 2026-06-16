'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { taskService } from '../../services/task.service';
import { Task } from '../../types/task';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function TasksPage() {
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
      fetchTasks(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao guardar tarefa:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem a certeza que deseja eliminar esta tarefa?")) {
      try {
        await taskService.deleteTask(id);
        fetchTasks(); // Recarrega a lista
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">As Minhas Tarefas</h1>
          <button 
            onClick={() => { setTaskToEdit(undefined); setIsFormOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Nova Tarefa
          </button>
        </div>

        {isFormOpen && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
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
          <p>A carregar tarefas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma tarefa encontrada. Crie a sua primeira tarefa!</p>
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