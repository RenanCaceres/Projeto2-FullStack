/**
 * ============================================================================
 * ARQUIVO: src/config/jwt.js
 * RESPONSABILIDADE: Configurações e utilitários de geração/assinatura de tokens JWT.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar o pacote 'jsonwebtoken'.
 * 2. Carregar o segredo JWT_SECRET de process.env.
 * 3. Definir o tempo de expiração padrão (ex.: JWT_EXPIRES_IN = '1h' ou '8h').
 * 4. Exportar a função gerarToken(usuario):
 *    - Assinar o payload contendo apenas dados essenciais: sub (id do usuário), nome e email.
 *    - NUNCA incluir dados sensíveis (como senha_hash) no payload do token.
 * 5. Exportar a função verificarToken(token) que encapsula jwt.verify.
 */
