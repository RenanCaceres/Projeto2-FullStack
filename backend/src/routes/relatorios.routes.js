/**
 * ============================================================================
 * ARQUIVO: src/routes/relatorios.routes.js
 * RESPONSABILIDADE: Rotas e controladores para Relatórios e Faturas de Cartão (RF7, RF8 e RF9).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Criar instância do Router do Express e aplicar o middleware 'autenticar'.
 * 2. ROTA GET /categorias:
 *    - Query params: inicio, fim.
 *    - Controlador: chamar Relatorio.relatorioPorCategoria() e responder totais de saídas/entradas,
 *      percentuais e comparativo com o período anterior com status 200.
 * 3. ROTA GET /fontes-destinos:
 *    - Query params: inicio, fim.
 *    - Controlador: chamar Relatorio.relatorioPorFonteDestino() e responder totais por fonte e saldos.
 * 4. ROTA GET /faturas:
 *    - Query params opcionais: meses (padrão 3).
 *    - Controlador: chamar Relatorio.previsaoFaturasCartao(), retornando faturas abertas e futuras,
 *      limites utilizados e limites disponíveis com status 200.
 * 5. Exportar o router.
 */
