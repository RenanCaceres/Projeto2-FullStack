/**
 * ============================================================================
 * ARQUIVO: src/middlewares/autenticar.js
 * RESPONSABILIDADE: Middleware de interceptação e autenticação via Token JWT (RF2 e RF3).
 * ============================================================================
 */

import { verificarToken } from '../config/jwt.js';

/**
 * Middleware que intercepta as requisições para proteger rotas privadas.
 * 
 * 1. Lê o cabeçalho "Authorization".
 * 2. Valida o esquema "Bearer <token>".
 * 3. Valida a assinatura e a data de expiração do JWT.
 * 4. Injeta o `req.usuarioId` para garantir o isolamento dos dados (RF3).
 */
export function autenticar(req, res, next) {
  // 1. Extrai o cabeçalho Authorization da requisição HTTP
  const authHeader = req.headers.authorization;

  // 2. Se o cabeçalho não foi enviado, bloqueia com 401 Unauthorized
  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não informado.' });
  }

  // Divide a string "Bearer <token>" em duas partes: esquema e token
  const [esquema, token] = authHeader.split(' ');

  // Se o esquema não for "Bearer" ou o token estiver vazio
  if (esquema !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token não informado.' });
  }

  try {
    // 3. Valida se o token foi assinado pelo nosso sistema e se não expirou
    const payload = verificarToken(token);

    // 4. Injeta o ID do usuário verificado no objeto req
    // IMPORTANTE (RF3 - Isolamento): Esta é a ÚNICA fonte segura de identificação do usuário!
    req.usuarioId = payload.sub || payload.id;
    req.usuario = payload; // Guarda dados úteis como nome e email

    // Chama o próximo middleware ou controlador da rota
    return next();
  } catch (error) {
    // 5. Se o token for falso, adulterado ou estiver vencido, rejeita com 401
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

export default autenticar;
