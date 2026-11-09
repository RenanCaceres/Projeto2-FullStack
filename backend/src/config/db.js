/**
 * ============================================================================
 * ARQUIVO: src/config/db.js
 * RESPONSABILIDADE: Gerenciamento do Pool de Conexões com o Banco de Dados.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar a classe Pool do pacote 'pg' (ou mysql2/promise caso use MySQL).
 * 2. Criar uma nova instância de Pool utilizando a variável de ambiente process.env.DATABASE_URL.
 *    - Se for utilizar banco na nuvem (ex.: Neon, Supabase, Render), habilitar a opção SSL:
 *      { ssl: { rejectUnauthorized: false } }
 * 3. Configurar ouvintes de eventos para monitorar conexões e logar erros graves:
 *    - pool.on('connect', ...)
 *    - pool.on('error', ...)
 * 4. Exportar a função query(text, params) ou o próprio pool para ser consumido
 *    exclusivamente pela camada src/models/.
 * 
 * IMPORTANTE:
 * - Toda e qualquer consulta ao banco no projeto deve utilizar parâmetros preparados
 *   (Prepared Statements com $1, $2...) para mitigar qualquer risco de SQL Injection.
 */
