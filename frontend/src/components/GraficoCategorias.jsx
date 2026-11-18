/**
 * Gráfico de rosca com as despesas (saídas) por categoria, via Recharts (RF7).
 * Props: dados = [{ nome, total, percentual }]
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CORES = [
  '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#06b6d4',
  '#ec4899', '#84cc16', '#8b5cf6', '#f97316', '#14b8a6',
];

const formatarMoeda = (valor) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function GraficoCategorias({ dados = [] }) {
  if (!dados || dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        Nenhuma saída registrada no período selecionado.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            dataKey="total"
            nameKey="nome"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={2}
            stroke="none"
          >
            {dados.map((item, indice) => (
              <Cell key={item.nome} fill={CORES[indice % CORES.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(valor, nome, props) => [
              `${formatarMoeda(valor)} (${props.payload.percentual}%)`,
              nome,
            ]}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
            }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
