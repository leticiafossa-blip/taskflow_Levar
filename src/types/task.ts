export interface SubTask {
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
  dueDate?: string;
  priority?: 'baixa' | 'média' | 'alta';
  subtasks?: SubTask[];
  createdAt?: Date | any;
}