/**
 * ============================================================================
 * ARQUIVO: src/config/db.js
 * RESPONSABILIDADE: Gerenciamento do Pool de Conexões com o Banco Neon (PostgreSQL).
 * ============================================================================
 */

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis tanto de .env.local (gerado pelo Neon) quanto de .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const { Pool } = pg;

// Utiliza a URL com pooler como prioritária (recomendação Neon para web/Express)
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  console.warn('⚠️ AVISO: DATABASE_URL não definida nas variáveis de ambiente!');
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  // Conexão estabelecida com o cluster Neon
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente do pool Neon:', err.message);
});

export const query = (text, params) => pool.query(text, params);

export default {
  pool,
  query,
};
