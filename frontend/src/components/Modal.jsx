/**
 * ============================================================================
 * ARQUIVO: src/components/Modal.jsx
 * RESPONSABILIDADE: Componente genérico e acessível de janela modal / diálogo.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Props: isOpen (boolean), onClose (função), titulo (string), children (JSX).
 * 2. Se isOpen for false, retornar null.
 * 3. Renderizar overlay escurecido de fundo com listener para fechar ao clicar fora.
 * 4. Capturar a tecla ESC (useEffect) para fechar o modal.
 * 5. Renderizar cabeçalho com título e botão de fechar (X), corpo com children e rodapé de ações.
 * 6. Utilizado para formulários de criação/edição e confirmações de exclusão.
 */
