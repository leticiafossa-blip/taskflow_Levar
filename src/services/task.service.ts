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
  Timestamp,
  getDoc
} from 'firebase/firestore';

import { Task } from '../types/task';

const COLLECTION_NAME = 'tasks';

export const taskService = {
  // Criar tarefa
  async createTask(taskData: any) {
    // Força a data de criação no momento exato em que vai pro banco
    const dataToSave = {
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "tasks"), dataToSave);
    return { id: docRef.id, ...dataToSave };
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
  async updateTask(id: string, updates: any) {
    const taskRef = doc(db, "tasks", id);
    
    // Força a atualização da data de modificação
    const dataToUpdate = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(taskRef, dataToUpdate);
  },

  // Eliminar tarefa
  async deleteTask(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  async getTaskById (id: string) {
    try {
      const docRef = doc(db, "tasks", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Task;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar a tarefa:", error);
      throw error;
    }
  }
};