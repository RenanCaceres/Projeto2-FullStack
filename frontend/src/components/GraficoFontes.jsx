/**
 * ============================================================================
 * ARQUIVO: src/components/GraficoFontes.jsx
 * RESPONSABILIDADE: Visualização gráfica de entradas por fonte e saídas por destino (RF8).
 * ============================================================================
 */

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export default function GraficoFontes({ dados = [] }) {
  if (!dados || dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        Nenhum dado financeiro para o período selecionado.
      </div>
    );
  }

  // Formata os valores para tooltip
  const formatadorMoeda = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="nome"
            stroke="#94a3b8"
            fontSize={12}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(v) => `R$ ${v}`}
          />
          <Tooltip
            formatter={(value, name) => [
              formatadorMoeda(value),
              name === 'entradas' ? 'Entradas' : 'Saídas',
            ]}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px' }}
            formatter={(val) => (val === 'entradas' ? 'Entradas (R$)' : 'Saídas (R$)')}
          />
          <Bar dataKey="entradas" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="saidas" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
