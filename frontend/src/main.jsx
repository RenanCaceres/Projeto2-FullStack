/**
 * ============================================================================
 * ARQUIVO: src/main.jsx
 * RESPONSABILIDADE: Ponto de entrada React que inicializa o aplicativo no DOM.
 * ============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
