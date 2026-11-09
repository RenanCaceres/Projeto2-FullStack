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
