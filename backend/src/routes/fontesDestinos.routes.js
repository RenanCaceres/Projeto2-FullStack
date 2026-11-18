/**
 * ============================================================================
 * ARQUIVO: src/routes/fontesDestinos.routes.js
 * RESPONSABILIDADE: Rotas e controladores para CRUD de Fontes e Destinos (RF5).
 * ============================================================================
 */

import express from 'express';
import { FonteDestino } from '../models/FonteDestino.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = express.Router();

// Aplica middleware de autenticação JWT em todas as rotas
router.use(autenticar);

/**
 * GET /api/fontes-destinos
 * Retorna todas as fontes e destinos do usuário autenticado.
 */
router.get('/', async (req, res, next) => {
  try {
    const fontes = await FonteDestino.listarPorUsuario(req.usuarioId);
    return res.status(200).json(fontes);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/fontes-destinos
 * Cadastra uma nova conta bancária, carteira, renda ou cartão de crédito.
 */
router.post('/', async (req, res, next) => {
  try {
    const { nome, tipo, diaFechamento, diaVencimento, limite } = req.body;

    if (!nome || !tipo) {
      return res.status(400).json({ erro: 'Nome e tipo são obrigatórios.' });
    }

    const tiposValidos = ['renda', 'conta', 'cartao_credito'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        erro: 'Tipo inválido. Os tipos aceitos são: renda, conta ou cartao_credito.',
      });
    }

    // Validações obrigatórias para cartão de crédito (RF5)
    if (tipo === 'cartao_credito') {
      const fechamento = Number(diaFechamento);
      const vencimento = Number(diaVencimento);
      const limiteNum = Number(limite);

      if (!fechamento || fechamento < 1 || fechamento > 31) {
        return res.status(400).json({
          erro: 'O dia de fechamento é obrigatório para cartão de crédito e deve estar entre 1 e 31.',
        });
      }

      if (!vencimento || vencimento < 1 || vencimento > 31) {
        return res.status(400).json({
          erro: 'O dia de vencimento é obrigatório para cartão de crédito e deve estar entre 1 e 31.',
        });
      }

      if (limite === undefined || isNaN(limiteNum) || limiteNum < 0) {
        return res.status(400).json({
          erro: 'O limite do cartão é obrigatório e deve ser um valor maior ou igual a zero.',
        });
      }
    }

    const novaFonte = await FonteDestino.criar({
      usuarioId: req.usuarioId,
      nome,
      tipo,
      diaFechamento: tipo === 'cartao_credito' ? Number(diaFechamento) : null,
      diaVencimento: tipo === 'cartao_credito' ? Number(diaVencimento) : null,
      limite: tipo === 'cartao_credito' ? Number(limite) : null,
    });

    return res.status(201).json(novaFonte);
  } catch (error) {
    return next(error);
  }
});

/**
 * PUT /api/fontes-destinos/:id
 * Atualiza dados de uma fonte/destino existente.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, diaFechamento, diaVencimento, limite } = req.body;

    const registroExistente = await FonteDestino.buscarPorId(id, req.usuarioId);
    if (!registroExistente) {
      return res.status(404).json({ erro: 'Conta ou cartão não encontrado.' });
    }

    if (registroExistente.tipo === 'cartao_credito') {
      if (diaFechamento && (Number(diaFechamento) < 1 || Number(diaFechamento) > 31)) {
        return res.status(400).json({ erro: 'O dia de fechamento deve estar entre 1 e 31.' });
      }
      if (diaVencimento && (Number(diaVencimento) < 1 || Number(diaVencimento) > 31)) {
        return res.status(400).json({ erro: 'O dia de vencimento deve estar entre 1 e 31.' });
      }
      if (limite !== undefined && Number(limite) < 0) {
        return res.status(400).json({ erro: 'O limite não pode ser negativo.' });
      }
    }

    const registroAtualizado = await FonteDestino.atualizar(id, req.usuarioId, {
      nome,
      diaFechamento: registroExistente.tipo === 'cartao_credito' ? Number(diaFechamento ?? registroExistente.dia_fechamento) : null,
      diaVencimento: registroExistente.tipo === 'cartao_credito' ? Number(diaVencimento ?? registroExistente.dia_vencimento) : null,
      limite: registroExistente.tipo === 'cartao_credito' ? Number(limite ?? registroExistente.limite) : null,
    });

    return res.status(200).json(registroAtualizado);
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/fontes-destinos/:id
 * Remove uma fonte/destino caso não possua movimentações vinculadas.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const registroExistente = await FonteDestino.buscarPorId(id, req.usuarioId);
    if (!registroExistente) {
      return res.status(404).json({ erro: 'Conta ou cartão não encontrado.' });
    }

    await FonteDestino.excluir(id, req.usuarioId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
