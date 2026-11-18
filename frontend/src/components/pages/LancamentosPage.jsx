/**
 * ============================================================================
 * ARQUIVO: src/components/pages/LancamentosPage.jsx
 * RESPONSABILIDADE: Gestão completa de lançamentos e parcelamentos (RF6).
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Modal from '../Modal.jsx';

export default function LancamentosPage() {
  const [lancamentos, setLancamentos] = useState([]);
  const [fontes, setFontes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Estados de Paginação e Totais
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totais, setTotais] = useState({ totalEntradas: 0, totalSaidas: 0, saldo: 0 });

  // Estados dos Filtros
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  // Estados do Formulário de Criação
  const [tipo, setTipo] = useState('saida');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [fonteDestinoId, setFonteDestinoId] = useState('');
  const [categoriaId, setCategoriaId] = useState('1'); // Categoria padrão
  const [totalParcelas, setTotalParcelas] = useState('1');

  async function carregarDados() {
    try {
      setCarregando(true);
      const params = {
        pagina,
        limite: 10,
        tipo: filtroTipo || undefined,
        inicio: filtroDataInicio || undefined,
        fim: filtroDataFim || undefined,
      };

      const [resLancamentos, resFontes] = await Promise.all([
        api.get('/lancamentos', { params }),
        api.get('/fontes-destinos'),
      ]);

      setLancamentos(resLancamentos.data.lancamentos || []);
      setTotalPaginas(resLancamentos.data.paginacao?.totalPaginas || 1);
      setTotais(resLancamentos.data.totais || { totalEntradas: 0, totalSaidas: 0, saldo: 0 });
      setFontes(resFontes.data || []);

      if (resFontes.data.length > 0 && !fonteDestinoId) {
        setFonteDestinoId(String(resFontes.data[0].id));
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [pagina, filtroTipo, filtroDataInicio, filtroDataFim]);

  function abrirModal() {
    setTipo('saida');
    setDescricao('');
    setValor('');
    setData(new Date().toISOString().split('T')[0]);
    setTotalParcelas('1');
    setErro('');
    if (fontes.length > 0) setFonteDestinoId(String(fontes[0].id));
    setModalAberto(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      await api.post('/lancamentos', {
        tipo,
        descricao,
        valor: Number(valor),
        data,
        categoriaId: Number(categoriaId) || 1,
        fonteDestinoId: Number(fonteDestinoId),
        totalParcelas: tipo === 'saida' ? Number(totalParcelas) : 1,
      });

      setModalAberto(false);
      carregarDados();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar lançamento.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(lancamento) {
    let url = `/lancamentos/${lancamento.id}`;
    if (lancamento.grupo_parcelamento) {
      const excluirTodas = confirm(
        'Este lançamento faz parte de uma compra parcelada!\n\nClique em OK para excluir TODAS as parcelas desta compra, ou CANCELAR para excluir apenas esta parcela.'
      );
      if (excluirTodas) {
        url += '?todasParcelas=true';
      }
    } else {
      if (!confirm('Deseja realmente excluir este lançamento?')) return;
    }

    try {
      await api.delete(url);
      carregarDados();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir lançamento.');
    }
  }

  const fonteSelecionada = fontes.find((f) => String(f.id) === String(fonteDestinoId));
  const permiteParcelamento = tipo === 'saida' && fonteSelecionada?.tipo === 'cartao_credito';

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto text-white">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Extrato & Lançamentos</h1>
          <p className="text-slate-400 text-sm mt-1">Acompanhe suas receitas, despesas e compras parceladas</p>
        </div>
        <button
          onClick={abrirModal}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-lg text-slate-950 transition shadow-lg shadow-emerald-500/10"
        >
          + Novo Lançamento
        </button>
      </div>

      {/* Cards de Totais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-emerald-400 uppercase font-semibold">Total Entradas</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">
            {Number(totais.totalEntradas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-red-400 uppercase font-semibold">Total Saídas</span>
          <h3 className="text-2xl font-bold text-red-400 mt-1">
            {Number(totais.totalSaidas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 uppercase font-semibold">Saldo do Período</span>
          <h3
            className={`text-2xl font-bold mt-1 ${
              totais.saldo >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {Number(totais.saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Filtrar por Tipo</label>
          <select
            value={filtroTipo}
            onChange={(e) => {
              setFiltroTipo(e.target.value);
              setPagina(1);
            }}
            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
          >
            <option value="">Todos os Tipos</option>
            <option value="entrada">Apenas Entradas</option>
            <option value="saida">Apenas Saídas</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Data Início</label>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => {
              setFiltroDataInicio(e.target.value);
              setPagina(1);
            }}
            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Data Fim</label>
          <input
            type="date"
            value={filtroDataFim}
            onChange={(e) => {
              setFiltroDataFim(e.target.value);
              setPagina(1);
            }}
            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      {carregando ? (
        <div className="text-center py-12 text-slate-400">Carregando lançamentos...</div>
      ) : lancamentos.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400">
          Nenhum lançamento encontrado para os filtros selecionados.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900 shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Data</th>
                <th className="py-3.5 px-4">Descrição</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Conta / Cartão</th>
                <th className="py-3.5 px-4 text-right">Valor</th>
                <th className="py-3.5 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {lancamentos.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{item.data}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-100">
                    {item.descricao}
                    {item.total_parcelas > 1 && (
                      <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                        {item.parcela_atual}/{item.total_parcelas}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.categoria_nome}</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.fonte_destino_nome}</td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold ${
                      item.tipo === 'entrada' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {item.tipo === 'entrada' ? '+' : '-'}{' '}
                    {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleExcluir(item)}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Controles de Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={pagina <= 1}
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-sm text-slate-300 font-medium transition"
          >
            &larr; Anterior
          </button>
          <span className="text-sm text-slate-400">
            Página <strong className="text-white">{pagina}</strong> de {totalPaginas}
          </span>
          <button
            disabled={pagina >= totalPaginas}
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-sm text-slate-300 font-medium transition"
          >
            Próxima &rarr;
          </button>
        </div>
      )}

      {/* Modal de Criação de Lançamento */}
      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)} titulo="Novo Lançamento">
        {erro && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              >
                <option value="saida">Despesa (Saída)</option>
                <option value="entrada">Receita (Entrada)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Data</label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Descrição</label>
            <input
              type="text"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Supermercado, Salário, Internet"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 150.00"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Conta ou Cartão</label>
            <select
              value={fonteDestinoId}
              onChange={(e) => setFonteDestinoId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            >
              {fontes.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome} ({f.tipo.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Campo condicional de parcelamento no cartão */}
          {permiteParcelamento && (
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-lg">
              <label className="block text-xs font-medium text-indigo-300 mb-1">Parcelar no Cartão</label>
              <select
                value={totalParcelas}
                onChange={(e) => setTotalParcelas(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              >
                <option value="1">1x (À vista na fatura)</option>
                {[2, 3, 4, 5, 6, 10, 12, 18, 24].map((n) => (
                  <option key={n} value={n}>
                    {n}x de {valor ? (Number(valor) / n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : `R$ ...`}
                  </option>
                ))}
              </select>
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
  );
}
