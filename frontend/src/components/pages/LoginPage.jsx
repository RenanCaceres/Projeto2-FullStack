/**
 * ============================================================================
 * ARQUIVO: src/components/pages/LoginPage.jsx
 * RESPONSABILIDADE: Tela de autenticação e acesso do usuário ao sistema (RF2).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar useAuth de '../../contexts/AuthContext.jsx', Link e useNavigate de 'react-router-dom'.
 * 2. Criar estados para: email, senha, erroGeral, carregando.
 * 3. Implementar função handleSubmit(e):
 *    - Validar preenchimento dos campos no cliente.
 *    - Chamar login({ email, senha }) do contexto.
 *    - Em caso de sucesso: redirecionar para a página inicial ('/').
 *    - Em caso de 401: exibir mensagem de erro amigável ("E-mail ou senha inválidos").
 * 4. Renderizar formulário com campos de e-mail e senha, botão de login com estado de loading,
 *    e link convidativo para a tela de cadastro ("/cadastro").
 */
/**
 * ============================================================================
 * ARQUIVO: src/components/pages/LoginPage.jsx
 * RESPONSABILIDADE: Interface visual e formulário de Login do usuário (RF2).
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      await login({ email, senha });
      navigate('/dashboard');
    } catch (error) {
      const mensagem = error.response?.data?.erro || 'Erro ao realizar login. Verifique suas credenciais.';
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">FinanFlow</h1>
          <p className="text-slate-400 text-sm mt-2">Controle Financeiro Pessoal</p>
        </div>

        {erro && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition duration-200 mt-2"
          >
            {enviando ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-emerald-400 hover:underline">
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
}