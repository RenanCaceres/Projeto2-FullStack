/**
 * Camada de acesso ao banco para Categorias (RF4).
 * Todas as consultas são parametrizadas e filtradas por usuario_id (isolamento).
 */

import { query } from '../config/db.js';

const CATEGORIAS_PADRAO = [
  { tipo: 'entrada', nome: 'Salário' },
  { tipo: 'entrada', nome: 'Rendimentos' },
  { tipo: 'entrada', nome: 'Freelance' },
  { tipo: 'entrada', nome: 'Outros' },
  { tipo: 'saida', nome: 'Moradia' },
  { tipo: 'saida', nome: 'Alimentação' },
  { tipo: 'saida', nome: 'Mobilidade' },
  { tipo: 'saida', nome: 'Lazer' },
  { tipo: 'saida', nome: 'Saúde' },
  { tipo: 'saida', nome: 'Educação' },
];

export async function listarPorUsuario(usuarioId) {
  const { rows } = await query(
    `SELECT id, nome, tipo
       FROM categorias
      WHERE usuario_id = $1
      ORDER BY tipo, nome`,
    [usuarioId]
  );
  return rows;
}

export async function buscarPorId(id, usuarioId) {
  const { rows } = await query(
    `SELECT id, nome, tipo
       FROM categorias
      WHERE id = $1 AND usuario_id = $2`,
    [id, usuarioId]
  );
  return rows[0] ?? null;
}

// Violação de UNIQUE (usuario_id, tipo, nome) sobe como erro 23505 do PostgreSQL.
export async function criar({ usuarioId, nome, tipo }) {
  const { rows } = await query(
    `INSERT INTO categorias (usuario_id, nome, tipo)
     VALUES ($1, $2, $3)
     RETURNING id, nome, tipo`,
    [usuarioId, String(nome).trim(), tipo]
  );
  return rows[0];
}

// Insere o kit inicial logo após o cadastro; ignora nomes já existentes.
export async function criarPadrao(usuarioId) {
  const nomes = CATEGORIAS_PADRAO.map((c) => c.nome);
  const tipos = CATEGORIAS_PADRAO.map((c) => c.tipo);
  await query(
    `INSERT INTO categorias (usuario_id, nome, tipo)
     SELECT $1, nome, tipo FROM UNNEST($2::text[], $3::text[]) AS t(nome, tipo)
     ON CONFLICT (usuario_id, tipo, nome) DO NOTHING`,
    [usuarioId, nomes, tipos]
  );
}

// Retorna null se a categoria não existir (ou não for do usuário).
export async function atualizar(id, usuarioId, { nome, tipo }) {
  const { rows } = await query(
    `UPDATE categorias
        SET nome = $3, tipo = $4
      WHERE id = $1 AND usuario_id = $2
      RETURNING id, nome, tipo`,
    [id, usuarioId, String(nome).trim(), tipo]
  );
  return rows[0] ?? null;
}

export async function contarLancamentos(id, usuarioId) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS total
       FROM lancamentos
      WHERE categoria_id = $1 AND usuario_id = $2`,
    [id, usuarioId]
  );
  return rows[0].total;
}

// Lança erro 409 se houver lançamentos vinculados; retorna false se não existir.
export async function excluir(id, usuarioId) {
  const categoria = await buscarPorId(id, usuarioId);
  if (!categoria) return false;

  const total = await contarLancamentos(id, usuarioId);
  if (total > 0) {
    const erro = new Error(
      `Esta categoria não pode ser excluída: existem ${total} lançamento(s) vinculado(s) a ela.`
    );
    erro.status = 409;
    throw erro;
  }

  await query('DELETE FROM categorias WHERE id = $1 AND usuario_id = $2', [id, usuarioId]);
  return true;
}

export default {
  listarPorUsuario,
  buscarPorId,
  criar,
  criarPadrao,
  atualizar,
  contarLancamentos,
  excluir,
};
