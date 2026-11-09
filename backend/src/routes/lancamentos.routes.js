/**
 * ============================================================================
 * ARQUIVO: src/routes/lancamentos.routes.js
 * RESPONSABILIDADE: Rotas e controladores para CRUD de Lançamentos e Parcelamentos (RF6).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Criar instância do Router do Express e aplicar o middleware 'autenticar'.
 * 2. ROTA GET /:
 *    - Query params opcionais: inicio, fim, tipo, categoriaId, fonteDestinoId, pagina, limite.
 *    - Controlador: listar lançamentos paginados e retornar totais do período (entradas, saídas e saldo).
 * 3. ROTA POST /:
 *    - Middlewares: validarLancamento.
 *    - Controlador:
 *      * Se for compra única: chamar Lancamento.criarSimples().
 *      * Se for compra no cartão de crédito com totalParcelas > 1:
 *        chamar Lancamento.criarParcelado() executando a divisão precisa de centavos dentro de transação SQL.
 *      * Retornar status 201.
 * 4. ROTA GET /:id:
 *    - Controlador: detalhar lançamento específico. Se for de outro usuário, retornar 404 (RF3).
 * 5. ROTA PUT /:id:
 *    - Controlador: atualizar dados do lançamento com validações.
 * 6. ROTA DELETE /:id:
 *    - Query param opcional: ?todasParcelas=true
 *    - Controlador: excluir apenas a parcela selecionada ou todo o lote de parcelamento. Responder 204.
 * 7. Exportar o router.
 */
