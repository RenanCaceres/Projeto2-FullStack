/**
 * ============================================================================
 * ARQUIVO: src/components/pages/CadastroPage.jsx
 * RESPONSABILIDADE: Tela de registro de novo usuário no FinanFlow (RF1).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar useAuth de '../../contexts/AuthContext.jsx', Link e useNavigate de 'react-router-dom'.
 * 2. Criar estados para: nome, email, cpf, senha, confirmacaoSenha, errosPorCampo, carregando.
 * 3. Aplicar máscara de digitação em tempo real no campo de CPF (000.000.000-00).
 * 4. Implementar validação no cliente e submissão:
 *    - Chamar cadastrar(...) do AuthContext.
 *    - Se o servidor responder 400 ou 409: capturar o objeto erro.response.data.campos
 *      e mapear as mensagens de erro diretamente abaixo de cada campo correspondente
 *      (ex.: "Já existe um usuário com este CPF", "E-mail inválido").
 *    - Se sucesso: exibir mensagem de confirmação e redirecionar para o Login.
 * 5. Renderizar o formulário completo e link para a tela de Login.
 */
