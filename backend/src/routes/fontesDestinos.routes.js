/**
 * ============================================================================
 * ARQUIVO: src/routes/fontesDestinos.routes.js
 * RESPONSABILIDADE: Rotas e controladores para CRUD de Fontes e Destinos (RF5).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Criar instância do Router do Express e aplicar o middleware 'autenticar'.
 * 2. ROTA GET /:
 *    - Controlador: listar todas as contas, cartões e fontes de renda de req.usuarioId.
 * 3. ROTA POST /:
 *    - Controlador: validar payload. Se tipo === 'cartao_credito', exigir dia_fechamento,
 *      dia_vencimento e limite.
 *    - Criar registro vinculado a req.usuarioId e responder status 201.
 * 4. ROTA PUT /:id:
 *    - Controlador: atualizar fonte/destino garantindo validação de posse (req.usuarioId).
 * 5. ROTA DELETE /:id:
 *    - Controlador: checar se existem lançamentos vinculados.
 *    - Se houver vínculos: retornar 409 impedindo exclusão.
 *    - Se livre: remover e retornar 204 No Content.
 * 6. Exportar o router.
 */
