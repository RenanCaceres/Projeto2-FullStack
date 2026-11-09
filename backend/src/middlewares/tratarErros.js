/**
 * ============================================================================
 * ARQUIVO: src/middlewares/tratarErros.js
 * RESPONSABILIDADE: Middleware global para captura e tratamento centralizado de erros.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Declarar o middleware de erro com os 4 parâmetros obrigatórios: (err, req, res, next).
 * 2. Tratar violação de restrição de unicidade do banco de dados (UNIQUE violation):
 *    - No PostgreSQL (err.code === '23505'):
 *      Identificar se a constraint violada refere-se a 'cpf', 'email', nome de categoria ou fonte.
 *      Retornar status 409 Conflict no formato:
 *      { erro: 'Registro já existente.', campos: { [campo]: 'Descrição amigável' } }
 *    - No MySQL (err.code === 'ER_DUP_ENTRY').
 * 3. Tratar erros de chave estrangeira (FK violation / 23503):
 *    - Se tentar excluir registro com vínculos ou associar registro inexistente -> 409 ou 400.
 * 4. Tratar erros de validação da aplicação ou rotas não encontradas (404).
 * 5. Tratamento de fallback para erros inesperados (500 Internal Server Error):
 *    - Logar o erro detalhado no console para depuração (console.error(err)).
 *    - Responder ao cliente sem expor dados internos sensíveis:
 *      { erro: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.' }.
 */
