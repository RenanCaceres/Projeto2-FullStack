/**
 * Rotas do CRUD de Categorias (RF4).
 * O usuário vem sempre de req.usuarioId (injetado pelo middleware autenticar).
 */

import express from 'express';
import Categoria from '../models/Categoria.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = express.Router();
router.use(autenticar);

const TIPOS = ['entrada', 'saida'];

function validarCategoria(body) {
  const campos = {};
  const nome = String(body?.nome ?? '').trim();
  const tipo = body?.tipo;

  if (!nome) campos.nome = 'Nome é obrigatório.';
  else if (nome.length > 50) campos.nome = 'Nome deve ter no máximo 50 caracteres.';
  if (!TIPOS.includes(tipo)) campos.tipo = "Tipo deve ser 'entrada' ou 'saida'.";

  return { campos, dados: { nome, tipo } };
}

function erroDuplicado(res) {
  return res.status(409).json({
    erro: 'Registro já existente.',
    campos: { nome: 'Já existe uma categoria com este nome para este tipo.' },
  });
}

function lerId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ erro: 'Identificador inválido.' });
    return null;
  }
  return id;
}

router.get('/', async (req, res, next) => {
  try {
    const categorias = await Categoria.listarPorUsuario(req.usuarioId);
    return res.status(200).json({ categorias });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { campos, dados } = validarCategoria(req.body);
    if (Object.keys(campos).length > 0) {
      return res.status(400).json({ erro: 'Dados inválidos.', campos });
    }

    const categoria = await Categoria.criar({ usuarioId: req.usuarioId, ...dados });
    return res.status(201).json({ categoria });
  } catch (error) {
    if (error.code === '23505') return erroDuplicado(res);
    return next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = lerId(req, res);
    if (id === null) return undefined;

    const { campos, dados } = validarCategoria(req.body);
    if (Object.keys(campos).length > 0) {
      return res.status(400).json({ erro: 'Dados inválidos.', campos });
    }

    const categoria = await Categoria.atualizar(id, req.usuarioId, dados);
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada.' });

    return res.status(200).json({ categoria });
  } catch (error) {
    if (error.code === '23505') return erroDuplicado(res);
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = lerId(req, res);
    if (id === null) return undefined;

    const excluida = await Categoria.excluir(id, req.usuarioId);
    if (!excluida) return res.status(404).json({ erro: 'Categoria não encontrada.' });

    return res.status(204).send();
  } catch (error) {
    if (error.status === 409) return res.status(409).json({ erro: error.message });
    // FK de lancamentos.categoria_id (corrida entre a contagem e o DELETE)
    if (error.code === '23503') {
      return res.status(409).json({
        erro: 'Esta categoria não pode ser excluída: existem lançamentos vinculados a ela.',
      });
    }
    return next(error);
  }
});

export default router;
