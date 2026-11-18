/**
 * Menu lateral de navegação. Fixo em telas médias/grandes e deslizante (drawer) no mobile.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Wallet,
  PieChart,
  CreditCard,
  HeartPulse,
  X,
} from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Dashboard', icone: LayoutDashboard, end: true },
  { to: '/lancamentos', label: 'Lançamentos', icone: ArrowLeftRight },
  { to: '/categorias', label: 'Categorias', icone: Tags },
  { to: '/fontes-destinos', label: 'Contas e Cartões', icone: Wallet },
  { to: '/relatorios', label: 'Relatórios', icone: PieChart },
  { to: '/faturas', label: 'Faturas de Cartão', icone: CreditCard },
  { to: '/saude', label: 'Saúde Financeira', icone: HeartPulse },
];

export default function Sidebar({ aberta = false, onFechar }) {
  return (
    <>
      {aberta && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onFechar} aria-hidden="true" />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-4 transform transition-transform duration-200 md:translate-x-0 ${
          aberta ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <span className="text-xl font-bold text-emerald-400">FinanFlow</span>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar menu"
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {LINKS.map(({ to, label, icone: Icone, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onFechar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                    : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Icone size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
