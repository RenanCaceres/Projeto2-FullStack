/**
 * ============================================================================
 * ARQUIVO: src/routes/saudeFinanceira.routes.js
 * RESPONSABILIDADE: Rota e controlador para o Desafio de Saúde Financeira (+10 pontos).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Criar instância do Router do Express e aplicar o middleware 'autenticar'.
 * 2. ROTA GET /:
 *    - Controlador:
 *      * Obter métricas consolidadas dos últimos 6 meses para o usuário logado (req.usuarioId).
 *      * Calcular indicadores:
 *        1. Taxa média de poupança (percentual da renda líquida guardada).
 *        2. Nível de comprometimento da renda com cartões de crédito e parcelamentos.
 *        3. Distribuição de despesas: Essenciais (Moradia, Alimentação, Saúde) vs Supérfluas.
 *      * Gerar projeção financeira para os próximos 3 meses com base no padrão de gastos.
 *      * Produzir dicas personalizadas orientadas aos dados do usuário (ex.: "Seus gastos com lazer
 *        subiram 25% este mês, considere fixar um teto de R$ X").
 *      * Retornar status 200 com os dados formatados para exibição em gráficos no front-end.
 * 3. Exportar o router.
 */
