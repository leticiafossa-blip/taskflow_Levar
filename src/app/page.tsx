"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, CheckCircle, Calendar } from "lucide-react";
import { TextGenerateEffect } from "@/components/TextGenerateEffect";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-500/30">
      
      {/* 1. Menu Responsivo */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tighter text-blue-600 dark:text-blue-500">
            TaskFlow.
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">Entrar</Link>
            <Link href="/register" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Criar Conta grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Tela de Apresentação com Aceternity UI */}
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6">
          O Gestor de Tarefas Definitivo
        </span>
        
        {/* Componente Aceternity UI Exigido */}
        <div className="max-w-4xl mx-auto mb-6">
          <TextGenerateEffect words="Organize sua rotina com inteligência." />
        </div>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          Kanban, calendários e métricas em um só lugar. Assuma o controle dos seus projetos e alcance seus objetivos.
        </motion.p>
        
        {/* 3. Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
        >
          <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105">
            Começar Agora
          </Link>
          <Link href="/login" className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all">
            Acessar minha conta
          </Link>
        </motion.div>

        {/* 4. Mockup de Demonstração */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        >
          <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-2 bg-slate-50 dark:bg-slate-950">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-8 grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <LayoutDashboard className="text-blue-500 mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Dashboard Visual</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Acompanhe métricas, tarefas pendentes e atrasadas em tempo real.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <CheckCircle className="text-emerald-500 mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Quadro Kanban</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Arraste e solte tarefas. Mude o status do seu projeto rapidamente.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <Calendar className="text-amber-500 mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Calendário</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Visão mensal para não perder nenhum prazo importante.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}