/**
 * Layout base das telas autenticadas: Navbar no topo, Sidebar à esquerda e conteúdo.
 */

import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onAbrirMenu={() => setMenuAberto(true)} />
      <div className="flex flex-1">
        <Sidebar aberta={menuAberto} onFechar={() => setMenuAberto(false)} />
        <main className="flex-1 p-4 md:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
