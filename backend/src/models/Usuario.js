/**
 * ============================================================================
 * ARQUIVO: src/models/Usuario.js
 * RESPONSABILIDADE: Camada de acesso ao banco e regras de persistência para Usuários.
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar o pool/query de src/config/db.js.
 * 2. Método criar({ nome, email, cpf, senhaHash }):
 *    - Inserir novo usuário no banco com query parametrizada:
 *      INSERT INTO usuarios (nome, email, cpf, senha_hash) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, cpf;
 *    - Normalizar email com trim().toLowerCase() e CPF apenas com dígitos.
 * 3. Método buscarPorEmail(email):
 *    - Buscar registro pelo email normalizado (LOWER(email) = LOWER($1)) para o fluxo de login.
 * 4. Método buscarPorId(id):
 *    - Retornar dados do usuário (id, nome, email, cpf) EXCLUINDO obrigatoriamente a coluna senha_hash.
 * 5. Método verificarDuplicidade(email, cpf):
 *    - Checar prévia de existência (lembrando que a garantia real final é da constraint UNIQUE do banco).
 */
