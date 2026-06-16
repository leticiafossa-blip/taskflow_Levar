import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { Task } from '../types/task';

const COLLECTION_NAME = 'tasks';

export const taskService = {
  // Criar tarefa
  async createTask(taskData: Omit<Task, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...taskData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Ler tarefas de um utilizador específico
  async getTasksByUser(userId: string): Promise<Task[]> {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Task));
  },

  // Atualizar tarefa
  async updateTask(id: string, taskData: Partial<Task>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...taskData,
      updatedAt: Timestamp.now()
    });
  },

  // Eliminar tarefa
  async deleteTask(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};