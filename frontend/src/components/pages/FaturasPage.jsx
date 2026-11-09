/**
 * ============================================================================
 * ARQUIVO: src/components/pages/FaturasPage.jsx
 * RESPONSABILIDADE: Previsão e acompanhamento de faturas de Cartão de Crédito (RF9).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar api de '../../services/api.js' e hooks do React.
 * 2. Criar estados para: cartoesComFaturas, cartaoSelecionadoId, carregando.
 * 3. Buscar projeções via api.get('/relatorios/faturas?meses=4').
 * 4. Para cada cartão:
 *    - Exibir card resumo com:
 *      * Limite Total (R$)
 *      * Limite Comprometido (soma de todas as parcelas pendentes)
 *      * Limite Disponível Restante (barra de progresso visual)
 *      * Dia de fechamento e dia de vencimento
 * 5. Exibir faturas em abas ou acordeão cronológico (Fatura Atual + Próximos 3 meses):
 *    - Data de fechamento e data de vencimento da fatura.
 *    - Valor total da fatura.
 *    - Tabela detalhada dos lançamentos daquela fatura com indicação de parcelas
 *      (ex.: "Notebook Dell — Parcela 2/10").
 */
