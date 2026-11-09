/**
 * ============================================================================
 * ARQUIVO: src/middlewares/autenticar.js
 * RESPONSABILIDADE: Middleware de interceptação e autenticação via Token JWT (RF2 e RF3).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Extrair o cabeçalho 'authorization' de req.headers.
 * 2. Verificar se o formato recebido obedece ao padrão 'Bearer <token>'.
 *    - Se ausente ou com esquema incorreto, retornar status 401 com { erro: 'Token não informado.' }.
 * 3. Validar a assinatura e expiração do token utilizando jsonwebtoken com process.env.JWT_SECRET.
 * 4. Em caso de sucesso:
 *    - Injetar o id do usuário no objeto da requisição: req.usuarioId = payload.sub (ou payload.id).
 *    - Chamar next() para prosseguir para a rota protegida.
 * 5. Em caso de token inválido, adulterado ou expirado:
 *    - Capturar a exceção e retornar status 401 com { erro: 'Token inválido ou expirado.' }.
 * 
 * IMPORTANTE (Requisito RF3 - Isolamento):
 * - O req.usuarioId injetado aqui é a ÚNICA fonte confiável para saber qual usuário está
 *   fazendo a requisição. Nenhuma rota pode confiar em usuario_id vindo no req.body ou req.params.
 */
