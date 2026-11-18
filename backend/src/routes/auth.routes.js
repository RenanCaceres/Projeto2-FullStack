/**
 * Rotas de autenticação e usuários (RF1 e RF2).
 * Integrado: Pedro Larini (Cadastro / Validação / Categorias Padrão) & Renan Cáceres (Login / JWT / Perfil Me)
 */

import express from 'express';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import Usuario from '../models/Usuario.js';
import Categoria from '../models/Categoria.js';
import { validarCadastro } from '../middlewares/validar.js';
import { pool } from '../config/db.js';
import { gerarToken } from '../config/jwt.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = express.Router();

// ==========================================
// PARTE DO PEDRO: RF1 - Cadastro de Usuário
// ==========================================
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

// ==========================================
// PARTE DO RENAN: RF2 - Autenticação JWT
// ==========================================
// Limitador de tentativas de login por segurança (requisito do livro)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                  // Máximo de 10 tentativas por IP
  message: { erro: 'Muitas tentativas de login. Tente novamente após 15 minutos.' },
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Valida se o usuário preencheu e-mail e senha
    if (!email || !senha) {
      return res.status(400).json({ erro: 'e-mail e senha são obrigatório, por favor preencha.' });
    }

    // LOWER para case-insensitive e trim para espaços extras
    const result = await pool.query(
      'SELECT id, nome, email, senha_hash FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    const usuario = result.rows[0];

    // Se o usuário não existir no banco
    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    // Compara a senha digitada com a senha_hash criptografada
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    // Gera o token JWT
    const token = gerarToken(usuario);

    // Retorna o token e os dados públicos
    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', autenticar, async (req, res, next) => {
  try {
    // req.usuarioId injetado pelo middleware autenticar
    const result = await pool.query(
      'SELECT id, nome, email, cpf, criado_em FROM usuarios WHERE id = $1',
      [req.usuarioId]
    );

    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ usuario });
  } catch (error) {
    return next(error);
  }
});

export default router;
