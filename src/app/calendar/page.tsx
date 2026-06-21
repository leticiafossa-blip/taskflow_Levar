"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { taskService } from "@/services/task.service";
import { Task } from "@/types/task";
import Link from "next/link";

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTasksForCalendar() {
      if (!user) return;
      try {
        const tasks = await taskService.getTasksByUser(user.uid);
        
        // Mapeia as tarefas para o formato que o FullCalendar entende
        const calendarEvents = tasks
          .filter(task => task.dueDate) // Apenas tarefas com data de vencimento
          .map(task => ({
            id: task.id,
            title: task.title,
            date: task.dueDate, // Certifique-se de que dueDate está no formato YYYY-MM-DD
            extendedProps: { ...task },
            backgroundColor: task.status === "completed" ? "#10b981" : task.status === "in_progress" ? "#3b82f6" : "#f59e0b",
            borderColor: "transparent",
          }));
          
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Erro ao carregar tarefas para o calendário:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasksForCalendar();
  }, [user]);

  const handleEventClick = (clickInfo: any) => {
    const taskData = clickInfo.event.extendedProps;
    setSelectedTask(taskData);
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-6 min-h-[calc(100vh-160px)] transition-colors">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 dark:border-slate-800 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Calendário de Tarefas</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Visualize seus prazos e vencimentos.</p>
          </div>
          <Link href="/dashboard" className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            Voltar ao Dashboard
          </Link>
        </div>

        {/* Container do Calendário com fundo Dark Mode */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              locale="pt-br"
              height="auto"
            />
          )}
        </div>

        {/* Modal de Detalhes */}
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedTask.title}</h2>
              <p className="text-gray-600 dark:text-slate-400 mb-4">{selectedTask.description || "Sem descrição."}</p>
              
              <div className="space-y-2 mb-6 text-gray-800 dark:text-slate-200">
                <p className="text-sm"><strong>Vencimento:</strong> {selectedTask.dueDate}</p>
                <p className="text-sm"><strong>Status:</strong> {selectedTask.status}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600">Fechar</button>
                <Link href={`/tasks/${selectedTask.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Ver Detalhes</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}