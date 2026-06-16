export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string; // Formato ISO ou string de data
  subtasks?: Subtask[];
  createdAt: Date;
  updatedAt?: Date;
}