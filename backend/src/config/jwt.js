/**
 * ============================================================================
 * ARQUIVO: src/config/jwt.js
 * RESPONSABILIDADE: Funções utilitárias para gerar e verificar tokens JWT.
 * ============================================================================
 */

import jwt from 'jsonwebtoken';
import 'dotenv/config'; // Lê automaticamente o arquivo .env para o process.env em uma única linha

const JWT_SECRET = process.env.JWT_SECRET || 'chave_padrao_super_secreta_finanflow_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Cria (assina) um novo token JWT para o usuário que acabou de logar.
 *
 * @param {Object} usuario Objeto contendo os dados do usuário (id, nome, email)
 * @returns {string} Token JWT gerado no formato "header.payload.signature"
 */
export function gerarToken(usuario) {
  // Payload: dados públicos do usuário que vão viajar dentro do token
  // NUNCA coloque dados confidenciais aqui (como senha_hash), pois o payload pode ser lido por qualquer um
  const payload = {
    sub: usuario.id, // "sub" (Subject) é o padrão oficial do JWT para o ID do usuário
    nome: usuario.nome,
    email: usuario.email,
  };

  // Assina os dados usando a chave secreta e define o tempo de expiração
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Exporta as funções para que outros arquivos possam importá-las
export default {
  gerarToken,
  verificarToken,
};
