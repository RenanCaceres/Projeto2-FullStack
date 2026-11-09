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
