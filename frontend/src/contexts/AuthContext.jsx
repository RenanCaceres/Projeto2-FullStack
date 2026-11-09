/**
 * ============================================================================
 * ARQUIVO: src/contexts/AuthContext.jsx
 * RESPONSABILIDADE: Gerenciamento Global do Estado de Autenticação (Context API).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar createContext, useState, useEffect e useContext de 'react'.
 * 2. Criar a constante AuthContext = createContext({}).
 * 3. Criar e exportar o componente AuthProvider({ children }):
 *    - Estados:
 *      * usuario: armazena os dados do usuário autenticado ({ id, nome, email, cpf }) ou null.
 *      * token: armazena a string do JWT ou null.
 *      * carregando: boolean (true enquanto verifica a sessão no primeiro carregamento).
 *    - Efeito inicial (useEffect):
 *      * Ler token e dados salvos no localStorage no boot da aplicação.
 *      * Se houver token, validar sessão chamando api.get('/auth/me').
 *      * Finalizar definindo carregando como false.
 *    - Função login({ email, senha }):
 *      * Fazer requisição POST para '/auth/login'.
 *      * Salvar token e usuario no estado e no localStorage.
 *    - Função cadastrar({ nome, email, cpf, senha, confirmacaoSenha }):
 *      * Fazer requisição POST para '/auth/cadastro'.
 *    - Função logout():
 *      * Limpar o estado (setUsuario(null), setToken(null)) e remover chaves do localStorage.
 *    - Prover no AuthContext.Provider:
 *      * { usuario, token, autenticado: !!usuario, carregando, login, cadastrar, logout }
 * 4. Exportar o hook customizado useAuth():
 *    - Retornar useContext(AuthContext) para consumo simplificado em qualquer componente.
 */
