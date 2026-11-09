/**
 * ============================================================================
 * ARQUIVO: src/models/FonteDestino.js
 * RESPONSABILIDADE: Camada de persistência para Fontes e Destinos (RF5).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar o pool/query de src/config/db.js.
 * 2. Método listarPorUsuario(usuarioId):
 *    - Buscar todas as contas, rendas e cartões pertencentes ao usuário logado.
 * 3. Método buscarPorId(id, usuarioId):
 *    - Obter fonte/destino específico validando posse do usuário.
 * 4. Método criar({ usuarioId, nome, tipo, diaFechamento, diaVencimento, limite }):
 *    - Validar regras de negócio: se tipo === 'cartao_credito', exigir dia_fechamento, dia_vencimento e limite.
 *    - Inserir no banco com parâmetros preparados.
 * 5. Método criarPadrao(usuarioId):
 *    - Criar conta padrão (ex.: 'Conta Corrente' ou 'Carteira') para o usuário recém-cadastrado.
 * 6. Método atualizar(id, usuarioId, dados):
 *    - Atualizar dados garantindo que pertença a usuarioId.
 * 7. Método excluir(id, usuarioId):
 *    - Impedir exclusão se houver lançamentos vinculados a esta fonte/destino (retornar erro explicativo).
 *    - Caso contrário, realizar o DELETE.
 */
