/**
 * ============================================================================
 * ARQUIVO: src/components/pages/SaudeFinanceiraPage.jsx
 * RESPONSABILIDADE: Painel do Desafio de Saúde Financeira (+10 pontos extras).
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';

export default function SaudeFinanceiraPage() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDiagnostico() {
      try {
        setCarregando(true);
        const res = await api.get('/saude-financeira');
        setDados(res.data);
      } catch (err) {
        console.error('Erro ao buscar dados de saúde financeira:', err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDiagnostico();
  }, []);

  if (carregando) {
    return (
      <div className="p-8 text-center text-slate-400">
        Calculando indicadores de saúde financeira...
      </div>
    );
  }

  const score = dados?.score || 0;
  const corScore =
    score >= 80 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
    score >= 60 ? 'text-blue-400 border-blue-500/40 bg-blue-500/10' :
    score >= 40 ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10' :
    'text-red-400 border-red-500/40 bg-red-500/10';

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto text-white">
      {/* Cabeçalho */}
      <div className="mb-8">
        <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Desafio Acadêmico (+10 Pontos)
        </span>
        <h1 className="text-3xl font-bold text-slate-100 mt-3">Diagnóstico de Saúde Financeira</h1>
        <p className="text-slate-400 text-sm mt-1">
          Análise automática do seu comportamento de consumo, taxa de poupança e projeções futuras
        </p>
      </div>

      {/* Grid Principal com Score e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Card do Score */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl">
          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-2">
            Score Geral de Saúde
          </span>
          <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${corScore} my-4 shadow-lg`}>
            <span className="text-4xl font-extrabold">{score}</span>
            <span className="text-xs font-semibold uppercase">{dados?.classificacao}</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mt-2">
            Baseado na sua taxa de poupança, controle de gastos supérfluos e limite comprometido no cartão.
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-medium">Taxa de Poupança</span>
            <h3 className="text-3xl font-bold text-emerald-400 mt-2">{dados?.taxaPoupanca}%</h3>
            <p className="text-xs text-slate-500 mt-1">Percentual da renda líquida guardada após despesas</p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-medium">Comprometimento com Cartão</span>
            <h3 className={`text-3xl font-bold mt-2 ${dados?.comprometimentoParcelado > 30 ? 'text-red-400' : 'text-indigo-400'}`}>
              {dados?.comprometimentoParcelado}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">Fatia das receitas vinculada a compras parceladas</p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-medium">Receitas Consolidadas</span>
            <h3 className="text-2xl font-bold text-slate-100 mt-2">
              {Number(dados?.entradas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Total acumulado de entradas no histórico</p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-medium">Despesas Consolidadas</span>
            <h3 className="text-2xl font-bold text-slate-100 mt-2">
              {Number(dados?.saidas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Total acumulado de saídas e parcelamentos</p>
          </div>
        </div>
      </div>

      {/* Recomendações e Dicas Inteligentes */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
          💡 Recomendações e Insights do Sistema
        </h3>
        <div className="space-y-3">
          {dados?.dicas?.map((dica, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-200 text-sm flex items-start space-x-3"
            >
              <span className="text-emerald-400 font-bold">•</span>
              <span>{dica}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
