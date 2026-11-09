/**
 * ============================================================================
 * ARQUIVO: src/models/Lancamento.js
 * RESPONSABILIDADE: Camada de persistência para Lançamentos Financeiros (RF6).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar pool de src/config/db.js e crypto.randomUUID (ou pacote uuid).
 * 2. Método listar(usuarioId, { dataInicio, dataFim, tipo, categoriaId, fonteDestinoId, pagina, limite }):
 *    - Construir consulta parametrizada dinâmica com filtros opcionais.
 *    - Paginar resultados (LIMIT e OFFSET).
 *    - Retornar lançamentos e metadados de paginação.
 * 3. Método obterTotaisPeriodo(usuarioId, dataInicio, dataFim):
 *    - Executar agregação SQL de entradas, saídas e cálculo de saldo no período.
 * 4. Método criarSimples({ usuarioId, tipo, descricao, valor, data, categoriaId, fonteDestinoId }):
 *    - Validar se categoria e fonte pertencem a usuarioId e se tipo da categoria == tipo do lançamento.
 *    - Inserir único lançamento com total_parcelas = 1 e parcela_atual = 1.
 * 5. Método criarParcelado({ usuarioId, descricao, valorTotal, dataCompra, categoriaId, fonteDestinoId, totalParcelas }):
 *    - Utilizar transação SQL (BEGIN ... COMMIT / ROLLBACK) via cliente do pool.
 *    - Gerar um identificador único de lote (grupo_parcelamento = crypto.randomUUID()).
 *    - Calcular divisão exata de centavos:
 *      const valorBase = Math.floor((valorTotal * 100) / totalParcelas) / 100;
 *      const centavosExtras = Number((valorTotal - (valorBase * totalParcelas)).toFixed(2));
 *      -> Parcela 1 recebe valorBase + centavosExtras.
 *      -> Demais parcelas recebem valorBase.
 *    - Calcular datas de cada parcela avançando mês a mês.
 *    - Inserir todas as parcelas na mesma transação.
 * 6. Método atualizar(id, usuarioId, dados):
 *    - Atualizar lançamento garantindo que pertença a usuarioId.
 * 7. Método excluir(id, usuarioId, todasParcelas = false):
 *    - Se todasParcelas for true e o registro possuir grupo_parcelamento:
 *      excluir todas as parcelas associadas àquele UUID.
 *    - Caso contrário, excluir apenas o lançamento específico (id).
 */
