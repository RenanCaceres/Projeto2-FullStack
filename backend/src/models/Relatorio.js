/**
 * ============================================================================
 * ARQUIVO: src/models/Relatorio.js
 * RESPONSABILIDADE: Regras de negócio, agregações e cálculo de relatórios (RF7, RF8, RF9, Saúde).
 * ============================================================================
 */

import { pool } from '../config/db.js';

export const Relatorio = {
  /**
   * RF7: Relatório consolidado por Categoria com comparativo percentual.
   */
  async relatorioPorCategoria(usuarioId, inicio, fim) {
    const condicoes = ['l.usuario_id = $1'];
    const valores = [usuarioId];
    let contador = 2;

    if (inicio) {
      condicoes.push(`l.data >= $${contador++}`);
      valores.push(inicio);
    }
    if (fim) {
      condicoes.push(`l.data <= $${contador++}`);
      valores.push(fim);
    }

    const sql = `
      SELECT
        c.id AS categoria_id,
        c.nome AS categoria_nome,
        c.tipo AS categoria_tipo,
        COALESCE(SUM(l.valor), 0) AS total,
        COUNT(l.id) AS quantidade
      FROM categorias c
      LEFT JOIN lancamentos l ON l.categoria_id = c.id AND ${condicoes.join(' AND ')}
      WHERE c.usuario_id = $1
      GROUP BY c.id, c.nome, c.tipo
      HAVING COALESCE(SUM(l.valor), 0) > 0
      ORDER BY total DESC
    `;

    const result = await pool.query(sql, valores);
    const categorias = result.rows.map((row) => ({
      ...row,
      total: Number(row.total),
      quantidade: Number(row.quantidade),
    }));

    const totalGeral = categorias.reduce((acc, cur) => acc + cur.total, 0);

    const categoriasComPercentual = categorias.map((cat) => ({
      ...cat,
      percentual: totalGeral > 0 ? Number(((cat.total / totalGeral) * 100).toFixed(1)) : 0,
    }));

    return {
      totalGeral,
      categorias: categoriasComPercentual,
    };
  },

  /**
   * RF8: Relatório agrupado por Fonte e Destino (entradas, saídas e saldos).
   */
  async relatorioPorFonteDestino(usuarioId, inicio, fim) {
    const condicoes = ['l.usuario_id = $1'];
    const valores = [usuarioId];
    let contador = 2;

    if (inicio) {
      condicoes.push(`l.data >= $${contador++}`);
      valores.push(inicio);
    }
    if (fim) {
      condicoes.push(`l.data <= $${contador++}`);
      valores.push(fim);
    }

    const sql = `
      SELECT
        f.id AS fonte_id,
        f.nome AS fonte_nome,
        f.tipo AS fonte_tipo,
        f.limite,
        COALESCE(SUM(CASE WHEN l.tipo = 'entrada' THEN l.valor ELSE 0 END), 0) AS total_entradas,
        COALESCE(SUM(CASE WHEN l.tipo = 'saida' THEN l.valor ELSE 0 END), 0) AS total_saidas
      FROM fontes_destinos f
      LEFT JOIN lancamentos l ON l.fonte_destino_id = f.id AND ${condicoes.join(' AND ')}
      WHERE f.usuario_id = $1
      GROUP BY f.id, f.nome, f.tipo, f.limite
      ORDER BY f.tipo, f.nome
    `;

    const result = await pool.query(sql, valores);
    return result.rows.map((row) => {
      const entradas = Number(row.total_entradas);
      const saidas = Number(row.total_saidas);
      return {
        id: row.fonte_id,
        nome: row.fonte_nome,
        tipo: row.fonte_tipo,
        limite: row.limite ? Number(row.limite) : null,
        entradas,
        saidas,
        saldo: Number((entradas - saidas).toFixed(2)),
      };
    });
  },

  /**
   * RF9: Previsão e histórico de Faturas de Cartão de Crédito.
   * Aplica a regra estrita de fechamento (compras no dia do fechamento ou posterior caem na fatura do mês seguinte).
   */
  async previsaoFaturasCartao(usuarioId, quantidadeMeses = 4) {
    // 1. Busca todos os cartões de crédito do usuário
    const cartoesRes = await pool.query(
      `SELECT id, nome, dia_fechamento, dia_vencimento, limite
       FROM fontes_destinos
       WHERE usuario_id = $1 AND tipo = 'cartao_credito'
       ORDER BY nome ASC`,
      [usuarioId]
    );

    const cartoes = cartoesRes.rows;
    if (cartoes.length === 0) return [];

    const resultado = [];

    for (const cartao of cartoes) {
      // 2. Busca todas as compras deste cartão
      const comprasRes = await pool.query(
        `SELECT id, descricao, valor, TO_CHAR(data, 'YYYY-MM-DD') AS data, parcela_atual, total_parcelas
         FROM lancamentos
         WHERE fonte_destino_id = $1 AND tipo = 'saida'
         ORDER BY data ASC`,
        [cartao.id]
      );

      const compras = comprasRes.rows;
      const faturasPorMes = {};
      let totalComprometido = 0;

      for (const compra of compras) {
        const val = Number(compra.valor);
        totalComprometido += val;

        const [anoStr, mesStr, diaStr] = compra.data.split('-');
        let anoCompra = Number(anoStr);
        let mesCompra = Number(mesStr); // 1-12
        const diaCompra = Number(diaStr);

        // Regra do livro: se diaCompra >= dia_fechamento, fatura avança para o mês seguinte
        if (diaCompra >= cartao.dia_fechamento) {
          mesCompra += 1;
          if (mesCompra > 12) {
            mesCompra = 1;
            anoCompra += 1;
          }
        }

        const chaveFatura = `${anoCompra}-${String(mesCompra).padStart(2, '0')}`;

        if (!faturasPorMes[chaveFatura]) {
          faturasPorMes[chaveFatura] = {
            ano: anoCompra,
            mes: mesCompra,
            chave: chaveFatura,
            diaFechamento: cartao.dia_fechamento,
            diaVencimento: cartao.dia_vencimento,
            valorTotal: 0,
            itens: [],
          };
        }

        faturasPorMes[chaveFatura].valorTotal += val;
        faturasPorMes[chaveFatura].itens.push({
          id: compra.id,
          descricao: compra.descricao,
          valor: val,
          data: compra.data,
          parcelaAtual: compra.parcela_atual,
          totalParcelas: compra.total_parcelas,
        });
      }

      const listaFaturas = Object.values(faturasPorMes).map((f) => ({
        ...f,
        valorTotal: Number(f.valorTotal.toFixed(2)),
      })).sort((a, b) => a.chave.localeCompare(b.chave));

      const limiteTotal = Number(cartao.limite) || 0;
      const limiteDisponivel = Math.max(0, Number((limiteTotal - totalComprometido).toFixed(2)));

      resultado.push({
        cartaoId: cartao.id,
        nomeCartao: cartao.nome,
        limiteTotal,
        limiteComprometido: Number(totalComprometido.toFixed(2)),
        limiteDisponivel,
        faturas: listaFaturas,
      });
    }

    return resultado;
  },

  /**
   * Desafio Extra (+10 pts): Cálculo de Indicadores de Saúde Financeira e Score.
   */
  async calcularSaudeFinanceira(usuarioId) {
    const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS total_entradas,
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS total_saidas,
        COALESCE(SUM(CASE WHEN tipo = 'saida' AND total_parcelas > 1 THEN valor ELSE 0 END), 0) AS total_parcelado
      FROM lancamentos
      WHERE usuario_id = $1
    `;

    const res = await pool.query(sql, [usuarioId]);
    const entradas = Number(res.rows[0].total_entradas);
    const saidas = Number(res.rows[0].total_saidas);
    const parcelado = Number(res.rows[0].total_parcelado);

    const saldo = Number((entradas - saidas).toFixed(2));
    const taxaPoupanca = entradas > 0 ? Number((((entradas - saidas) / entradas) * 100).toFixed(1)) : 0;
    const comprometimentoParcelado = entradas > 0 ? Number(((parcelado / entradas) * 100).toFixed(1)) : 0;

    // Cálculo do Score (0 a 100)
    let score = 50; // Base neutra

    if (taxaPoupanca >= 20) score += 30;
    else if (taxaPoupanca > 0) score += 15;
    else score -= 25;

    if (comprometimentoParcelado <= 25) score += 20;
    else if (comprometimentoParcelado > 40) score -= 20;

    score = Math.max(0, Math.min(100, Math.round(score)));

    // Diagnósticos e Recomendações
    const dicas = [];
    if (taxaPoupanca >= 20) {
      dicas.push('Excelente taxa de poupança! Você está guardando mais de 20% do que ganha.');
    } else if (taxaPoupanca > 0) {
      dicas.push('Você está no positivo, mas tente elevar sua taxa de poupança para ao menos 20% de sua renda.');
    } else {
      dicas.push('Alerta: Seus gastos superaram suas receitas. Revise categorias supérfluas para evitar endividamento.');
    }

    if (comprometimentoParcelado > 30) {
      dicas.push(`Atenção: ${comprometimentoParcelado}% da sua renda está comprometida com parcelamentos futuros no cartão.`);
    } else {
      dicas.push('Seu comprometimento com parcelamentos de cartão de crédito está sob controle.');
    }

    return {
      score,
      classificacao: score >= 80 ? 'Excelente' : score >= 60 ? 'Boa' : score >= 40 ? 'Regular' : 'Crítica',
      entradas,
      saidas,
      saldo,
      taxaPoupanca,
      comprometimentoParcelado,
      dicas,
    };
  },
};

export default Relatorio;
