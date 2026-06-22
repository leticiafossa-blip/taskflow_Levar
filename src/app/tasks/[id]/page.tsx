"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { taskService } from "@/services/task.service";
import { Task } from "@/types/task";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Calendar, Flag } from "lucide-react";
import { toast } from "sonner"; // Importação do Sonner adicionada

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newComment, setNewComment] = useState(""); // Novo estado para o comentário

  useEffect(() => {
    async function fetchTask() {
      if (!user || !id) return;
      try {
        const taskId = Array.isArray(id) ? id[0] : id;
        const fetchedTask = await taskService.getTaskById(taskId);
        setTask(fetchedTask as Task);
      } catch (error) {
        console.error("Erro ao carregar tarefa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id, user]);

  const handleToggleSubtask = async (subtaskId: string) => {
    if (!task || !task.id) return;
    const updatedSubtasks = task.subtasks?.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    setTask(updatedTask);
    try {
      await taskService.updateTask(task.id, { subtasks: updatedSubtasks });
    } catch (error) {
      console.error("Erro ao atualizar sub-tarefa:", error);
    }
  };

  const handleChangeStatus = async (newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (!task || !task.id) return;
    setSaving(true);
    try {
      await taskService.updateTask(task.id, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setSaving(false);
    }
  };

  // Função para adicionar um novo comentário/log
  const handleAddComment = async () => {
    if (!newComment.trim() || !task || !task.id) return;
    
    const comment = { 
      id: Date.now().toString(), 
      text: newComment, 
      createdAt: new Date().toLocaleString('pt-BR') 
    };
    
    const updatedComments = [...(task.comments || []), comment];
    setTask({ ...task, comments: updatedComments });
    setNewComment("");

    try {
      await taskService.updateTask(task.id, { comments: updatedComments });
      toast.success("Log adicionado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o log.");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen dark:bg-slate-950">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6 min-h-[calc(100vh-160px)]">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
            <ArrowLeft size={20} /> Voltar ao Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="border-b border-gray-100 dark:border-slate-800 p-8 bg-gray-50/50 dark:bg-slate-950/50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{task?.title}</h1>
                <p className="text-gray-600 dark:text-slate-400 text-lg">{task?.description || "Nenhuma descrição fornecida."}</p>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px]">
                <select 
                  value={task?.status}
                  onChange={(e) => handleChangeStatus(e.target.value as any)}
                  disabled={saving}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 py-2.5 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="pending">A Fazer</option>
                  <option value="in_progress">Fazendo</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                <Calendar size={18} className="text-blue-500"/>
                <span>Vencimento: <strong className="text-gray-900 dark:text-slate-200">{task?.dueDate || "Sem data"}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                <Flag size={18} className={task?.priority === 'alta' ? 'text-red-500' : task?.priority === 'baixa' ? 'text-green-500' : 'text-yellow-500'}/>
                <span>Prioridade: <strong className="text-gray-900 dark:text-slate-200 uppercase">{task?.priority || "Média"}</strong></span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              Lista de Sub-tarefas
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs py-1 px-2 rounded-full">
                {task?.subtasks?.length || 0}
              </span>
            </h2>

            {!task?.subtasks || task.subtasks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-dashed border-gray-300 dark:border-slate-800">
                <p className="text-gray-500 dark:text-slate-500">Esta tarefa não possui sub-tarefas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {task.subtasks.map((st) => (
                  <div 
                    key={st.id}
                    onClick={() => handleToggleSubtask(st.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      st.completed 
                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900 text-gray-500 dark:text-slate-500' 
                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm text-gray-800 dark:text-slate-200'
                    }`}
                  >
                    {st.completed ? (
                      <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                    ) : (
                      <Circle className="text-gray-300 dark:text-slate-600 shrink-0" size={24} />
                    )}
                    <span className={`text-lg font-medium ${st.completed ? 'line-through text-gray-400 dark:text-slate-600' : ''}`}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NOVA SEÇÃO: Log de Trabalho / Comentários */}
          <div className="p-8 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/30">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Log de Trabalho / Comentários</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Registre uma atualização na tarefa..." 
                className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Adicionar
              </button>
            </div>

            <div className="space-y-3">
              {!task?.comments || task.comments.length === 0 ? (
                <p className="text-gray-500 dark:text-slate-500 italic text-sm">Nenhum registro encontrado. Seja o primeiro a adicionar um log!</p>
              ) : (
                task.comments.map(c => (
                  <div key={c.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">📅 {c.createdAt}</p>
                    <p className="text-gray-800 dark:text-slate-200 text-sm font-medium">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}