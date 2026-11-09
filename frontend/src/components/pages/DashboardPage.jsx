/**
 * ============================================================================
 * ARQUIVO: src/components/pages/DashboardPage.jsx
 * RESPONSABILIDADE: Painel inicial com resumo financeiro do mês corrente.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar api de '../../services/api.js' e hooks do React (useState, useEffect).
 * 2. Criar estados para: totais (entradas, saídas, saldo), últimos lançamentos, faturas abertas, carregando.
 * 3. No useEffect:
 *    - Buscar lançamentos do mês atual via api.get('/lancamentos?inicio=...&fim=...').
 *    - Buscar previsão rápida de faturas via api.get('/relatorios/faturas?meses=1').
 * 4. Renderizar:
 *    - Cards superiores de destaque:
 *      * Total de Entradas (verde)
 *      * Total de Saídas (vermelho)
 *      * Saldo Atual (azul/verde se positivo, vermelho se negativo)
 *    - Tabela resumida com os 5 lançamentos mais recentes.
 *    - Card de alerta com a fatura do cartão mais próximo do vencimento.
 *    - Botões de ação rápida para criar novo lançamento ou visualizar relatórios.
 */
