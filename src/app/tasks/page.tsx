"use client";

import { useEffect, useState } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from '@/hooks/useAuth';
import { taskService } from '@/services/task.service';
import { Task } from '@/types/task';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import { toast } from 'sonner';
import { Plus, ListTodo, X, LayoutGrid, List, FilterX } from 'lucide-react';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // NOVO: Estados de Filtro
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const data = await taskService.getTasksByUser(user.uid);
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      toast.error("Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleSaveTask = async (taskData: any) => {
    if (!user) return;
    try {
      if (taskToEdit && taskToEdit.id) {
        await taskService.updateTask(taskToEdit.id, { ...taskData, updatedAt: new Date().toISOString() });
        toast.success('Tarefa atualizada com sucesso!');
      } else {
        // NOVO: Persiste a data de criação no momento exato em que é criada
        const createdAt = new Date().toISOString();
        await taskService.createTask({ ...taskData, userId: user.uid, createdAt });
        toast.success('Tarefa criada com sucesso!');
      }
      setIsFormOpen(false);
      setTaskToEdit(undefined);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      toast.error('Erro ao salvar tarefa.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Tarefa excluída!');
        fetchTasks();
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
        toast.error('Erro ao excluir tarefa.');
      }
    }
  };

  // NOVO: Lógica Matemática dos Filtros
  const filteredTasks = tasks.filter(task => {
    // 1. Filtro de Status
    const matchStatus = filterStatus === "all" || task.status === filterStatus;
    
    // 2. Filtro de Data (Verifica tanto a de Vencimento quanto a de Criação)
    let matchDate = true;
    if (filterDate) {
      const createdDateOnly = task.createdAt ? task.createdAt.split('T')[0] : "";
      matchDate = (task.dueDate === filterDate) || (createdDateOnly === filterDate);
    }
    
    return matchStatus && matchDate;
  });

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-6 min-h-[calc(100vh-160px)]">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-200 dark:border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-500">
              <ListTodo size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Minhas Tarefas</h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Gerencie e organize todas as suas atividades.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
              <button onClick={() => setViewMode('grid')} title="Visualização em Grade" className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                <LayoutGrid size={20} />
              </button>
              <button onClick={() => setViewMode('list')} title="Visualização em Lista" className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                <List size={20} />
              </button>
            </div>

            <button 
              onClick={() => { setTaskToEdit(undefined); setIsFormOpen(true); }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              <Plus size={20} />
              Nova Tarefa
            </button>
          </div>
        </div>

        {/* NOVA SEÇÃO: Painel de Filtros */}
        {tasks.length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 mb-8 flex flex-col sm:flex-row gap-4 items-end transition-colors">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Filtrar por Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="all">Todas as Tarefas</option>
                <option value="pending">A Fazer</option>
                <option value="in_progress">Fazendo</option>
                <option value="completed">Concluídas</option>
              </select>
            </div>
            
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Filtrar por Data</label>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {(filterDate || filterStatus !== 'all') && (
              <button 
                onClick={() => { setFilterDate(""); setFilterStatus("all"); }}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <FilterX size={18} />
                Limpar Filtros
              </button>
            )}
          </div>
        )}

        {/* Listagem */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <ListTodo size={48} className="text-gray-400 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md">Você ainda não possui nenhuma tarefa cadastrada. Clique no botão acima para começar a se organizar!</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          // NOVO: Estado quando a busca não encontra resultados
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <FilterX size={48} className="text-gray-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Nenhum resultado para os filtros</h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6">Não foram encontradas tarefas com a data e status selecionados.</p>
            <button onClick={() => { setFilterDate(""); setFilterStatus("all"); }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Limpar filtros de busca
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} viewMode={viewMode} onEdit={(t) => { setTaskToEdit(t); setIsFormOpen(true); }} onDelete={handleDeleteTask} />
            ))}
          </div>
        )}

        {/* Modal de Formulário (Criar/Editar) */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-800">
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <TaskForm initialData={taskToEdit} onSubmit={handleSaveTask} onCancel={() => setIsFormOpen(false)} />
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}