/**
 * Camada de acesso ao banco para Usuários.
 * Todas as consultas são parametrizadas.
 */

import { query } from '../config/db.js';

const normalizarEmail = (email) => String(email ?? '').trim().toLowerCase();
const normalizarCpf = (cpf) => String(cpf ?? '').replace(/\D/g, '');

export async function criar({ nome, email, cpf, senhaHash }) {
  const { rows } = await query(
    `INSERT INTO usuarios (nome, email, cpf, senha_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, cpf`,
    [String(nome).trim(), normalizarEmail(email), normalizarCpf(cpf), senhaHash]
  );
  return rows[0];
}

// Retorna senha_hash porque é usado no fluxo de login.
export async function buscarPorEmail(email) {
  const { rows } = await query(
    `SELECT id, nome, email, cpf, senha_hash
       FROM usuarios
      WHERE LOWER(email) = LOWER($1)`,
    [normalizarEmail(email)]
  );
  return rows[0] ?? null;
}

// Nunca retorna senha_hash.
export async function buscarPorId(id) {
  const { rows } = await query(
    `SELECT id, nome, email, cpf
       FROM usuarios
      WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

// Checagem prévia; a garantia final é a constraint UNIQUE do banco.
export async function verificarDuplicidade(email, cpf) {
  const { rows } = await query(
    `SELECT
        BOOL_OR(LOWER(email) = LOWER($1)) AS email_existe,
        BOOL_OR(cpf = $2)                 AS cpf_existe
       FROM usuarios
      WHERE LOWER(email) = LOWER($1) OR cpf = $2`,
    [normalizarEmail(email), normalizarCpf(cpf)]
  );
  return {
    email: Boolean(rows[0]?.email_existe),
    cpf: Boolean(rows[0]?.cpf_existe),
  };
}

export default { criar, buscarPorEmail, buscarPorId, verificarDuplicidade };
