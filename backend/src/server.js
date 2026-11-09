/**
 * ============================================================================
 * ARQUIVO: src/server.js
 * RESPONSABILIDADE: Ponto de entrada do servidor Back-End (Node.js + Express).
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis do ambiente (.env.local da raiz e .env do backend)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Endpoint de verificação e teste de integração end-to-end com o Neon
app.get('/api/health', async (req, res) => {
  try {
    const startTime = Date.now();
    const result = await pool.query('SELECT NOW() as db_time, version() as db_version, current_database() as database_name;');
    const latencyMs = Date.now() - startTime;

    return res.status(200).json({
      status: 'ok',
      service: 'FinanFlow API',
      neon: {
        connected: true,
        latencyMs,
        database: result.rows[0].database_name,
        time: result.rows[0].db_time,
        version: result.rows[0].db_version,
        branch: process.env.NEON_BRANCH || 'production',
      },
    });
  } catch (error) {
    console.error('❌ Falha ao consultar o banco Neon:', error);
    return res.status(500).json({
      status: 'error',
      erro: 'Falha na conexão com o banco Neon PostgreSQL.',
      detalhes: error.message,
    });
  }
});

/**
 * ----------------------------------------------------------------------------
 * ROTAS DA APLICAÇÃO (A serem acopladas pelos integrantes conforme o PLANO.md)
 * ----------------------------------------------------------------------------
 * Exemplo:
 * import authRoutes from './routes/auth.routes.js';
 * import categoriasRoutes from './routes/categorias.routes.js';
 * ...
 * app.use('/api/auth', authRoutes);
 * app.use('/api/categorias', categoriasRoutes);
 */

const server = app.listen(PORT, async () => {
  console.log(`🚀 Servidor FinanFlow rodando na porta ${PORT}`);
  console.log(`📡 URL da API: http://localhost:${PORT}`);
  
  // Teste de conexão com o banco Neon na inicialização
  try {
    const res = await pool.query('SELECT NOW() as now, current_database() as db;');
    console.log(`✅ Conexão com Neon PostgreSQL estabelecida com sucesso! [Banco: ${res.rows[0].db}]`);
  } catch (err) {
    console.error('❌ Erro ao conectar ao Neon:', err.message);
  }
});

export { app, server };
export default app;
