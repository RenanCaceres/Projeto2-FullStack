/**
 * ============================================================================
 * ARQUIVO: src/models/Lancamento.js
 * RESPONSABILIDADE: Camada de persistência para Lançamentos Financeiros (RF6).
 * ============================================================================
 */

import { pool } from '../config/db.js';
import crypto from 'crypto';

export const Lancamento = {
  /**
   * Consulta dinâmica de lançamentos com filtros opcionais e paginação (RF6).
   * Implementação Renan.
   */
  async listar(usuarioId, { dataInicio, dataFim, tipo, categoriaId, fonteDestinoId, pagina = 1, limite = 10 } = {}) {
    const page = Math.max(1, Number(pagina) || 1);
    const limit = Math.max(1, Number(limite) || 10);
    const offset = (page - 1) * limit;

    const condicoes = ['l.usuario_id = $1'];
    const valores = [usuarioId];
    let contador = 2;

    if (dataInicio) {
      condicoes.push(`l.data >= $${contador++}`);
      valores.push(dataInicio);
    }
    if (dataFim) {
      condicoes.push(`l.data <= $${contador++}`);
      valores.push(dataFim);
    }
    if (tipo) {
      condicoes.push(`l.tipo = $${contador++}`);
      valores.push(tipo);
    }
    if (categoriaId) {
      condicoes.push(`l.categoria_id = $${contador++}`);
      valores.push(categoriaId);
    }
    if (fonteDestinoId) {
      condicoes.push(`l.fonte_destino_id = $${contador++}`);
      valores.push(fonteDestinoId);
    }

    const whereClause = condicoes.join(' AND ');

    // 1. Contagem total de registros para metadados de paginação
    const countSql = `SELECT COUNT(*) FROM lancamentos l WHERE ${whereClause}`;
    const countResult = await pool.query(countSql, valores);
    const total = Number(countResult.rows[0].count);
    const totalPaginas = Math.ceil(total / limit) || 1;

    // 2. Busca paginada com JOINs informativos (nome da categoria e nome da conta)
    const dataSql = `
      SELECT 
        l.id,
        l.usuario_id,
        l.tipo,
        l.descricao,
        l.valor,
        TO_CHAR(l.data, 'YYYY-MM-DD') AS data,
        l.categoria_id,
        c.nome AS categoria_nome,
        l.fonte_destino_id,
        f.nome AS fonte_destino_nome,
        f.tipo AS fonte_destino_tipo,
        l.parcela_atual,
        l.total_parcelas,
        l.grupo_parcelamento,
        l.criado_em
      FROM lancamentos l
      JOIN categorias c ON c.id = l.categoria_id
      JOIN fontes_destinos f ON f.id = l.fonte_destino_id
      WHERE ${whereClause}
      ORDER BY l.data DESC, l.id DESC
      LIMIT $${contador++} OFFSET $${contador++}
    `;

    const dataResult = await pool.query(dataSql, [...valores, limit, offset]);

    return {
      lancamentos: dataResult.rows,
      paginacao: {
        pagina: page,
        limite: limit,
        totalRegistros: total,
        totalPaginas,
      },
    };
  },

  /**
   * Agregação rápida de totais (entradas, saídas e saldo) do período.
   */
  async obterTotaisPeriodo(usuarioId, dataInicio, dataFim) {
    const condicoes = ['usuario_id = $1'];
    const valores = [usuarioId];
    let contador = 2;

    if (dataInicio) {
      condicoes.push(`data >= $${contador++}`);
      valores.push(dataInicio);
    }
    if (dataFim) {
      condicoes.push(`data <= $${contador++}`);
      valores.push(dataFim);
    }

    const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS total_entradas,
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS total_saidas
      FROM lancamentos
      WHERE ${condicoes.join(' AND ')}
    `;

    const result = await pool.query(sql, valores);
    const entradas = Number(result.rows[0].total_entradas);
    const saidas = Number(result.rows[0].total_saidas);

    return {
      totalEntradas: entradas,
      totalSaidas: saidas,
      saldo: Number((entradas - saidas).toFixed(2)),
    };
  },

  /**
   * Cria um lançamento à vista (entrada ou saída comum).
   */
  async criarSimples({ usuarioId, tipo, descricao, valor, data, categoriaId, fonteDestinoId }) {
    const result = await pool.query(
      `INSERT INTO lancamentos (
        usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id, parcela_atual, total_parcelas
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 1, 1)
      RETURNING id, usuario_id, tipo, descricao, valor, TO_CHAR(data, 'YYYY-MM-DD') AS data, categoria_id, fonte_destino_id, parcela_atual, total_parcelas`,
      [usuarioId, tipo, descricao.trim(), valor, data, categoriaId, fonteDestinoId]
    );

    return result.rows[0];
  },

  /**
   * Cria lançamento parcelado no cartão de crédito via transação SQL atômica (BEGIN ... COMMIT).
   */
  async criarParcelado({ usuarioId, descricao, valorTotal, dataCompra, categoriaId, fonteDestinoId, totalParcelas }) {
    const client = await pool.connect();
    const parcelasNum = Number(totalParcelas);
    const totalNum = Number(valorTotal);

    try {
      await client.query('BEGIN');

      const grupoParcelamento = crypto.randomUUID();

      // Divisão precisa de centavos (especificação técnica do projeto)
      const valorBase = Math.floor((totalNum * 100) / parcelasNum) / 100;
      const centavosExtras = Number((totalNum - valorBase * parcelasNum).toFixed(2));

      const parcelasCriadas = [];
      const dataBase = new Date(dataCompra + 'T12:00:00Z');

      for (let i = 1; i <= parcelasNum; i++) {
        const valorParcela = i === 1 ? Number((valorBase + centavosExtras).toFixed(2)) : valorBase;

        // Avança mês a mês preservando o dia de vencimento
        const dataParcela = new Date(dataBase);
        dataParcela.setUTCMonth(dataBase.getUTCMonth() + (i - 1));
        const dataStr = dataParcela.toISOString().split('T')[0];

        const res = await client.query(
          `INSERT INTO lancamentos (
            usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id, parcela_atual, total_parcelas, grupo_parcelamento
          )
          VALUES ($1, 'saida', $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id, parcela_atual, total_parcelas, valor, TO_CHAR(data, 'YYYY-MM-DD') AS data`,
          [
            usuarioId,
            `${descricao.trim()} (${i}/${parcelasNum})`,
            valorParcela,
            dataStr,
            categoriaId,
            fonteDestinoId,
            i,
            parcelasNum,
            grupoParcelamento,
          ]
        );

        parcelasCriadas.push(res.rows[0]);
      }

      await client.query('COMMIT');
      return { grupoParcelamento, parcelas: parcelasCriadas };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Busca um lançamento pelo ID validando posse do usuário.
   */
  async buscarPorId(id, usuarioId) {
    const result = await pool.query(
      `SELECT l.*, TO_CHAR(l.data, 'YYYY-MM-DD') AS data, c.nome AS categoria_nome, f.nome AS fonte_destino_nome
       FROM lancamentos l
       JOIN categorias c ON c.id = l.categoria_id
       JOIN fontes_destinos f ON f.id = l.fonte_destino_id
       WHERE l.id = $1 AND l.usuario_id = $2`,
      [id, usuarioId]
    );
    return result.rows[0];
  },

  /**
   * Atualiza um lançamento existente.
   */
  async atualizar(id, usuarioId, { descricao, valor, data, categoriaId, fonteDestinoId }) {
    const result = await pool.query(
      `UPDATE lancamentos
       SET descricao = COALESCE($3, descricao),
           valor = COALESCE($4, valor),
           data = COALESCE($5, data),
           categoria_id = COALESCE($6, categoria_id),
           fonte_destino_id = COALESCE($7, fonte_destino_id)
       WHERE id = $1 AND usuario_id = $2
       RETURNING id, tipo, descricao, valor, TO_CHAR(data, 'YYYY-MM-DD') AS data, categoria_id, fonte_destino_id`,
      [id, usuarioId, descricao ? descricao.trim() : null, valor, data, categoriaId, fonteDestinoId]
    );
    return result.rows[0];
  },

  /**
   * Exclui um lançamento individual ou todas as parcelas do grupo.
   */
  async excluir(id, usuarioId, todasParcelas = false) {
    const lancamento = await this.buscarPorId(id, usuarioId);
    if (!lancamento) return false;

    if (todasParcelas && lancamento.grupo_parcelamento) {
      const res = await pool.query(
        'DELETE FROM lancamentos WHERE grupo_parcelamento = $1 AND usuario_id = $2',
        [lancamento.grupo_parcelamento, usuarioId]
      );
      return res.rowCount > 0;
    }

    const res = await pool.query(
      'DELETE FROM lancamentos WHERE id = $1 AND usuario_id = $2',
      [id, usuarioId]
    );
    return res.rowCount > 0;
  },
};

export default Lancamento;
