/**
 * ============================================================================
 * ARQUIVO: src/components/pages/CategoriasPage.jsx
 * RESPONSABILIDADE: Gestão do CRUD de Categorias de Entrada e Saída (RF4).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar api de '../../services/api.js' e componente Modal.
 * 2. Criar estados para: categoriasEntrada, categoriasSaida, modalAberto, categoriaEditando.
 * 3. Buscar categorias do usuário autenticado via api.get('/categorias').
 * 4. Implementar criação e edição:
 *    - Formulário com nome e tipo ('entrada' ou 'saida').
 *    - Tratar status 409 caso já exista categoria com o mesmo nome para o tipo.
 * 5. Implementar exclusão com tratamento de erro:
 *    - Se a API retornar 409 informando que existem lançamentos vinculados, exibir modal/alerta
 *      orientando o usuário de que a categoria não pode ser removida enquanto houver registros.
 * 6. Renderizar duas listas organizadas: Categorias de Entrada e Categorias de Saída.
 */
