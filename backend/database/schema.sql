-- ============================================================================
-- ARQUIVO: database/schema.sql
-- RESPONSABILIDADE: Script DDL de criação e modelagem do banco de dados (PostgreSQL / Neon).
-- ============================================================================

-- 1. Criação da tabela de Usuários (RF1)
CREATE TABLE IF NOT EXISTS usuarios (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL,
  cpf         VARCHAR(11)  NOT NULL,
  senha_hash  VARCHAR(255) NOT NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email_lower ON usuarios (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios (cpf);

-- 2. Criação da tabela de Categorias (RF4)
CREATE TABLE IF NOT EXISTS categorias (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome        VARCHAR(50) NOT NULL,
  tipo        VARCHAR(7)  NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  CONSTRAINT uq_categoria_usuario_tipo_nome UNIQUE (usuario_id, tipo, nome)
);

-- 3. Criação da tabela de Fontes e Destinos (RF5)
CREATE TABLE IF NOT EXISTS fontes_destinos (
  id              SERIAL PRIMARY KEY,
  usuario_id      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome            VARCHAR(50) NOT NULL,
  tipo            VARCHAR(15) NOT NULL CHECK (tipo IN ('renda', 'conta', 'cartao_credito')),
  dia_fechamento  SMALLINT CHECK (dia_fechamento BETWEEN 1 AND 31),
  dia_vencimento  SMALLINT CHECK (dia_vencimento BETWEEN 1 AND 31),
  limite          NUMERIC(12, 2) CHECK (limite >= 0),
  CONSTRAINT uq_fonte_destino_usuario_nome UNIQUE (usuario_id, nome)
);

-- 4. Criação da tabela de Lançamentos e Parcelamentos (RF6)
CREATE TABLE IF NOT EXISTS lancamentos (
  id                  SERIAL PRIMARY KEY,
  usuario_id          INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo                VARCHAR(7)     NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  descricao           VARCHAR(120)   NOT NULL,
  valor               NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
  data                DATE           NOT NULL,
  categoria_id        INTEGER NOT NULL REFERENCES categorias(id),
  fonte_destino_id    INTEGER NOT NULL REFERENCES fontes_destinos(id),
  parcela_atual       SMALLINT NOT NULL DEFAULT 1,
  total_parcelas      SMALLINT NOT NULL DEFAULT 1 CHECK (total_parcelas BETWEEN 1 AND 48),
  grupo_parcelamento  UUID,
  criado_em           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lancamentos_usuario_data ON lancamentos (usuario_id, data);
