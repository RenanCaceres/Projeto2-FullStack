/**
 * ============================================================================
 * ARQUIVO: src/components/pages/DashboardPage.jsx
 * RESPONSABILIDADE: Painel inicial com resumo financeiro do mês corrente.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function DashboardPage() {
  const { usuario, logout } = useAuth();
  const [fontes, setFontes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setCarregando(true);
        const resFontes = await api.get('/fontes-destinos');
        setFontes(resFontes.data || []);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  const totalCartoes = fontes.filter((f) => f.tipo === 'cartao_credito');
  const totalContas = fontes.filter((f) => f.tipo === 'conta');

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto text-white">
      {/* Cabeçalho de Boas-vindas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Olá, <span className="text-emerald-400">{usuario?.nome || 'Usuário'}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Bem-vindo ao seu painel de controle financeiro FinanFlow</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/fontes-destinos"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-lg text-slate-200 border border-slate-700 transition"
          >
            Gerenciar Contas
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-sm font-semibold rounded-lg text-red-400 border border-red-800/40 transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Grid de Cards de Destaque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Contas Ativas</span>
          <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{totalContas.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Contas bancárias e carteiras cadastradas</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <span className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">Cartões de Crédito</span>
          <h3 className="text-3xl font-extrabold text-indigo-400 mt-2">{totalCartoes.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Cartões com limites e faturas monitorados</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Status do Sistema</span>
          <h3 className="text-xl font-bold text-emerald-400 mt-2">100% Online</h3>
          <p className="text-xs text-slate-500 mt-1">Conectado com segurança ao Neon PostgreSQL</p>
        </div>
      </div>

      {/* Seção de Atalhos Rápidos */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Navegação Rápida</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/fontes-destinos"
            className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-center transition group"
          >
            <p className="font-semibold text-slate-200 group-hover:text-emerald-400">Contas & Cartões</p>
            <p className="text-xs text-slate-400 mt-1">Cadastrar ou editar</p>
          </Link>

          <Link
            to="/lancamentos"
            className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-center transition group"
          >
            <p className="font-semibold text-slate-200 group-hover:text-emerald-400">Extrato & Filtros</p>
            <p className="text-xs text-slate-400 mt-1">Ver lançamentos</p>
          </Link>

          <Link
            to="/faturas"
            className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-center transition group"
          >
            <p className="font-semibold text-slate-200 group-hover:text-emerald-400">Faturas de Cartão</p>
            <p className="text-xs text-slate-400 mt-1">Projeção e limites</p>
          </Link>

          <Link
            to="/saude-financeira"
            className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-center transition group"
          >
            <p className="font-semibold text-slate-200 group-hover:text-emerald-400">Saúde Financeira</p>
            <p className="text-xs text-slate-400 mt-1">Score e diagnósticos</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
