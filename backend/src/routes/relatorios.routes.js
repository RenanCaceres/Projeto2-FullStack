/**
 * ============================================================================
 * ARQUIVO: src/routes/relatorios.routes.js
 * RESPONSABILIDADE: Rotas e controladores para Relatórios e Faturas de Cartão (RF7, RF8 e RF9).
 * ============================================================================
 */

import express from 'express';
import { Relatorio } from '../models/Relatorio.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = express.Router();

router.use(autenticar);

/**
 * GET /api/relatorios/categorias
 * Relatório agregado por categorias (RF7).
 */
router.get('/categorias', async (req, res, next) => {
  try {
    const { inicio, fim } = req.query;
    const relatorio = await Relatorio.relatorioPorCategoria(req.usuarioId, inicio, fim);
    return res.status(200).json(relatorio);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/relatorios/fontes-destinos
 * Relatório de entradas e saídas por contas/cartões (RF8).
 */
router.get('/fontes-destinos', async (req, res, next) => {
  try {
    const { inicio, fim } = req.query;
    const relatorio = await Relatorio.relatorioPorFonteDestino(req.usuarioId, inicio, fim);
    return res.status(200).json(relatorio);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/relatorios/faturas
 * Previsão e histórico de faturas e limites de cartão (RF9).
 */
router.get('/faturas', async (req, res, next) => {
  try {
    const meses = Number(req.query.meses) || 4;
    const faturas = await Relatorio.previsaoFaturasCartao(req.usuarioId, meses);
    return res.status(200).json(faturas);
  } catch (error) {
    return next(error);
  }
});

export default router;
