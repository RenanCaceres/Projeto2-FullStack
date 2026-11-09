/**
 * ============================================================================
 * ARQUIVO: src/services/api.js
 * RESPONSABILIDADE: Cliente HTTP centralizado (Axios) para comunicação com a API REST.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar axios.
 * 2. Criar a instância api através de axios.create() com:
 *    - baseURL: import.meta.env.VITE_API_URL (ou 'http://localhost:3001/api')
 *    - headers: { 'Content-Type': 'application/json' }
 * 3. Configurar Interceptor de Requisição (Request Interceptor):
 *    - Obter o token JWT salvo no localStorage (ex.: localStorage.getItem('@FinanFlow:token')).
 *    - Se o token existir, anexar no cabeçalho Authorization: `Bearer ${token}`.
 * 4. Configurar Interceptor de Resposta (Response Interceptor):
 *    - Tratar status 401 Unauthorized:
 *      * Se a API devolver 401, significa que o token expirou ou é inválido.
 *      * Limpar o localStorage (remover token e dados do usuário).
 *      * Redirecionar o navegador para a tela de login (/login) de forma limpa.
 *    - Rejeitar a promise repassando o erro para ser tratado nos componentes.
 * 5. Exportar a instância api como export default.
 */
