'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export default function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Olá, {user?.displayName || user?.email || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bem-vindo ao seu painel do TaskFlow.
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* BOTÃO PARA IR PARA AS TAREFAS */}
          <Link 
            href="/tasks" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            📋 Gerenciar Tarefas
          </Link>
          
          <button
            onClick={logout}
            className="border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Sair da Conta
          </button>
        </div>
      </div>

      {/* Espaço reservado para as métricas e gráficos do Tremor (Entrega Final) */}
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
        <p className="text-gray-500 font-medium">Os gráficos e métricas do Tremor serão injetados aqui na próxima etapa.</p>
        <p className="text-gray-400 text-sm mt-1">O motor do CRUD de tarefas já está isolado e pronto na página de gerenciamento.</p>
      </div>
    </div>
  );
}