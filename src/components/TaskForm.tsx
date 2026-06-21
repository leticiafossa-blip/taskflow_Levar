"use client";

import { useState } from "react";
import { Task, SubTask } from "@/types/task";
import { Trash2, Plus } from "lucide-react";

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: Partial<Task>) => void;
  onCancel: () => void;
}

export default function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>(initialData?.status || "pending");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [priority, setPriority] = useState<'baixa' | 'média' | 'alta'>(initialData?.priority || "média");
  
  const [subtasks, setSubtasks] = useState<SubTask[]>(initialData?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSubtask: SubTask = {
      id: Date.now().toString(),
      title: newSubtaskTitle,
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskTitle("");
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status, dueDate, priority, subtasks });
  };

  // Estilização comum para inputs
  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Título da Tarefa *</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Ex: Estudar Next.js" />
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="Detalhes da tarefa..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Data de Vencimento</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className={inputClass}>
                <option value="pending">A Fazer</option>
                <option value="in_progress">Fazendo</option>
                <option value="completed">Concluída</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Prioridade</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className={inputClass}>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors">
          <label className={labelClass}>Sub-tarefas</label>
          <div className="flex gap-2 mb-4">
            <input type="text" value={newSubtaskTitle} onChange={(e) => setNewSubtaskTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())} className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Nova sub-tarefa..." />
            <button type="button" onClick={handleAddSubtask} className="bg-slate-800 dark:bg-blue-600 text-white p-2 rounded-lg hover:bg-slate-700 dark:hover:bg-blue-700 transition"><Plus size={20} /></button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {subtasks.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">Nenhuma sub-tarefa adicionada.</p>
            ) : (
              subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 border border-gray-200 dark:border-slate-700 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-slate-200 truncate pr-2">{st.title}</span>
                  <button type="button" onClick={() => handleRemoveSubtask(st.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"><Trash2 size={16} /></button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition">Cancelar</button>
        <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
          {initialData ? "Salvar Alterações" : "Criar Tarefa"}
        </button>
      </div>
    </form>
  );
}