/**
 * ============================================================================
 * ARQUIVO: vite.config.js
 * RESPONSABILIDADE: Configuração da ferramenta de build e servidor de dev (Vite).
 * ============================================================================
 * 
 * O QUE DEVE SER FEITO NESTE ARQUIVO:
 * 1. Importar defineConfig do 'vite' e o plugin react do '@vitejs/plugin-react'.
 * 2. Exportar a configuração padrão contendo:
 *    - plugins: [react()]
 *    - server: { port: 5173, open: true }
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
});
