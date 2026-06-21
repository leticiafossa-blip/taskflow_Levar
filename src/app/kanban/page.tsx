"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { taskService } from "@/services/task.service";
import { Task } from "@/types/task";
import Link from "next/link";
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCorners } from "@dnd-kit/core";

// --- COMPONENTES AUXILIARES ---

function DraggableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id!,
    data: { task },
  });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 cursor-grab active:cursor-grabbing mb-3 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
    >
      <h4 className="font-bold text-gray-800 dark:text-white">{task.title}</h4>
      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
      {task.dueDate && (
        <span className="inline-block mt-3 px-2 py-1 bg-gray-100 dark:bg-slate-900 text-xs font-medium text-gray-600 dark:text-slate-400 rounded">
          📅 {task.dueDate}
        </span>
      )}
    </div>
  );
}

function DroppableColumn({ id, title, tasks, colorClass }: { id: string; title: string; tasks: Task[], colorClass: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`flex flex-col bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl w-full min-w-[300px] transition-colors ${isOver ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700 dark:text-slate-200 flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
          {title}
        </h3>
        <span className="bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="flex-1 min-h-[200px]">
        {tasks.map(task => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-4 text-center text-sm text-gray-400 dark:text-slate-600">
            Arraste tarefas para cá
          </div>
        )}
      </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL DO KANBAN ---

export default function KanbanPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const data = await taskService.getTasksByUser(user.uid);
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas pro Kanban:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as 'pending' | 'in_progress' | 'completed';
    const task = tasks.find(t => t.id === taskId);
    
    if (!task || task.status === newStatus) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      await taskService.updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      fetchTasks(); 
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-6 min-h-[calc(100vh-160px)] transition-colors">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 dark:border-slate-800 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quadro Kanban</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Arraste os cards para atualizar o status.</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/dashboard"
              className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <DroppableColumn 
                id="pending" 
                title="A Fazer" 
                colorClass="bg-amber-500"
                tasks={tasks.filter(t => t.status === "pending" || !t.status)} 
              />
              <DroppableColumn 
                id="in_progress" 
                title="Fazendo" 
                colorClass="bg-blue-500"
                tasks={tasks.filter(t => t.status === "in_progress")} 
              />
              <DroppableColumn 
                id="completed" 
                title="Concluído" 
                colorClass="bg-emerald-500"
                tasks={tasks.filter(t => t.status === "completed")} 
              />
            </div>
          </DndContext>
        )}
      </div>
    </ProtectedRoute>
  );
}