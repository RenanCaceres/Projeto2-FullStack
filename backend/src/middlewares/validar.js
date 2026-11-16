/**
 * Middlewares de validação de dados de entrada e sanitização.
 * Formato de erro padrão: { erro: 'Dados inválidos.', campos: { campo: 'mensagem' } }
 */

export function validarCPF(cpf) {
  const digitos = String(cpf ?? '').replace(/\D/g, '');

  if (digitos.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digitos)) return false;

  const calcularDigito = (base) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcularDigito(digitos.slice(0, 9));
  const d2 = calcularDigito(digitos.slice(0, 10));

  return d1 === Number(digitos[9]) && d2 === Number(digitos[10]);
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCadastro(req, res, next) {
  const { nome, email, cpf, senha, confirmacaoSenha } = req.body ?? {};
  const campos = {};

  if (!nome || !String(nome).trim()) {
    campos.nome = 'Nome é obrigatório.';
  } else if (String(nome).trim().length > 100) {
    campos.nome = 'Nome deve ter no máximo 100 caracteres.';
  }

  if (!email || !String(email).trim()) {
    campos.email = 'E-mail é obrigatório.';
  } else if (!REGEX_EMAIL.test(String(email).trim())) {
    campos.email = 'E-mail inválido.';
  }

  if (!cpf) {
    campos.cpf = 'CPF é obrigatório.';
  } else if (!validarCPF(cpf)) {
    campos.cpf = 'CPF inválido.';
  }

  if (!senha) {
    campos.senha = 'Senha é obrigatória.';
  } else if (String(senha).length < 8) {
    campos.senha = 'A senha deve ter pelo menos 8 caracteres.';
  } else if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
    campos.senha = 'A senha deve conter letras e números.';
  }

  if (!confirmacaoSenha) {
    campos.confirmacaoSenha = 'Confirmação de senha é obrigatória.';
  } else if (senha !== confirmacaoSenha) {
    campos.confirmacaoSenha = 'As senhas não conferem.';
  }

  if (Object.keys(campos).length > 0) {
    return res.status(400).json({ erro: 'Dados inválidos.', campos });
  }

  req.body.nome = String(nome).trim();
  req.body.email = String(email).trim().toLowerCase();
  req.body.cpf = String(cpf).replace(/\D/g, '');

  return next();
}

export function validarLogin(req, res, next) {
  const { email, senha } = req.body ?? {};
  const campos = {};

  if (!email || !String(email).trim()) campos.email = 'E-mail é obrigatório.';
  if (!senha) campos.senha = 'Senha é obrigatória.';

  if (Object.keys(campos).length > 0) {
    return res.status(400).json({ erro: 'Dados inválidos.', campos });
  }

  req.body.email = String(email).trim().toLowerCase();
  return next();
}
