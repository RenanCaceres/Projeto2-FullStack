/**
 * ============================================================================
 * ARQUIVO: src/components/pages/RelatoriosPage.jsx
 * RESPONSABILIDADE: Painel Analítico de Gastos por Categoria e Fontes (RF7 e RF8).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar api de '../../services/api.js', GraficoCategorias e GraficoFontes.
 * 2. Criar estados para: dataInicio, dataFim, dadosCategorias, dadosFontes, abaAtiva, carregando.
 * 3. No filtro de período:
 *    - Disponibilizar seletor de mês corrente, mês anterior ou intervalo customizado.
 * 4. Relatório por Categoria (RF7):
 *    - Consumir api.get('/relatorios/categorias', { params: { inicio, fim } }).
 *    - Exibir tabela com: Nome da categoria, Total gasto (R$), Percentual sobre o total (%)
 *      e Comparativo com o período anterior (indicando com ícones se os gastos subiram ou caíram).
 *    - Renderizar gráfico de pizza/rosca via <GraficoCategorias />.
 * 5. Relatório por Fonte/Destino (RF8):
 *    - Consumir api.get('/relatorios/fontes-destinos', { params: { inicio, fim } }).
 *    - Exibir total recebido por cada fonte de renda e total debitado de cada conta/cartão.
 *    - Renderizar gráfico de barras via <GraficoFontes />.
 */
