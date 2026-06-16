'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Task } from '../types/task';

const taskSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export default function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'pending',
      dueDate: initialData?.dueDate || '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input 
          {...register('title')} 
          className="mt-1 block w-full p-2 border rounded-md" 
          placeholder="Ex: Estudar React"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea 
          {...register('description')} 
          className="mt-1 block w-full p-2 border rounded-md" 
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select {...register('status')} className="mt-1 block w-full p-2 border rounded-md">
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Progresso</option>
            <option value="completed">Concluída</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
          <input 
            type="date" 
            {...register('dueDate')} 
            className="mt-1 block w-full p-2 border rounded-md" 
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Guardar Tarefa
        </button>
      </div>
    </form>
  );
}