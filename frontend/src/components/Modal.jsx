/**
 * ============================================================================
 * ARQUIVO: src/components/Modal.jsx
 * RESPONSABILIDADE: Componente genérico e acessível de janela modal / diálogo.
 * ============================================================================
 */

import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, titulo, children }) {
  // Fecha o modal ao pressionar a tecla ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      {/* Clique no fundo escuro para fechar */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Caixa de Conteúdo */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-slate-100">{titulo}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold transition leading-none"
          >
            &times;
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
