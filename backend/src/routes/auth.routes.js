/**
 * ============================================================================
 * ARQUIVO: src/routes/auth.routes.js
 * RESPONSABILIDADE: Rotas e controladores para Autenticação e Usuários (RF1 e RF2).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Criar instância do Router do Express: const router = express.Router().
 * 2. ROTA POST /cadastro:
 *    - Middlewares: validarCadastro.
 *    - Controlador:
 *      * Gerar hash seguro da senha com bcrypt (salt de custo 10).
 *      * Criar usuário via Usuario.criar(...) normalizando email e CPF.
 *      * Criar categorias padrão e conta padrão chamando Categoria.criarPadrao() e FonteDestino.criarPadrao().
 *      * Responder status 201 com dados públicos do usuário (sem senha_hash).
 * 3. ROTA POST /login:
 *    - Middlewares: rate limiter e validarLogin.
 *    - Controlador:
 *      * Buscar usuário pelo e-mail normalizado.
 *      * Comparar senha enviada com o hash via bcrypt.compare().
 *      * Se não bater, responder 401 com mensagem genérica ("E-mail ou senha inválidos").
 *      * Se bater, gerar e retornar token JWT e dados do usuário com status 200.
 * 4. ROTA GET /me:
 *    - Middlewares: autenticar.
 *    - Controlador:
 *      * Buscar dados atualizados do usuário autenticado a partir de req.usuarioId.
 *      * Retornar status 200.
 * 5. Exportar o router como default.
 */
