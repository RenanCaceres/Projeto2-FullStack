-- ============================================================================
-- ARQUIVO: database/seed.sql
-- RESPONSABILIDADE: Script de carga inicial de dados para testes e demonstração.
-- ============================================================================
--
-- O QUE DEVE SER FEITO NESTE ARQUIVO:
-- 1. Inserir no mínimo 2 usuários fictícios com hashes de senha válidos gerados via bcrypt.
--    Exemplo: Usuário A (ex.: usuarioA@teste.com / senha123) e Usuário B (ex.: usuarioB@teste.com / senha123)
--    para validação do isolamento de dados no teste de apresentação.
--
-- 2. Inserir as categorias padrão para cada usuário:
--    - Entradas: Salário, Rendimentos, Freelance, Outros.
--    - Saídas: Moradia, Alimentação, Mobilidade, Lazer, Saúde, Educação.
--
-- 3. Inserir fontes e destinos para cada usuário:
--    - Contas: Conta Corrente Banco do Brasil, Poupança Caixa.
--    - Cartões de crédito com dia_fechamento, dia_vencimento e limite:
--      Ex.: Cartão Nubank (fechamento dia 3, vencimento dia 10, limite R$ 3.000,00).
--      Ex.: Cartão Visa (fechamento dia 25, vencimento dia 5, limite R$ 5.000,00).
--
-- 4. Inserir dados históricos de lançamentos cobrindo ao menos 3 meses:
--    - Lançamentos comuns de entradas e saídas em dinheiro/conta corrente.
--    - Pelo menos uma compra parcelada no cartão (ex.: 3x de R$ 100,00 -> R$ 33,34 + R$ 33,33 + R$ 33,33)
--      com o mesmo grupo_parcelamento (UUID) distribuído entre os meses para testar as faturas (RF9).
--    - Dados suficientes para testar os relatórios com comparação com o mês anterior (RF7 e RF8).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Inserção dos usuários de teste (senha: senha123)
INSERT INTO usuarios (nome, email, cpf, senha_hash)
VALUES
  (
    'Usuário A Teste',
    'usuarioa@teste.com',
    '12345678909',
    crypt('senha123', gen_salt('bf', 10))
  ),
  (
    'Usuário B Teste',
    'usuariob@teste.com',
    '98765432100',
    crypt('senha123', gen_salt('bf', 10))
  )
ON CONFLICT DO NOTHING;

-- 2. Inserção das categorias, fontes/destinos e lançamentos usando os IDs reais
DO $$
DECLARE
  v_usuario_a_id INTEGER;
  v_usuario_b_id INTEGER;
  v_mes_atual    DATE := DATE_TRUNC('month', CURRENT_DATE)::date;
  v_grupo_nubank UUID := gen_random_uuid();
  v_grupo_visa   UUID := gen_random_uuid();
  v_grupo_b      UUID := gen_random_uuid();

  -- Variáveis auxiliares para categorias e contas do Usuário A
  v_cat_a_salario     INTEGER;
  v_cat_a_rendimentos INTEGER;
  v_cat_a_freelance   INTEGER;
  v_cat_a_moradia     INTEGER;
  v_cat_a_alimentacao INTEGER;
  v_cat_a_mobilidade  INTEGER;
  v_cat_a_lazer       INTEGER;
  v_cat_a_saude       INTEGER;
  v_cat_a_educacao    INTEGER;

  v_fonte_a_bb        INTEGER;
  v_fonte_a_poupanca  INTEGER;
  v_fonte_a_renda     INTEGER;
  v_fonte_a_nubank    INTEGER;
  v_fonte_a_visa      INTEGER;

  -- Variáveis auxiliares para o Usuário B
  v_cat_b_salario     INTEGER;
  v_cat_b_moradia     INTEGER;
  v_cat_b_alimentacao INTEGER;
  v_cat_b_educacao    INTEGER;

  v_fonte_b_bb        INTEGER;
  v_fonte_b_nubank    INTEGER;
