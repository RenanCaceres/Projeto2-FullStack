/**
 * Rotas de autenticação e usuários (RF1 e RF2).
 */

import express from 'express';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import Categoria from '../models/Categoria.js';
import { validarCadastro } from '../middlewares/validar.js';

const router = express.Router();

// Parte do @Pedro
router.post('/cadastro', validarCadastro, async (req, res, next) => {
  try {
    const { nome, email, cpf, senha } = req.body;

    const existe = await Usuario.verificarDuplicidade(email, cpf);
    if (existe.email || existe.cpf) {
      const campos = {};
      if (existe.email) campos.email = 'Já existe um usuário com este e-mail.';
      if (existe.cpf) campos.cpf = 'Já existe um usuário com este CPF.';
      return res.status(409).json({ erro: 'Registro já existente.', campos });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.criar({ nome, email, cpf, senhaHash });
    await Categoria.criarPadrao(usuario.id);

    return res.status(201).json({ usuario });
  } catch (error) {
    // Corrida entre a checagem e o INSERT: a constraint UNIQUE do banco decide.
    if (error.code === '23505') {
      const campos = /cpf/i.test(error.constraint ?? error.detail ?? '')
        ? { cpf: 'Já existe um usuário com este CPF.' }
        : { email: 'Já existe um usuário com este e-mail.' };
      return res.status(409).json({ erro: 'Registro já existente.', campos });
    }
    return next(error);
  }
});

// Parte do @Renan

export default router;
