/**
 * Tela de registro de novo usuário (RF1).
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';

const mascararCpf = (valor) => {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarCliente({ nome, email, cpf, senha, confirmacaoSenha }) {
  const erros = {};
  if (!nome.trim()) erros.nome = 'Nome é obrigatório.';
  if (!email.trim()) erros.email = 'E-mail é obrigatório.';
  else if (!REGEX_EMAIL.test(email.trim())) erros.email = 'E-mail inválido.';
  if (cpf.replace(/\D/g, '').length !== 11) erros.cpf = 'CPF deve ter 11 dígitos.';
  if (senha.length < 8) erros.senha = 'A senha deve ter pelo menos 8 caracteres.';
  else if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) erros.senha = 'A senha deve conter letras e números.';
  if (senha !== confirmacaoSenha) erros.confirmacaoSenha = 'As senhas não conferem.';
  return erros;
}

const inputClass =
  'w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition';

function Campo({ label, erro, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {children}
      {erro && <p className="text-red-400 text-xs mt-1">{erro}</p>}
    </div>
  );
}

export default function CadastroPage() {
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', senha: '', confirmacaoSenha: '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const atualizar = (campo) => (e) => {
    const valor = campo === 'cpf' ? mascararCpf(e.target.value) : e.target.value;
    setForm((anterior) => ({ ...anterior, [campo]: valor }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErroGeral('');
    setSucesso('');

    const errosCliente = validarCliente(form);
    setErros(errosCliente);
    if (Object.keys(errosCliente).length > 0) return;

    setCarregando(true);
    try {
      await api.post('/auth/cadastro', {
        ...form,
        cpf: form.cpf.replace(/\D/g, ''),
      });
      setSucesso('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      const data = error.response?.data;
      if (data?.campos) setErros(data.campos);
      else setErroGeral(data?.erro || 'Não foi possível concluir o cadastro. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">FinanFlow</h1>
          <p className="text-slate-400 text-sm mt-2">Crie sua conta</p>
        </div>

        {erroGeral && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {erroGeral}
          </div>
        )}
        {sucesso && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm text-center">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Campo label="Nome" erro={erros.nome}>
            <input type="text" value={form.nome} onChange={atualizar('nome')} placeholder="Seu nome" className={inputClass} />
          </Campo>
          <Campo label="E-mail" erro={erros.email}>
            <input type="email" value={form.email} onChange={atualizar('email')} placeholder="seu@email.com" className={inputClass} />
          </Campo>
          <Campo label="CPF" erro={erros.cpf}>
            <input type="text" inputMode="numeric" value={form.cpf} onChange={atualizar('cpf')} placeholder="000.000.000-00" className={inputClass} />
          </Campo>
          <Campo label="Senha" erro={erros.senha}>
            <input type="password" value={form.senha} onChange={atualizar('senha')} placeholder="Mínimo 8 caracteres" className={inputClass} />
          </Campo>
          <Campo label="Confirmar senha" erro={erros.confirmacaoSenha}>
            <input type="password" value={form.confirmacaoSenha} onChange={atualizar('confirmacaoSenha')} placeholder="Repita a senha" className={inputClass} />
          </Campo>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition duration-200 mt-2"
          >
            {carregando ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
