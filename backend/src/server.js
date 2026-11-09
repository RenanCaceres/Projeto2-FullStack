/**
 * ============================================================================
 * ARQUIVO: src/server.js
 * RESPONSABILIDADE: Ponto de entrada do servidor Back-End (Node.js + Express).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar as dependências essenciais: express, cors, dotenv, etc.
 * 2. Carregar variáveis de ambiente a partir do arquivo .env via dotenv.config().
 * 3. Inicializar a aplicação Express (const app = express()).
 * 4. Registrar middlewares globais:
 *    - cors() configurado para aceitar requisições da origem do front-end (FRONTEND_URL).
 *    - express.json() para interpretação de payloads no formato JSON.
 * 5. Importar e acoplar os roteadores da pasta src/routes/:
 *    - /api/auth              -> auth.routes.js (rotas públicas de cadastro/login e rota /me)
 *    - /api/categorias        -> categorias.routes.js (rotas protegidas por JWT)
 *    - /api/fontes-destinos   -> fontesDestinos.routes.js (rotas protegidas por JWT)
 *    - /api/lancamentos       -> lancamentos.routes.js (rotas protegidas por JWT)
 *    - /api/relatorios        -> relatorios.routes.js (rotas protegidas por JWT)
 *    - /api/saude-financeira  -> saudeFinanceira.routes.js (desafio - protegida por JWT)
 * 6. Registrar o middleware centralizado de tratamento de erros (src/middlewares/tratarErros.js)
 *    obrigatoriamente APÓS a declaração de todas as rotas.
 * 7. Iniciar a escuta do servidor HTTP na porta definida na variável PORT (ex.: 3001) com app.listen().
 * 8. Exportar o app para viabilizar testes e deploys serverless.
 */
