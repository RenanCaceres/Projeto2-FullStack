/**
 * Gestão do CRUD de Categorias de Entrada e Saída (RF4).
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import api from '../../services/api.js';
import Layout from '../Layout.jsx';

const inputClass =
  'w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition';

const ROTULO_TIPO = { entrada: 'Entrada', saida: 'Saída' };

// Diálogo simples e autocontido (sem depender do Modal compartilhado).
function Dialogo({ titulo, onFechar, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onFechar();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onFechar]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{titulo}</h2>
        {children}
      </div>
    </div>
  );
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('saida');
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [form, setForm] = useState({ nome: '', tipo: 'saida' });
  const [errosForm, setErrosForm] = useState({});
  const [erroGeralForm, setErroGeralForm] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [categoriaExcluindo, setCategoriaExcluindo] = useState(null);
  const [erroExclusao, setErroExclusao] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setErroLista('');
    try {
      const { data } = await api.get('/categorias');
      setCategorias(data.categorias);
    } catch (error) {
      setErroLista(error.response?.data?.erro || 'Não foi possível carregar as categorias.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const categoriasEntrada = categorias.filter((c) => c.tipo === 'entrada');
  const categoriasSaida = categorias.filter((c) => c.tipo === 'saida');
  const listaAtiva = abaAtiva === 'entrada' ? categoriasEntrada : categoriasSaida;

  function abrirCriacao() {
    setCategoriaEditando(null);
    setForm({ nome: '', tipo: abaAtiva });
    setErrosForm({});
    setErroGeralForm('');
    setModalAberto(true);
  }

  function abrirEdicao(categoria) {
    setCategoriaEditando(categoria);
    setForm({ nome: categoria.nome, tipo: categoria.tipo });
    setErrosForm({});
    setErroGeralForm('');
    setModalAberto(true);
  }

  async function salvar(e) {
    e.preventDefault();
    setErrosForm({});
    setErroGeralForm('');

    if (!form.nome.trim()) {
      setErrosForm({ nome: 'Nome é obrigatório.' });
      return;
    }

    setSalvando(true);
    try {
      if (categoriaEditando) await api.put(`/categorias/${categoriaEditando.id}`, form);
      else await api.post('/categorias', form);

      setModalAberto(false);
      setAbaAtiva(form.tipo);
      await carregar();
    } catch (error) {
      const data = error.response?.data;
      if (data?.campos) setErrosForm(data.campos);
      else setErroGeralForm(data?.erro || 'Não foi possível salvar a categoria.');
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    setErroExclusao('');
    setExcluindo(true);
    try {
      await api.delete(`/categorias/${categoriaExcluindo.id}`);
      setCategoriaExcluindo(null);
      await carregar();
    } catch (error) {
      setErroExclusao(
        error.response?.data?.erro || 'Não foi possível excluir a categoria. Tente novamente.'
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Categorias</h1>
          <button
            type="button"
            onClick={abrirCriacao}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg transition"
          >
            <Plus size={18} /> Nova categoria
          </button>
        </div>

        <div className="flex gap-2 mb-4 border-b border-slate-800">
          {['saida', 'entrada'].map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setAbaAtiva(tipo)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                abaAtiva === tipo
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {ROTULO_TIPO[tipo]}s (
              {tipo === 'entrada' ? categoriasEntrada.length : categoriasSaida.length})
            </button>
          ))}
        </div>

        {erroLista && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {erroLista}
          </div>
        )}

        {carregando ? (
          <p className="text-slate-400">Carregando...</p>
        ) : listaAtiva.length === 0 ? (
          <p className="text-slate-400">Nenhuma categoria de {ROTULO_TIPO[abaAtiva].toLowerCase()} cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {listaAtiva.map((categoria) => (
              <li
                key={categoria.id}
                className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
              >
                <span>{categoria.nome}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => abrirEdicao(categoria)}
                    aria-label={`Editar ${categoria.nome}`}
                    className="p-2 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setErroExclusao('');
                      setCategoriaExcluindo(categoria);
                    }}
                    aria-label={`Excluir ${categoria.nome}`}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalAberto && (
        <Dialogo
          titulo={categoriaEditando ? 'Editar categoria' : 'Nova categoria'}
          onFechar={() => setModalAberto(false)}
        >
          <form onSubmit={salvar} className="space-y-4" noValidate>
            {erroGeralForm && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {erroGeralForm}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
              <input
                type="text"
                value={form.nome}
                maxLength={50}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className={inputClass}
                autoFocus
              />
              {errosForm.nome && <p className="text-red-400 text-xs mt-1">{errosForm.nome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className={inputClass}
              >
                <option value="saida">Saída</option>
                <option value="entrada">Entrada</option>
              </select>
              {errosForm.tipo && <p className="text-red-400 text-xs mt-1">{errosForm.tipo}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold rounded-lg"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Dialogo>
      )}

      {categoriaExcluindo && (
        <Dialogo titulo="Excluir categoria" onFechar={() => setCategoriaExcluindo(null)}>
          <p className="text-slate-300 text-sm mb-4">
            Deseja realmente excluir a categoria <strong>{categoriaExcluindo.nome}</strong>?
          </p>

          {erroExclusao && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {erroExclusao}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCategoriaExcluindo(null)}
              className="px-4 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800"
            >
              {erroExclusao ? 'Fechar' : 'Cancelar'}
            </button>
            {!erroExclusao && (
              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={excluindo}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-lg"
              >
                {excluindo ? 'Excluindo...' : 'Excluir'}
              </button>
            )}
          </div>
        </Dialogo>
      )}
    </Layout>
  );
}
