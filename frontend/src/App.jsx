/**
 * ============================================================================
 * ARQUIVO: src/App.jsx
 * RESPONSABILIDADE: Componente Raiz da Aplicação, Provedores de Contexto e Roteamento.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar BrowserRouter, Routes e Route de 'react-router-dom'.
 * 2. Importar o AuthProvider de './contexts/AuthContext.jsx'.
 * 3. Importar o componente de proteção de rotas (RotaProtegida de './components/RotaProtegida.jsx').
 * 4. Importar as páginas da aplicação:
 *    - LoginPage, CadastroPage
 *    - DashboardPage, LancamentosPage, CategoriasPage, FontesDestinosPage
 *    - RelatoriosPage, FaturasPage, SaudeFinanceiraPage
 * 5. Estruturar a árvore de roteamento:
 *    - Envolver toda a aplicação com <AuthProvider> e <BrowserRouter>.
 *    - Definir rotas públicas:
 *      * /login           -> <LoginPage />
 *      * /cadastro        -> <CadastroPage />
 *    - Definir rotas privadas (protegidas por autenticação):
 *      * /                -> <RotaProtegida><DashboardPage /></RotaProtegida>
 *      * /lancamentos     -> <RotaProtegida><LancamentosPage /></RotaProtegida>
 *      * /categorias      -> <RotaProtegida><CategoriasPage /></RotaProtegida>
 *      * /fontes-destinos -> <RotaProtegida><FontesDestinosPage /></RotaProtegida>
 *      * /relatorios      -> <RotaProtegida><RelatoriosPage /></RotaProtegida>
 *      * /faturas         -> <RotaProtegida><FaturasPage /></RotaProtegida>
 *      * /saude           -> <RotaProtegida><SaudeFinanceiraPage /></RotaProtegida>
 *    - Rota curinga (*) para redirecionamento ou página 404 Not Found.
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/fontes-destinos" element={<FontesDestinosPage />} />
            <Route path="/lancamentos" element={<LancamentosPage />} />
            <Route path="/faturas" element={<FaturasPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/saude-financeira" element={<SaudeFinanceiraPage />} />
          </Route>

          {/* Rota Padrão: Redireciona a raiz "/" para o dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}