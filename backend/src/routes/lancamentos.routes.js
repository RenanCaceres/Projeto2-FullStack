/**
 * ============================================================================
 * ARQUIVO: src/routes/lancamentos.routes.js
 * RESPONSABILIDADE: Rotas e controladores para CRUD de Lançamentos e Parcelamentos (RF6).
 * ============================================================================
 */

import express from 'express';
import { Lancamento } from '../models/Lancamento.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = express.Router();

router.use(autenticar);

/**
 * GET /api/lancamentos
 * Listagem paginada com filtros e totais consolidados do período (RF6).
 */
router.get('/', async (req, res, next) => {
  try {
    const { inicio, fim, dataInicio, dataFim, tipo, categoriaId, fonteDestinoId, pagina, limite } = req.query;

    const dataIni = inicio || dataInicio;
    const dataFimFiltro = fim || dataFim;

    const resultado = await Lancamento.listar(req.usuarioId, {
      dataInicio: dataIni,
      dataFim: dataFimFiltro,
      tipo,
      categoriaId,
      fonteDestinoId,
      pagina,
      limite,
    });

    const totais = await Lancamento.obterTotaisPeriodo(req.usuarioId, dataIni, dataFimFiltro);

    return res.status(200).json({
      ...resultado,
      totais,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/lancamentos/:id
 * Detalhes de um lançamento específico.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const lancamento = await Lancamento.buscarPorId(req.params.id, req.usuarioId);
    if (!lancamento) {
      return res.status(404).json({ erro: 'Lançamento não encontrado.' });
    }
    return res.status(200).json(lancamento);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/lancamentos
 * Criação de lançamento à vista ou compra parcelada (RF6).
 */
router.post('/', async (req, res, next) => {
  try {
    const { tipo, descricao, valor, data, categoriaId, fonteDestinoId, totalParcelas } = req.body;

    if (!tipo || !descricao || !valor || !data || !categoriaId || !fonteDestinoId) {
      return res.status(400).json({ erro: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    const valorNum = Number(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      return res.status(400).json({ erro: 'O valor do lançamento deve ser maior que zero.' });
    }

    const parcelas = Number(totalParcelas) || 1;

    // Se for parcelado (apenas saídas no cartão de crédito)
    if (parcelas > 1) {
      if (tipo !== 'saida') {
        return res.status(400).json({ erro: 'Apenas despesas de saída podem ser parceladas.' });
      }

      const resultadoParcelamento = await Lancamento.criarParcelado({
        usuarioId: req.usuarioId,
        descricao,
        valorTotal: valorNum,
        dataCompra: data,
        categoriaId,
        fonteDestinoId,
        totalParcelas: parcelas,
      });

      return res.status(201).json(resultadoParcelamento);
    }

    // Lançamento à vista comum
    const novoLancamento = await Lancamento.criarSimples({
      usuarioId: req.usuarioId,
      tipo,
      descricao,
      valor: valorNum,
      data,
      categoriaId,
      fonteDestinoId,
    });

    return res.status(201).json(novoLancamento);
  } catch (error) {
    return next(error);
  }
});

/**
 * PUT /api/lancamentos/:id
 * Atualização de lançamento existente.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { descricao, valor, data, categoriaId, fonteDestinoId } = req.body;

    const lancamentoExistente = await Lancamento.buscarPorId(id, req.usuarioId);
    if (!lancamentoExistente) {
      return res.status(404).json({ erro: 'Lançamento não encontrado.' });
    }

    const atualizado = await Lancamento.atualizar(id, req.usuarioId, {
      descricao,
      valor: valor ? Number(valor) : undefined,
      data,
      categoriaId,
      fonteDestinoId,
    });

    return res.status(200).json(atualizado);
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/lancamentos/:id
 * Exclusão individual ou em lote (?todasParcelas=true).
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const todasParcelas = req.query.todasParcelas === 'true';

    const sucesso = await Lancamento.excluir(id, req.usuarioId, todasParcelas);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Lançamento não encontrado.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
