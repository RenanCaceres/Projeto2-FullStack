/**
 * ============================================================================
 * ARQUIVO: src/routes/auth.routes.js
 * RESPONSABILIDADE: Rotas e controladores para Autenticação e Usuários (RF1 e RF2).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Criar instância do Router do Express: const router = express.Router().
 * 2. ROTA POST /cadastro:
 *    - Middlewares: validarCadastro.
 *    - Controlador:
 *      * Gerar hash seguro da senha com bcrypt (salt de custo 10).
 *      * Criar usuário via Usuario.criar(...) normalizando email e CPF.
 *      * Criar categorias padrão e conta padrão chamando Categoria.criarPadrao() e FonteDestino.criarPadrao().
 *      * Responder status 201 com dados públicos do usuário (sem senha_hash).
 * 3. ROTA POST /login:
 *    - Middlewares: rate limiter e validarLogin.
 *    - Controlador:
 *      * Buscar usuário pelo e-mail normalizado.
 *      * Comparar senha enviada com o hash via bcrypt.compare().
 *      * Se não bater, responder 401 com mensagem genérica ("E-mail ou senha inválidos").
 *      * Se bater, gerar e retornar token JWT e dados do usuário com status 200.
 * 4. ROTA GET /me:
 *    - Middlewares: autenticar.
 *    - Controlador:
 *      * Buscar dados atualizados do usuário autenticado a partir de req.usuarioId.
 *      * Retornar status 200.
 * 5. Exportar o router como default.
 */
import express from 'express';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import { pool } from '../config/db.js';
import { gerarToken } from '../config/jwt.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = express.Router();

// Parte do @Pedro


//Parte do @Renan
// Limitador de tentativas de login por segurança (requisito do livro)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                  // Máximo de 10 tentativas por IP
  message: { erro: 'Muitas tentativas de login. Tente novamente após 15 minutos.' },
});

router.post('/login', loginLimiter, async(req, res, next) => {
  try{
    const{email, senha} = req.body;
  
    //valida se o divo preencheu o email ou senha
    if (!email || !senha) {
      return res.status(400).json({erro: 'e-mail e senha são obrigatório, por favor preencha.'})
    }

    // aqui a função LOWER é para converter a string toda em minuscula e o trim remove todos os espaços em branco invisíveis que ficam no inicio e fim da string
    const result = await pool.query(
      'SELECT id, nome, email, senha_hash FROM usuarios WHERE LOWER(email) = LOWER($1)', [email.trim()]
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

    //Se a senha bater: gera o token JWT usando a sua função!
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
    //Caso dê algum erro de banco, manda pro tratarErros
    return next(error);
  }

});

router.get('/me', autenticar, async (req, res, next) => {
  try {
    // O req.usuarioId foi colocado aqui pelo seu middleware autenticar!
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