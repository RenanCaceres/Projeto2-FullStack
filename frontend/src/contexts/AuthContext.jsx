/**
 * ============================================================================
 * ARQUIVO: src/contexts/AuthContext.jsx
 * RESPONSABILIDADE: Gerenciamento Global do Estado de Autenticação (Context API).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar createContext, useState, useEffect e useContext de 'react'.
 * 2. Criar a constante AuthContext = createContext({}).
 * 3. Criar e exportar o componente AuthProvider({ children }):
 *    - Estados:
 *      * usuario: armazena os dados do usuário autenticado ({ id, nome, email, cpf }) ou null.
 *      * token: armazena a string do JWT ou null.
 *      * carregando: boolean (true enquanto verifica a sessão no primeiro carregamento).
 *    - Efeito inicial (useEffect):
 *      * Ler token e dados salvos no localStorage no boot da aplicação.
 *      * Se houver token, validar sessão chamando api.get('/auth/me').
 *      * Finalizar definindo carregando como false.
 *    - Função login({ email, senha }):
 *      * Fazer requisição POST para '/auth/login'.
 *      * Salvar token e usuario no estado e no localStorage.
 *    - Função cadastrar({ nome, email, cpf, senha, confirmacaoSenha }):
 *      * Fazer requisição POST para '/auth/cadastro'.
 *    - Função logout():
 *      * Limpar o estado (setUsuario(null), setToken(null)) e remover chaves do localStorage.
 *    - Prover no AuthContext.Provider:
 *      * { usuario, token, autenticado: !!usuario, carregando, login, cadastrar, logout }
 * 4. Exportar o hook customizado useAuth():
 *    - Retornar useContext(AuthContext) para consumo simplificado em qualquer componente.
 */

import React, { createContext, useState, useEffect, useContext} from "react";
import api from "../services/api";

export const AuthContext = createContext({});
// createContext({}): Inicializa o canal global onde vamos disponibilizar o usuário logado e as funções de login e logout

/**
 * ============================================================================
 * ARQUIVO: src/contexts/AuthContext.jsx
 * RESPONSABILIDADE: Gerenciamento Global do Estado de Autenticação (Context API).
 * ============================================================================
 */

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      const tokenSalvo = localStorage.getItem('@FinanFlow:token');
      const usuarioSalvo = localStorage.getItem('@FinanFlow:usuario');

      if (tokenSalvo && usuarioSalvo) {
        try {
          const response = await api.get('/auth/me');
          setUsuario(response.data.usuario);
        } catch (error) {
          localStorage.removeItem('@FinanFlow:token');
          localStorage.removeItem('@FinanFlow:usuario');
          setUsuario(null);
        }
      }

      setCarregando(false);
    }

    carregarSessao();
  }, []);

  async function login({ email, senha }) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, usuario: usuarioLogado } = response.data;

    localStorage.setItem('@FinanFlow:token', token);
    localStorage.setItem('@FinanFlow:usuario', JSON.stringify(usuarioLogado));

    setUsuario(usuarioLogado);
    return usuarioLogado;
  }

  function logout() {
    localStorage.removeItem('@FinanFlow:token');
    localStorage.removeItem('@FinanFlow:usuario');
    setUsuario(null);
    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: !!usuario,
        carregando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }

  return context;
}