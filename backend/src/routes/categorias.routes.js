/**
 * ============================================================================
 * ARQUIVO: src/routes/categorias.routes.js
 * RESPONSABILIDADE: Rotas e controladores para o CRUD de Categorias (RF4).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Criar instância do Router do Express e aplicar o middleware 'autenticar' em todas as rotas.
 * 2. ROTA GET /:
 *    - Controlador: listar todas as categorias do usuário autenticado (req.usuarioId) via Categoria.listarPorUsuario.
 * 3. ROTA POST /:
 *    - Controlador: validar campos (nome e tipo 'entrada'/'saida'), criar categoria associada a req.usuarioId.
 *    - Retornar 201 em caso de sucesso ou 409 se nome já existir para o mesmo tipo.
 * 4. ROTA PUT /:id:
 *    - Controlador: validar se categoria pertence ao usuário e atualizar dados. Retornar 200.
 * 5. ROTA DELETE /:id:
 *    - Controlador: verificar se a categoria possui lançamentos associados.
 *    - Se possuir lançamentos: retornar status 409 com mensagem explicativa.
 *    - Se não possuir vínculos: excluir e responder status 204 No Content.
 * 6. Exportar o router.
 */
