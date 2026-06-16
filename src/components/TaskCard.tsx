'use client';

import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    pending: 'Pendente',
    in_progress: 'Em Progresso',
    completed: 'Concluída',
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-xs text-gray-500 mb-4">
          Vence a: {new Date(task.dueDate).toLocaleDateString('pt-PT')}
        </p>
      )}

      <div className="flex justify-end space-x-2 border-t pt-3">
        <button 
          onClick={() => onEdit(task)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Editar
        </button>
        <button 
          onClick={() => task.id && onDelete(task.id)}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}