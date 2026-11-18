/**
 * ============================================================================
 * ARQUIVO: src/routes/saudeFinanceira.routes.js
 * RESPONSABILIDADE: Rota e controlador para o Desafio de Saúde Financeira (+10 pontos).
 * ============================================================================
 */

import express from 'express';
import { Relatorio } from '../models/Relatorio.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = express.Router();

router.use(autenticar);

/**
 * GET /api/saude-financeira
 * Retorna o diagnóstico completo de saúde financeira, score 0-100 e recomendações.
 */
router.get('/', async (req, res, next) => {
  try {
    const diagnostico = await Relatorio.calcularSaudeFinanceira(req.usuarioId);
    return res.status(200).json(diagnostico);
  } catch (error) {
    return next(error);
  }
});

export default router;
