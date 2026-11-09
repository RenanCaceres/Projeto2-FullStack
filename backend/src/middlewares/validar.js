/**
 * ============================================================================
 * ARQUIVO: src/middlewares/validar.js
 * RESPONSABILIDADE: Middlewares de validação de dados de entrada e sanitização.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Implementar a função utilitária validarCPF(cpf):
 *    - Remover pontuações mantendo apenas dígitos (\D).
 *    - Checar tamanho (11 dígitos) e rejeitar sequências inválidas conhecidas (111.111.111-11, etc.).
 *    - Calcular os dois dígitos verificadores (módulo 11) conforme o algoritmo oficial brasileiro.
 * 
 * 2. Implementar middleware validarCadastro:
 *    - Verificar preenchimento obrigatório de nome, email, cpf, senha e confirmação.
 *    - Validar formato de e-mail e regras de complexidade de senha.
 *    - Se houver falhas, acumular no objeto 'campos' e responder 400 com:
 *      { erro: 'Dados inválidos.', campos: { [nomeCampo]: 'mensagem de erro' } }.
 * 
 * 3. Implementar middleware validarLogin:
 *    - Validar se email e senha foram informados antes de prosseguir para a rota.
 * 
 * 4. Implementar middleware validarLancamento:
 *    - Validar se valor > 0, data válida e tipos compatíveis.
 *    - Validar regras de cartão de crédito (número de parcelas entre 1 e 48).
 * 
 * 5. Garantir que todas as validações sigam o formato padrão de erro exigido no Capítulo 10.
 */
