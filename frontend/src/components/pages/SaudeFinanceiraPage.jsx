/**
 * ============================================================================
 * ARQUIVO: src/components/pages/SaudeFinanceiraPage.jsx
 * RESPONSABILIDADE: Painel do Desafio de Saúde Financeira (+10 pontos extras).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar api de '../../services/api.js' e hooks do React.
 * 2. Criar estados para: indicadores, projecoes, dicas, carregando.
 * 3. Consumir endpoint api.get('/saude-financeira').
 * 4. Renderizar:
 *    - Score de Saúde Financeira (indicador visual de 0 a 100 com escala de cor: Verde/Amarelo/Vermelho).
 *    - Cards de Métricas Chave:
 *      * Taxa de Poupança (% da renda guardada)
 *      * Comprometimento com Dívidas / Cartões
 *      * Proporção Gastos Fixos x Lazer (Regra 50-30-20)
 *    - Gráfico com projeção de patrimônio ou fluxo de caixa para os próximos meses.
 *    - Seção de Dicas e Insights Inteligentes gerados a partir do comportamento de consumo do usuário.
 */
