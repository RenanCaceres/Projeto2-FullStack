/**
 * ============================================================================
 * ARQUIVO: src/models/FonteDestino.js
 * RESPONSABILIDADE: Camada de persistência para Fontes e Destinos (RF5).
 * ============================================================================
 */

import { pool } from '../config/db.js';

export const FonteDestino = {
  /**
   * Lista todas as fontes e destinos do usuário autenticado.
   */
  async listarPorUsuario(usuarioId) {
    const result = await pool.query(
      `SELECT id, nome, tipo, dia_fechamento, dia_vencimento, limite
       FROM fontes_destinos
       WHERE usuario_id = $1
       ORDER BY tipo ASC, nome ASC`,
      [usuarioId]
    );
    return result.rows;
  },

  /**
   * Busca uma fonte/destino específica por ID garantindo a posse do usuário (RF3).
   */
  async buscarPorId(id, usuarioId) {
    const result = await pool.query(
      `SELECT id, nome, tipo, dia_fechamento, dia_vencimento, limite
       FROM fontes_destinos
       WHERE id = $1 AND usuario_id = $2`,
      [id, usuarioId]
    );
    return result.rows[0];
  },

  /**
   * Cria uma nova fonte ou destino validando regras de cartão de crédito.
   */
  async criar({ usuarioId, nome, tipo, diaFechamento, diaVencimento, limite }) {
    const result = await pool.query(
      `INSERT INTO fontes_destinos (usuario_id, nome, tipo, dia_fechamento, dia_vencimento, limite)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, tipo, dia_fechamento, dia_vencimento, limite`,
      [
        usuarioId,
        nome.trim(),
        tipo,
        tipo === 'cartao_credito' ? diaFechamento : null,
        tipo === 'cartao_credito' ? diaVencimento : null,
        tipo === 'cartao_credito' ? limite : null,
      ]
    );
    return result.rows[0];
  },

  /**
   * Cria conta padrão inicial para um usuário recém-registrado.
   */
  async criarPadrao(usuarioId) {
    return this.criar({
      usuarioId,
      nome: 'Conta Corrente Padrão',
      tipo: 'conta',
    });
  },

  /**
   * Atualiza dados de uma fonte/destino existente pertencente ao usuário.
   */
  async atualizar(id, usuarioId, { nome, diaFechamento, diaVencimento, limite }) {
    const result = await pool.query(
      `UPDATE fontes_destinos
       SET nome = COALESCE($3, nome),
           dia_fechamento = $4,
           dia_vencimento = $5,
           limite = $6
       WHERE id = $1 AND usuario_id = $2
       RETURNING id, nome, tipo, dia_fechamento, dia_vencimento, limite`,
      [id, usuarioId, nome ? nome.trim() : null, diaFechamento, diaVencimento, limite]
    );
    return result.rows[0];
  },

  /**
   * Remove uma fonte/destino se não houver vínculos na tabela de lançamentos.
   */
  async excluir(id, usuarioId) {
    // 1. Checagem prévia de lançamentos vinculados para feedback claro
    const vinculos = await pool.query(
      'SELECT id FROM lancamentos WHERE fonte_destino_id = $1 LIMIT 1',
      [id]
    );

    if (vinculos.rows.length > 0) {
      const error = new Error('Não é possível excluir esta conta ou cartão pois existem lançamentos vinculados a ela.');
      error.status = 409;
      error.code = '23503';
      throw error;
    }

    const result = await pool.query(
      'DELETE FROM fontes_destinos WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [id, usuarioId]
    );
    return result.rowCount > 0;
  },
};

export default FonteDestino;
