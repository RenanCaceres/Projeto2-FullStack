/**
 * Barra de navegação superior: logo, usuário logado e botão de sair.
 * Em telas pequenas exibe o botão hambúrguer que abre o menu lateral.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function Navbar({ onAbrirMenu }) {
  const { usuario, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAbrirMenu}
          aria-label="Abrir menu"
          className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>
        <Link to="/" className="text-xl font-bold text-emerald-400">
          FinanFlow
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-slate-300">{usuario?.nome}</span>
        <div
          className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-semibold text-sm flex items-center justify-center"
          title={usuario?.nome}
        >
          {iniciais(usuario?.nome)}
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
