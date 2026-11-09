/**
 * ============================================================================
 * ARQUIVO: src/components/pages/LancamentosPage.jsx
 * RESPONSABILIDADE: Gestão completa de lançamentos e parcelamentos (RF6).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar api de '../../services/api.js', Modal, ícones e hooks.
 * 2. Criar estados para: lista de lançamentos, filtros (data início, fim, tipo, categoria, conta),
 *    paginaAtual, totalPaginas, modalAberto, lancamentoSelecionado, modoEdicao.
 * 3. Implementar busca filtrada com paginação: api.get('/lancamentos', { params }).
 * 4. Implementar formulário no Modal:
 *    - Campos: Tipo (Entrada / Saída), Descrição, Valor, Data, Categoria, Fonte/Destino.
 *    - Se destino for cartão de crédito e tipo for saída: exibir campo de Número de Parcelas (1 a 48x).
 *    - Validar que categoria pertence ao mesmo tipo do lançamento antes de enviar.
 * 5. Implementar exclusão com confirmação:
 *    - Se for lançamento parcelado: perguntar ao usuário se deseja excluir "Apenas esta parcela"
 *      ou "Todas as parcelas da compra" (enviando ?todasParcelas=true para a API).
 * 6. Exibir tabela com badge de tipo, formatação monetária e botões de editar e excluir.
 */
