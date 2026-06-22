"use client";

import Link from "next/link";
import { Menu, X, UserCircle, LayoutDashboard, KanbanSquare, CalendarDays, ListTodo } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/services/auth.service";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  async function handleLogout() { 
    await signOutUser(); 
    toast.success("Você saiu da conta."); 
    setOpen(false); 
  }
  
  return (
    <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 transition-colors duration-300">
      <nav className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
        
        <Link href="/" className="font-bold text-2xl tracking-tighter text-blue-600 dark:text-blue-500">
          TaskFlow.
        </Link>
        
        {/* Toggle Mobile + Tema */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button 
            type="button" 
            className="rounded-lg p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
            onClick={() => setOpen(v => !v)} 
            aria-label="Abrir menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Menu Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <ThemeToggle />
          
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              {/* Botão de Tarefas */}
              <Link href="/tasks" className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ListTodo size={18} />
                Tarefas
              </Link>
              
              <Link href="/kanban" className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <KanbanSquare size={18} />
                Kanban
              </Link>

              <Link href="/calendar" className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <CalendarDays size={18} />
                Calendário
              </Link>

              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div> {/* Separador Visual */}

              <Link href="/user" className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <UserCircle size={18} />
                Meu Perfil
              </Link>

              <button 
                type="button" 
                onClick={handleLogout} 
                className="ml-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Criar Conta grátis
              </Link>
            </>
          )}
        </div>
      </nav>
      
      {/* Menu Mobile */}
      {open && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 md:hidden transition-colors duration-300 shadow-lg">
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>

                {/* Botão de Tarefas Mobile */}
                <Link href="/tasks" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <ListTodo size={20} />
                  Tarefas
                </Link>
                
                <Link href="/kanban" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <KanbanSquare size={20} />
                  Kanban
                </Link>

                <Link href="/calendar" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <CalendarDays size={20} />
                  Calendário
                </Link>

                <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-2"></div>

                <Link href="/user" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <UserCircle size={20} />
                  Meu Perfil
                </Link>

                <button type="button" onClick={handleLogout} className="text-left text-base font-medium text-red-600 hover:text-red-700 transition-colors mt-2">
                  Sair da conta
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Entrar
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="bg-blue-600 text-white text-center font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Criar Conta grátis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}