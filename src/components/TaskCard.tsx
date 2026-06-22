"use client";

import { Task } from "@/types/task";
import { CalendarDays, Edit, Trash2, ListChecks, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export default function TaskCard({ task, onEdit, onDelete, viewMode = 'grid' }: TaskCardProps) {
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const progressPercentage = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100);

  const priorityColors = {
    baixa: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    média: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    alta: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };
  const priorityClass = task.priority ? priorityColors[task.priority] : priorityColors["média"];

  const statusMap = {
    pending: { label: "A Fazer", className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
    in_progress: { label: "Fazendo", className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" },
    completed: { label: "Concluída", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" }
  };
  const currentStatus = task.status ? statusMap[task.status] : statusMap.pending;

  // Função segura para formatar a data
  const formatSafeDate = (dateString?: string | Date) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('pt-BR');
  };

  const createdAtFormatted = formatSafeDate(task.createdAt);

  return (
    <div className={`bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all group ${viewMode === 'list' ? 'flex flex-col md:flex-row gap-6 items-start md:items-center' : 'flex flex-col justify-between h-full'}`}>

      <div className={`flex-1 w-full ${viewMode === 'list' ? '' : 'mb-4'}`}>
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 leading-tight">
            {task.title}
          </h3>

          <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-row' : 'flex-col sm:flex-row items-end shrink-0'}`}>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${currentStatus.className}`}>
              {currentStatus.label.toUpperCase()}
            </span>
            {task.priority && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${priorityClass}`}>
                {task.priority.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <p className={`text-gray-500 dark:text-slate-400 text-sm ${viewMode === 'list' ? 'line-clamp-2 mb-0' : 'line-clamp-3 mb-4'}`}>
          {task.description || "Sem descrição."}
        </p>

        {totalSubtasks > 0 && viewMode === 'grid' && (
          <div className="mb-4 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-slate-700 mt-4">
            <div className="flex justify-between items-center text-xs font-medium text-gray-600 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1"><ListChecks size={14} /> Sub-tarefas</span>
              <span>{progressPercentage}% ({completedSubtasks}/{totalSubtasks})</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        )}

        {totalSubtasks > 0 && viewMode === 'list' && (
          <div className="flex items-center gap-2 mt-3 text-xs font-medium text-gray-600 dark:text-slate-400">
            <ListChecks size={14} className="text-blue-500" />
            <span>Progresso: {progressPercentage}% ({completedSubtasks}/{totalSubtasks} concluídas)</span>
          </div>
        )}
      </div>

      <div className={`flex flex-col shrink-0 ${viewMode === 'list' ? 'w-full md:w-56 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-6' : 'mt-auto'}`}>

        <div className="flex flex-col text-sm text-gray-500 dark:text-slate-400 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-500 dark:text-blue-400" />
            {task.dueDate ? (
              <span>
                Vence: <strong className="text-gray-700 dark:text-slate-200">
                  {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                </strong>
              </span>
            ) : (
              <span>Sem vencimento</span>
            )}
          </div>

          {/* Validação de exibição: Só mostra se a data formatada for válida */}
          {createdAtFormatted && (
            <div className="flex items-center gap-2 text-xs">
              <Clock size={14} />
              <span>Criada: <strong className="text-gray-600 dark:text-slate-300">{createdAtFormatted}</strong></span>
            </div>
          )}
        </div>

        <div className={`flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700 ${viewMode === 'list' ? 'mt-auto' : ''}`}>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => task.id && onDelete(task.id)}
              className="p-2 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <Link
            href={`/tasks/${task.id}`}
            className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Detalhes <ArrowRight size={16} />
          </Link>
        </div>
      </div>

    </div>
  );
}