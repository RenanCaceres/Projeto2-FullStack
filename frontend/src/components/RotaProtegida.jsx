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
