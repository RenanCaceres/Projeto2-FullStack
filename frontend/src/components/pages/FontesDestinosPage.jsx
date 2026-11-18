/**
 * ============================================================================
 * ARQUIVO: src/components/pages/FontesDestinosPage.jsx
 * RESPONSABILIDADE: Gestão do CRUD de Fontes, Contas e Cartões de Crédito (RF5).
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Modal from '../Modal.jsx';
import Layout from '../Layout.jsx';

export default function FontesDestinosPage() {
  const [fontes, setFontes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('conta');
  const [diaFechamento, setDiaFechamento] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('');
  const [limite, setLimite] = useState('');

  // Busca dados na API
  async function carregarFontes() {
    try {
      setCarregando(true);
      const response = await api.get('/fontes-destinos');
      setFontes(response.data);
    } catch (err) {
      setErro('Erro ao carregar fontes e destinos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFontes();
  }, []);

  function abrirModalCriacao() {
    setItemEditando(null);
    setNome('');
    setTipo('conta');
    setDiaFechamento('');
    setDiaVencimento('');
    setLimite('');
    setErro('');
    setModalAberto(true);
  }

  function abrirModalEdicao(item) {
    setItemEditando(item);
    setNome(item.nome);
    setTipo(item.tipo);
    setDiaFechamento(item.dia_fechamento || '');
    setDiaVencimento(item.dia_vencimento || '');
    setLimite(item.limite || '');
    setErro('');
    setModalAberto(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      const payload = {
        nome,
        tipo,
        diaFechamento: tipo === 'cartao_credito' ? Number(diaFechamento) : null,
        diaVencimento: tipo === 'cartao_credito' ? Number(diaVencimento) : null,
        limite: tipo === 'cartao_credito' ? Number(limite) : null,
      };

      if (itemEditando) {
        await api.put(`/fontes-destinos/${itemEditando.id}`, payload);
      } else {
        await api.post('/fontes-destinos', payload);
      }

      setModalAberto(false);
      carregarFontes();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar os dados.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id) {
    if (!confirm('Deseja realmente excluir este registro?')) return;

    try {
      await api.delete(`/fontes-destinos/${id}`);
      carregarFontes();
    } catch (err) {
      alert(err.response?.data?.erro || 'Não foi possível excluir o registro.');
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Fontes & Destinos</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie suas contas bancárias, rendas e cartões de crédito</p>
        </div>
        <button
          onClick={abrirModalCriacao}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-lg text-slate-950 transition shadow-lg shadow-emerald-500/10"
        >
          + Nova Conta / Cartão
        </button>
      </div>

      {carregando ? (
        <div className="flex justify-center py-12">
          <p className="text-slate-400">Carregando dados...</p>
        </div>
      ) : fontes.length === 0 ? (
        <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-900/50 p-8">
          <p className="text-slate-400 mb-4">Nenhuma conta ou cartão cadastrado ainda.</p>
          <button
            onClick={abrirModalCriacao}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-lg text-slate-950 text-sm transition"
          >
            Cadastrar Primeiro Registro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fontes.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-xl border ${
                item.tipo === 'cartao_credito'
                  ? 'bg-slate-900 border-indigo-500/30 shadow-indigo-950/20'
                  : item.tipo === 'conta'
                  ? 'bg-slate-900 border-emerald-500/30'
                  : 'bg-slate-900 border-blue-500/30'
              } flex flex-col justify-between shadow-lg transition hover:border-slate-600`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full uppercase font-bold tracking-wider ${
                      item.tipo === 'cartao_credito'
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : item.tipo === 'conta'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {item.tipo === 'cartao_credito'
                      ? 'Cartão de Crédito'
                      : item.tipo === 'conta'
                      ? 'Conta / Carteira'
                      : 'Fonte de Renda'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => abrirModalEdicao(item)}
                      className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-100">{item.nome}</h3>

                {item.tipo === 'cartao_credito' && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Limite Total:</span>
                      <strong className="text-emerald-400">
                        {Number(item.limite).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Fechamento da Fatura:</span>
                      <span>Dia {item.dia_fechamento}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Vencimento da Fatura:</span>
                      <span>Dia {item.dia_vencimento}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Reutilizável de Cadastro e Edição */}
      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        titulo={itemEditando ? 'Editar Conta ou Cartão' : 'Cadastrar Conta ou Cartão'}
      >
        {erro && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Nubank, Banco do Brasil, Carteira Dinheiro"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
            <select
              value={tipo}
              disabled={!!itemEditando} // Tipo fixo após criado
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            >
              <option value="conta">Conta Bancária / Carteira</option>
              <option value="cartao_credito">Cartão de Crédito</option>
              <option value="renda">Fonte de Renda (Salário, Investimentos)</option>
            </select>
          </div>

          {/* Campos condicionais para Cartão de Crédito */}
          {tipo === 'cartao_credito' && (
            <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/60 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Limite Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={limite}
                  onChange={(e) => setLimite(e.target.value)}
                  placeholder="Ex: 3500.00"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Dia Fechamento (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={diaFechamento}
                    onChange={(e) => setDiaFechamento(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Dia Vencimento (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={diaVencimento}
                    onChange={(e) => setDiaVencimento(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalAberto(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-slate-950 text-sm font-semibold transition disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </Layout>
  );
}
