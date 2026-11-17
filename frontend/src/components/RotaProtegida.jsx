/**
 * ============================================================================
 * ARQUIVO: src/components/RotaProtegida.jsx
 * RESPONSABILIDADE: Guardião de rotas privadas (Guarda de Navegação no React Router).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar Navigate de 'react-router-dom'.
 * 2. Importar o hook useAuth de '../contexts/AuthContext.jsx'.
 * 3. Componente RotaProtegida({ children }):
 *    - Obter { autenticado, carregando } do useAuth().
 *    - Se carregando for true: renderizar indicador de carregamento (Spinner/Loading)
 *      para evitar redirecionamentos indesejados antes da leitura do localStorage.
 *    - Se autenticado for false: redirecionar para '/login' via <Navigate to="/login" replace />.
 *    - Se autenticado for true: renderizar o conteúdo protegido (children).
 */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function RotaProtegida({ children }) {
  const { autenticado, carregando } = useAuth();

  // 1. Se ainda estiver lendo o localStorage, não toma decisões precipitadas
  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <p className="text-lg">Carregando sessão...</p>
      </div>
    );
  }

    // 2. Se não estiver autenticado, redireciona para /login
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se estiver autenticado, libera o acesso aos componentes filhos
  return children ? children : <Outlet />;
}