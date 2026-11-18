/**
 * ============================================================================
 * ARQUIVO: src/components/pages/FaturasPage.jsx
 * RESPONSABILIDADE: Previsão e acompanhamento de faturas de Cartão de Crédito (RF9).
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Layout from '../Layout.jsx';

export default function FaturasPage() {
  const [cartoes, setCartoes] = useState([]);
  const [cartaoSelecionadoId, setCartaoSelecionadoId] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarFaturas() {
      try {
        setCarregando(true);
        const res = await api.get('/relatorios/faturas?meses=4');
        const lista = res.data || [];
        setCartoes(lista);
        if (lista.length > 0 && !cartaoSelecionadoId) {
          setCartaoSelecionadoId(lista[0].cartaoId);
        }
      } catch (err) {
        console.error('Erro ao carregar faturas:', err);
      } finally {
        setCarregando(false);
      }
    }

    carregarFaturas();
  }, []);

  const cartaoAtual = cartoes.find((c) => c.cartaoId === cartaoSelecionadoId) || cartoes[0];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto text-white">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Faturas de Cartão</h1>
        <p className="text-slate-400 text-sm mt-1">
          Acompanhe o limite utilizado, faturas abertas e projeções dos próximos meses (RF9)
        </p>
      </div>

      {carregando ? (
        <div className="text-center py-12 text-slate-400">Carregando dados dos cartões...</div>
      ) : cartoes.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl p-8">
          <p className="text-slate-400">Você ainda não possui cartões de crédito cadastrados.</p>
        </div>
      ) : (
        <div>
          {/* Seletor de Cartões */}
          <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
            {cartoes.map((c) => (
              <button
                key={c.cartaoId}
                onClick={() => setCartaoSelecionadoId(c.cartaoId)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                  c.cartaoId === cartaoAtual?.cartaoId
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                💳 {c.nomeCartao}
              </button>
            ))}
          </div>

          {cartaoAtual && (
            <div className="space-y-6">
              {/* Card de Limite do Cartão */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">{cartaoAtual.nomeCartao}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Limite Total:{' '}
                      <strong className="text-white">
                        {cartaoAtual.limiteTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Disponível para compras</span>
                    <h3 className="text-2xl font-extrabold text-emerald-400">
                      {cartaoAtual.limiteDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                  </div>
                </div>

                {/* Barra de Progresso do Limite */}
                <div className="w-full bg-slate-800 rounded-full h-3.5 mb-2 overflow-hidden border border-slate-700/50">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-red-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        cartaoAtual.limiteTotal > 0
                          ? (cartaoAtual.limiteComprometido / cartaoAtual.limiteTotal) * 100
                          : 0
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>
                    Utilizado:{' '}
                    <strong className="text-indigo-400">
                      {cartaoAtual.limiteComprometido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </span>
                  <span>
                    {cartaoAtual.limiteTotal > 0
                      ? `${Math.round((cartaoAtual.limiteComprometido / cartaoAtual.limiteTotal) * 100)}% consumido`
                      : '0%'}
                  </span>
                </div>
              </div>

              {/* Faturas Mensais */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-100">Cronograma de Faturas</h3>

                {cartaoAtual.faturas.length === 0 ? (
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400">
                    Nenhuma compra registrada para este cartão.
                  </div>
                ) : (
                  cartaoAtual.faturas.map((fat) => (
                    <div
                      key={fat.chave}
                      className="p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg hover:border-slate-700 transition"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                        <div>
                          <span className="text-lg font-bold text-slate-100">
                            Fatura de{' '}
                            {new Date(fat.ano, fat.mes - 1, 1).toLocaleDateString('pt-BR', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="ml-3 text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                            Vence dia {fat.diaVencimento}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block sm:inline mr-2">Total da Fatura:</span>
                          <strong className="text-xl font-bold text-indigo-400">
                            {fat.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </strong>
                        </div>
                      </div>

                      {/* Lista de Compras da Fatura */}
                      <div className="divide-y divide-slate-800/60">
                        {fat.itens.map((item) => (
                          <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium text-slate-200">{item.descricao}</p>
                              <span className="text-xs text-slate-500 font-mono">Data da compra: {item.data}</span>
                            </div>
                            <span className="font-semibold text-slate-100">
                              {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </Layout>
  );
}
