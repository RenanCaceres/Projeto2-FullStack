/**
 * ============================================================================
 * ARQUIVO: src/App.jsx
 * RESPONSABILIDADE: Componente Raiz da Aplicação, Provedores de Contexto e Roteamento.
 * Integrado: Pedro Larini & Renan Cáceres
 * ============================================================================
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';

// Páginas de Autenticação
import LoginPage from './components/pages/LoginPage.jsx';
import CadastroPage from './components/pages/CadastroPage.jsx';

// Páginas da Aplicação
import DashboardPage from './components/pages/DashboardPage.jsx';
import CategoriasPage from './components/pages/CategoriasPage.jsx';
import FontesDestinosPage from './components/pages/FontesDestinosPage.jsx';
import LancamentosPage from './components/pages/LancamentosPage.jsx';
import FaturasPage from './components/pages/FaturasPage.jsx';
import RelatoriosPage from './components/pages/RelatoriosPage.jsx';
import SaudeFinanceiraPage from './components/pages/SaudeFinanceiraPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* 1. O AuthProvider envelopa toda a aplicação */}
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* Rotas Protegidas (Exigem Login) */}
          <Route element={<RotaProtegida />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/fontes-destinos" element={<FontesDestinosPage />} />
            <Route path="/lancamentos" element={<LancamentosPage />} />
            <Route path="/faturas" element={<FaturasPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/saude" element={<SaudeFinanceiraPage />} />
            <Route path="/saude-financeira" element={<SaudeFinanceiraPage />} />
          </Route>

          {/* Rota Padrão: Redireciona qualquer rota não mapeada para "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
