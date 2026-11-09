/**
 * ============================================================================
 * ARQUIVO: src/models/Relatorio.js
 * RESPONSABILIDADE: Regras de negócio, agregações e cálculo de relatórios (RF7, RF8, RF9).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar pool de src/config/db.js.
 * 2. Método relatorioPorCategoria(usuarioId, inicio, fim):
 *    - Executar consulta SQL agregada com GROUP BY c.id, c.nome, SUM(l.valor) para saídas e entradas.
 *    - Calcular o percentual de cada categoria sobre o total no período.
 *    - Consultar período anterior de mesmo tamanho para gerar a coluna comparativa (aumento/redução).
 * 3. Método relatorioPorFonteDestino(usuarioId, inicio, fim):
 *    - Totalizar entradas por fonte e saídas por destino.
 *    - Calcular o saldo (entradas - saídas) por conta corrente/poupança.
 * 4. Método previsaoFaturasCartao(usuarioId, meses = 3):
 *    - Buscar todos os cartões de crédito do usuário.
 *    - Implementar a função pura utilitária de cálculo de faturas (regra de fechamento):
 *      -> Se compra feita antes do dia de fechamento, entra na fatura do mês corrente.
 *      -> Se feita no dia do fechamento ou posterior, entra na fatura do mês subsequente.
 *      -> Parcela k entra k - 1 meses após a primeira fatura.
 *      -> Ajustar dias inexistentes em meses menores (ex.: 28/29 de fevereiro).
 *    - Calcular limite total, limite utilizado (soma das parcelas ainda não pagas/fechadas)
 *      e limite disponível para cada cartão.
 * 5. Método calcularSaudeFinanceira(usuarioId):
 *    - Calcular taxa de poupança ((entradas - saídas) / entradas * 100).
 *    - Calcular comprometimento de renda com cartões/parcelamentos.
 *    - Gerar pontuação/score de saúde financeira e dicas automatizadas.
 */