BEGIN
  -- Recupera os IDs dos dois usuários
  SELECT id INTO v_usuario_a_id FROM usuarios WHERE LOWER(email) = 'usuarioa@teste.com';
  SELECT id INTO v_usuario_b_id FROM usuarios WHERE LOWER(email) = 'usuariob@teste.com';

  -- ==========================================================================
  -- 2.1 Categorias padrão para Usuário A e Usuário B
  -- ==========================================================================
  INSERT INTO categorias (usuario_id, nome, tipo)
  SELECT u_id, c.nome, c.tipo
  FROM UNNEST(ARRAY[v_usuario_a_id, v_usuario_b_id]) AS u_id
  CROSS JOIN (
    VALUES
      ('Salário',     'entrada'),
      ('Rendimentos', 'entrada'),
      ('Freelance',   'entrada'),
      ('Outros',      'entrada'),
      ('Moradia',     'saida'),
      ('Alimentação', 'saida'),
      ('Mobilidade',  'saida'),
      ('Lazer',       'saida'),
      ('Saúde',       'saida'),
      ('Educação',    'saida')
  ) AS c(nome, tipo)
  ON CONFLICT DO NOTHING;

  -- ==========================================================================
  -- 2.2 Fontes e Destinos para Usuário A e Usuário B
  -- ==========================================================================
  INSERT INTO fontes_destinos (usuario_id, nome, tipo, dia_fechamento, dia_vencimento, limite)
  SELECT u_id, f.nome, f.tipo, f.dia_fechamento, f.dia_vencimento, f.limite
  FROM UNNEST(ARRAY[v_usuario_a_id, v_usuario_b_id]) AS u_id
  CROSS JOIN (
    VALUES
      ('Conta Corrente Banco do Brasil', 'conta',          NULL::SMALLINT, NULL::SMALLINT, NULL::NUMERIC(12,2)),
      ('Poupança Caixa',                 'conta',          NULL::SMALLINT, NULL::SMALLINT, NULL::NUMERIC(12,2)),
      ('Fonte Pagadora Freelance',       'renda',          NULL::SMALLINT, NULL::SMALLINT, NULL::NUMERIC(12,2)),
      ('Cartão Nubank',                  'cartao_credito', 3::SMALLINT,    10::SMALLINT,   3000.00::NUMERIC(12,2)),
      ('Cartão Visa',                    'cartao_credito', 25::SMALLINT,   5::SMALLINT,    5000.00::NUMERIC(12,2))
  ) AS f(nome, tipo, dia_fechamento, dia_vencimento, limite)
  ON CONFLICT DO NOTHING;

  -- ==========================================================================
  -- 2.3 Lançamentos do Usuário A (3 meses de histórico + parcelas futuras)
  -- ==========================================================================
  IF NOT EXISTS (SELECT 1 FROM lancamentos WHERE usuario_id = v_usuario_a_id) THEN
    SELECT id INTO v_cat_a_salario     FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'entrada' AND nome = 'Salário';
    SELECT id INTO v_cat_a_rendimentos FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'entrada' AND nome = 'Rendimentos';
    SELECT id INTO v_cat_a_freelance   FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'entrada' AND nome = 'Freelance';
    SELECT id INTO v_cat_a_moradia     FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'saida'   AND nome = 'Moradia';
    SELECT id INTO v_cat_a_alimentacao FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'saida'   AND nome = 'Alimentação';
    SELECT id INTO v_cat_a_mobilidade  FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'saida'   AND nome = 'Mobilidade';
    SELECT id INTO v_cat_a_lazer       FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'saida'   AND nome = 'Lazer';
    SELECT id INTO v_cat_a_saude       FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'saida'   AND nome = 'Saúde';
    SELECT id INTO v_cat_a_educacao    FROM categorias WHERE usuario_id = v_usuario_a_id AND tipo = 'saida'   AND nome = 'Educação';

    SELECT id INTO v_fonte_a_bb       FROM fontes_destinos WHERE usuario_id = v_usuario_a_id AND nome = 'Conta Corrente Banco do Brasil';
    SELECT id INTO v_fonte_a_poupanca FROM fontes_destinos WHERE usuario_id = v_usuario_a_id AND nome = 'Poupança Caixa';
    SELECT id INTO v_fonte_a_renda    FROM fontes_destinos WHERE usuario_id = v_usuario_a_id AND nome = 'Fonte Pagadora Freelance';
    SELECT id INTO v_fonte_a_nubank   FROM fontes_destinos WHERE usuario_id = v_usuario_a_id AND nome = 'Cartão Nubank';
    SELECT id INTO v_fonte_a_visa     FROM fontes_destinos WHERE usuario_id = v_usuario_a_id AND nome = 'Cartão Visa';

    -- Mês retrasado (M - 2)
    INSERT INTO lancamentos (usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id)
    VALUES
      (v_usuario_a_id, 'entrada', 'Salário mensal',                 5500.00, (v_mes_atual - INTERVAL '2 months')::date + 4,  v_cat_a_salario,     v_fonte_a_bb),
      (v_usuario_a_id, 'entrada', 'Rendimento poupança',              85.50, (v_mes_atual - INTERVAL '2 months')::date + 9,  v_cat_a_rendimentos, v_fonte_a_poupanca),
      (v_usuario_a_id, 'saida',   'Aluguel e condomínio',           1650.00, (v_mes_atual - INTERVAL '2 months')::date + 6,  v_cat_a_moradia,     v_fonte_a_bb),
      (v_usuario_a_id, 'saida',   'Supermercado do mês',             780.40, (v_mes_atual - INTERVAL '2 months')::date + 11, v_cat_a_alimentacao, v_fonte_a_bb),
      (v_usuario_a_id, 'saida',   'Combustível e transporte',        320.00, (v_mes_atual - INTERVAL '2 months')::date + 14, v_cat_a_mobilidade,  v_fonte_a_nubank),
      (v_usuario_a_id, 'saida',   'Cinema e jantar',                 190.00, (v_mes_atual - INTERVAL '2 months')::date + 19, v_cat_a_lazer,       v_fonte_a_nubank);

    -- Mês passado (M - 1) - valores variados para comparativo de relatórios (RF7/RF8)
    INSERT INTO lancamentos (usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id)
    VALUES
      (v_usuario_a_id, 'entrada', 'Salário mensal',                 5500.00, (v_mes_atual - INTERVAL '1 month')::date + 4,  v_cat_a_salario,     v_fonte_a_bb),
      (v_usuario_a_id, 'entrada', 'Projeto freelance site',         1200.00, (v_mes_atual - INTERVAL '1 month')::date + 14, v_cat_a_freelance,   v_fonte_a_renda),
      (v_usuario_a_id, 'entrada', 'Rendimento poupança',              92.30, (v_mes_atual - INTERVAL '1 month')::date + 9,  v_cat_a_rendimentos, v_fonte_a_poupanca),
      (v_usuario_a_id, 'saida',   'Aluguel e condomínio',           1650.00, (v_mes_atual - INTERVAL '1 month')::date + 6,  v_cat_a_moradia,     v_fonte_a_bb),
      (v_usuario_a_id, 'saida',   'Supermercado e feira',            910.00, (v_mes_atual - INTERVAL '1 month')::date + 12, v_cat_a_alimentacao, v_fonte_a_bb),
      (v_usuario_a_id, 'saida',   'Farmácia e consulta',             245.90, (v_mes_atual - INTERVAL '1 month')::date + 16, v_cat_a_saude,       v_fonte_a_nubank),
      (v_usuario_a_id, 'saida',   'Curso online Full Stack',         180.00, (v_mes_atual - INTERVAL '1 month')::date + 20, v_cat_a_educacao,    v_fonte_a_visa),
      (v_usuario_a_id, 'saida',   'Combustível e estacionamento',    290.00, (v_mes_atual - INTERVAL '1 month')::date + 21, v_cat_a_mobilidade,  v_fonte_a_bb);

    -- Mês atual (M)
    INSERT INTO lancamentos (usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id)
    VALUES
      (v_usuario_a_id, 'entrada', 'Salário mensal',                 5500.00, v_mes_atual + 4,  v_cat_a_salario,     v_fonte_a_bb),
      (v_usuario_a_id, 'entrada', 'Rendimento poupança',              98.10, v_mes_atual + 9,  v_cat_a_rendimentos, v_fonte_a_poupanca),
      (v_usuario_a_id, 'saida',   'Aluguel e condomínio',           1650.00, v_mes_atual + 6,  v_cat_a_moradia,     v_fonte_a_bb),
      (v_usuario_a_id, 'saida',   'Supermercado mensal',             845.20, v_mes_atual + 10, v_cat_a_alimentacao, v_fonte_a_bb),
      (v_usuario_a_id, 'saida',   'Show e lazer fim de semana',      260.00, v_mes_atual + 13, v_cat_a_lazer,       v_fonte_a_visa);

    -- Compra parcelada 1: 3x de R$ 100,00 (R$ 33,34 + R$ 33,33 + R$ 33,33) no Cartão Nubank
    -- Dia 2 (< fechamento dia 3): 1ª parcela entra na fatura do mês atual e próximas nos 2 meses seguintes
    INSERT INTO lancamentos (
      usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id,
      parcela_atual, total_parcelas, grupo_parcelamento
    )
    VALUES
      (v_usuario_a_id, 'saida', 'Fone Bluetooth (Parcela 1/3)', 33.34, v_mes_atual + 1,                             v_cat_a_lazer, v_fonte_a_nubank, 1, 3, v_grupo_nubank),
      (v_usuario_a_id, 'saida', 'Fone Bluetooth (Parcela 2/3)', 33.33, (v_mes_atual + INTERVAL '1 month')::date + 1,  v_cat_a_lazer, v_fonte_a_nubank, 2, 3, v_grupo_nubank),
      (v_usuario_a_id, 'saida', 'Fone Bluetooth (Parcela 3/3)', 33.33, (v_mes_atual + INTERVAL '2 months')::date + 1, v_cat_a_lazer, v_fonte_a_nubank, 3, 3, v_grupo_nubank);

    -- Compra parcelada 2: 4x de R$ 120,00 (R$ 480,00) no Cartão Visa (fechamento dia 25)
    -- Dia 26 (>= fechamento dia 25): compra feita no mês passado entra na fatura do mês atual (RF9)
    INSERT INTO lancamentos (
      usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id,
      parcela_atual, total_parcelas, grupo_parcelamento
    )
    VALUES
      (v_usuario_a_id, 'saida', 'Monitor 24" (Parcela 1/4)', 120.00, (v_mes_atual - INTERVAL '1 month')::date + 25,  v_cat_a_educacao, v_fonte_a_visa, 1, 4, v_grupo_visa),
      (v_usuario_a_id, 'saida', 'Monitor 24" (Parcela 2/4)', 120.00, v_mes_atual + 25,                              v_cat_a_educacao, v_fonte_a_visa, 2, 4, v_grupo_visa),
      (v_usuario_a_id, 'saida', 'Monitor 24" (Parcela 3/4)', 120.00, (v_mes_atual + INTERVAL '1 month')::date + 25,  v_cat_a_educacao, v_fonte_a_visa, 3, 4, v_grupo_visa),
      (v_usuario_a_id, 'saida', 'Monitor 24" (Parcela 4/4)', 120.00, (v_mes_atual + INTERVAL '2 months')::date + 25, v_cat_a_educacao, v_fonte_a_visa, 4, 4, v_grupo_visa);
  END IF;

  -- ==========================================================================
  -- 2.4 Lançamentos do Usuário B (para testar isolamento multi-inquilino - RF3)
  -- ==========================================================================
  IF NOT EXISTS (SELECT 1 FROM lancamentos WHERE usuario_id = v_usuario_b_id) THEN
    SELECT id INTO v_cat_b_salario     FROM categorias WHERE usuario_id = v_usuario_b_id AND tipo = 'entrada' AND nome = 'Salário';
    SELECT id INTO v_cat_b_moradia     FROM categorias WHERE usuario_id = v_usuario_b_id AND tipo = 'saida'   AND nome = 'Moradia';
    SELECT id INTO v_cat_b_alimentacao FROM categorias WHERE usuario_id = v_usuario_b_id AND tipo = 'saida'   AND nome = 'Alimentação';
    SELECT id INTO v_cat_b_educacao    FROM categorias WHERE usuario_id = v_usuario_b_id AND tipo = 'saida'   AND nome = 'Educação';

    SELECT id INTO v_fonte_b_bb     FROM fontes_destinos WHERE usuario_id = v_usuario_b_id AND nome = 'Conta Corrente Banco do Brasil';
    SELECT id INTO v_fonte_b_nubank FROM fontes_destinos WHERE usuario_id = v_usuario_b_id AND nome = 'Cartão Nubank';

    INSERT INTO lancamentos (usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id)
    VALUES
      (v_usuario_b_id, 'entrada', 'Salário Usuário B',        4200.00, (v_mes_atual - INTERVAL '1 month')::date + 4, v_cat_b_salario,     v_fonte_b_bb),
      (v_usuario_b_id, 'saida',   'Aluguel Usuário B',        1350.00, (v_mes_atual - INTERVAL '1 month')::date + 7, v_cat_b_moradia,     v_fonte_b_bb),
      (v_usuario_b_id, 'entrada', 'Salário Usuário B',        4200.00, v_mes_atual + 4,                              v_cat_b_salario,     v_fonte_b_bb),
      (v_usuario_b_id, 'saida',   'Aluguel Usuário B',        1350.00, v_mes_atual + 7,                              v_cat_b_moradia,     v_fonte_b_bb),
      (v_usuario_b_id, 'saida',   'Mercado Usuário B',         450.00, v_mes_atual + 11,                             v_cat_b_alimentacao, v_fonte_b_bb);

    INSERT INTO lancamentos (
      usuario_id, tipo, descricao, valor, data, categoria_id, fonte_destino_id,
      parcela_atual, total_parcelas, grupo_parcelamento
    )
    VALUES
      (v_usuario_b_id, 'saida', 'Livros Técnicos (Parcela 1/2)', 150.00, v_mes_atual + 1,                            v_cat_b_educacao, v_fonte_b_nubank, 1, 2, v_grupo_b),
      (v_usuario_b_id, 'saida', 'Livros Técnicos (Parcela 2/2)', 150.00, (v_mes_atual + INTERVAL '1 month')::date + 1, v_cat_b_educacao, v_fonte_b_nubank, 2, 2, v_grupo_b);
  END IF;
END $$;
