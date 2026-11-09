/**
 * ============================================================================
 * ARQUIVO: src/models/Categoria.js
 * RESPONSABILIDADE: Camada de persistência para Categorias (RF4).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar o pool/query de src/config/db.js.
 * 2. Método listarPorUsuario(usuarioId):
 *    - SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY tipo, nome;
 * 3. Método buscarPorId(id, usuarioId):
 *    - Buscar categoria garantindo que pertença ao usuário logado (filtro por id e usuario_id).
 * 4. Método criar({ usuarioId, nome, tipo }):
 *    - Inserir nova categoria validando unicidade (usuario_id, tipo, nome).
 * 5. Método criarPadrao(usuarioId):
 *    - Inserir lote inicial de categorias básicas logo após o cadastro do usuário
 *      (Salário, Alimentação, Moradia, Mobilidade, Lazer, Saúde, etc.).
 * 6. Método atualizar(id, usuarioId, { nome, tipo }):
 *    - Atualizar campos da categoria pertencente ao usuário.
 * 7. Método excluir(id, usuarioId):
 *    - Verificar antes se existem lançamentos associados (SELECT COUNT(*) FROM lancamentos WHERE categoria_id = $1).
 *    - Se houver lançamentos, lançar erro informando que a categoria não pode ser excluída.
 *    - Se não houver, executar DELETE WHERE id = $1 AND usuario_id = $2.
 */
