/**
 * Painel analítico de gastos por categoria (RF7) e por fontes/destinos (RF8).
 * Integrado: Pedro Larini & Renan Cáceres
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import api from '../../services/api.js';
import Layout from '../Layout.jsx';
import GraficoCategorias from '../GraficoCategorias.jsx';
import GraficoFontes from '../GraficoFontes.jsx';

const ABAS = [
  { id: 'categorias', rotulo: 'Por categoria' },
  { id: 'fontes', rotulo: 'Por contas e cartões' },
];

const inputClass =
  'px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition';

const formatarMoeda = (valor) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ---- datas (sempre no fuso local, formato YYYY-MM-DD) ----
const paraISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const deISO = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
};

function periodoDoMes(deslocamento = 0) {
  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth() + deslocamento, 1);
  const fim = new Date(hoje.getFullYear(), hoje.getMonth() + deslocamento + 1, 0);
  return { inicio: paraISO(inicio), fim: paraISO(fim) };
}

// Período imediatamente anterior, com o mesmo número de dias.
function periodoAnterior(inicio, fim) {
  const ini = deISO(inicio);
  const f = deISO(fim);
  const dias = Math.round((f - ini) / 86400000) + 1;
  const fimAnterior = new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() - 1);
  const inicioAnterior = new Date(
    fimAnterior.getFullYear(),
    fimAnterior.getMonth(),
    fimAnterior.getDate() - (dias - 1)
  );
  return { inicio: paraISO(inicioAnterior), fim: paraISO(fimAnterior) };
}

function somenteSaidas(resposta) {
  return (resposta?.categorias ?? []).filter((c) => c.categoria_tipo === 'saida');
}

function montarLinhas(atuais, anteriores) {
  const totalGeral = atuais.reduce((acc, c) => acc + c.total, 0);
  const mapaAnterior = new Map(anteriores.map((c) => [c.categoria_id, c.total]));

  return atuais.map((c) => {
    const totalAnterior = mapaAnterior.get(c.categoria_id) ?? 0;
    let variacao = null; // null = sem base de comparação
    if (totalAnterior > 0) variacao = ((c.total - totalAnterior) / totalAnterior) * 100;

    return {
      id: c.categoria_id,
      nome: c.categoria_nome,
      total: c.total,
      totalAnterior,
      percentual: totalGeral > 0 ? Number(((c.total / totalGeral) * 100).toFixed(1)) : 0,
      variacao,
    };
  });
}

function Variacao({ linha }) {
  if (linha.variacao === null) {
    return <span className="text-slate-500 text-xs">Sem dados no período anterior</span>;
  }
  const v = linha.variacao;
  if (Math.abs(v) < 0.05) {
    return (
      <span className="inline-flex items-center gap-1 text-slate-400">
        <Minus size={14} /> 0,0%
      </span>
    );
  }
  // Para despesas: subir é ruim (vermelho), cair é bom (verde).
  const subiu = v > 0;
  const Icone = subiu ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 ${subiu ? 'text-red-400' : 'text-emerald-400'}`}>
      <Icone size={14} />
      {subiu ? '+' : ''}
      {v.toFixed(1).replace('.', ',')}%
    </span>
  );
}

export default function RelatoriosPage() {
  const [abaAtiva, setAbaAtiva] = useState('categorias');
  const [modoPeriodo, setModoPeriodo] = useState('mes_atual');
  const [intervalo, setIntervalo] = useState(periodoDoMes(0));
  const [linhas, setLinhas] = useState([]);
  const [linhasFontes, setLinhasFontes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  function escolherModo(modo) {
    setModoPeriodo(modo);
    if (modo === 'mes_atual') setIntervalo(periodoDoMes(0));
    if (modo === 'mes_anterior') setIntervalo(periodoDoMes(-1));
  }

  const carregar = useCallback(async () => {
    const { inicio, fim } = intervalo;
    if (!inicio || !fim) return;
    if (inicio > fim) {
      setErro('A data inicial não pode ser posterior à data final.');
      setLinhas([]);
      setLinhasFontes([]);
      setCarregando(false);
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      if (abaAtiva === 'categorias') {
        const anterior = periodoAnterior(inicio, fim);
        const [atual, passado] = await Promise.all([
          api.get('/relatorios/categorias', { params: { inicio, fim } }),
          api.get('/relatorios/categorias', { params: { inicio: anterior.inicio, fim: anterior.fim } }),
        ]);
        setLinhas(montarLinhas(somenteSaidas(atual.data), somenteSaidas(passado.data)));
      } else {
        const resFontes = await api.get('/relatorios/fontes-destinos', { params: { inicio, fim } });
        setLinhasFontes(resFontes.data || []);
      }
    } catch (e) {
      setErro(e.response?.data?.erro || 'Não foi possível carregar o relatório.');
      setLinhas([]);
      setLinhasFontes([]);
    } finally {
      setCarregando(false);
    }
  }, [intervalo, abaAtiva]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const totalSaidas = useMemo(() => linhas.reduce((acc, l) => acc + l.total, 0), [linhas]);
  const totalAnterior = useMemo(() => linhas.reduce((acc, l) => acc + l.totalAnterior, 0), [linhas]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Relatórios</h1>

        <div className="flex gap-2 mb-6 border-b border-slate-800">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              type="button"
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                abaAtiva === aba.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {aba.rotulo}
            </button>
          ))}
        </div>

        {/* Controles de Filtro de Período Compartilhados */}
        <div className="flex flex-wrap items-end gap-3 mb-6">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Período</label>
            <select
              value={modoPeriodo}
              onChange={(e) => escolherModo(e.target.value)}
              className={inputClass}
            >
              <option value="mes_atual">Mês atual</option>
              <option value="mes_anterior">Mês anterior</option>
              <option value="custom">Intervalo personalizado</option>
            </select>
          </div>

          {modoPeriodo === 'custom' && (
            <>
              <div>
                <label className="block text-xs text-slate-400 mb-1">De</label>
                <input
                  type="date"
                  value={intervalo.inicio}
                  onChange={(e) => setIntervalo({ ...intervalo, inicio: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Até</label>
                <input
                  type="date"
                  value={intervalo.fim}
                  onChange={(e) => setIntervalo({ ...intervalo, fim: e.target.value })}
                  className={inputClass}
                />
              </div>
            </>
          )}
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-slate-400">Carregando...</p>
        ) : abaAtiva === 'categorias' ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h2 className="font-semibold mb-1">Saídas por categoria</h2>
              <p className="text-sm text-slate-400 mb-2">
                Total no período: <strong className="text-white">{formatarMoeda(totalSaidas)}</strong>
              </p>
              <GraficoCategorias dados={linhas} />
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
              <h2 className="font-semibold mb-3">Detalhamento e comparativo</h2>
              {linhas.length === 0 ? (
                <p className="text-slate-400 text-sm">Nenhuma saída registrada neste período.</p>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="py-2">Categoria</th>
                      <th className="py-2 text-right pr-2">Total</th>
                      <th className="py-2 text-right pr-2">%</th>
                      <th className="py-2 text-right">Variação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {linhas.map((linha) => (
                      <tr key={linha.id}>
                        <td className="py-2 font-medium">{linha.nome}</td>
                        <td className="py-2 pr-2 text-right">{formatarMoeda(linha.total)}</td>
                        <td className="py-2 pr-2 text-right">
                          {String(linha.percentual).replace('.', ',')}%
                        </td>
                        <td className="py-2 text-right">
                          <Variacao linha={linha} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {linhas.length > 0 && (
                <p className="text-xs text-slate-500 mt-3">
                  Período anterior (mesma duração), apenas nas categorias com saída agora:{' '}
                  {formatarMoeda(totalAnterior)}
                </p>
              )}
            </section>
          </div>
        ) : (
          /* Aba: Fontes e Destinos (RF8) */
          <div className="space-y-6">
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h2 className="font-semibold mb-1">Entradas e Saídas por Conta / Cartão</h2>
              <p className="text-sm text-slate-400 mb-4">
                Comparativo direto de movimentações em cada fonte cadastrada (RF8)
              </p>
              <GraficoFontes dados={linhasFontes} />
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
              <h2 className="font-semibold mb-3">Detalhamento por Conta / Cartão</h2>
              {linhasFontes.length === 0 ? (
                <p className="text-slate-400 text-sm">Nenhum dado encontrado para o período.</p>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="py-2">Conta / Cartão</th>
                      <th className="py-2">Tipo</th>
                      <th className="py-2 text-right">Entradas</th>
                      <th className="py-2 text-right">Saídas</th>
                      <th className="py-2 text-right">Saldo Período</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {linhasFontes.map((f) => (
                      <tr key={f.id}>
                        <td className="py-2 font-medium">{f.nome}</td>
                        <td className="py-2 text-slate-400 capitalize">{f.tipo?.replace('_', ' ')}</td>
                        <td className="py-2 text-right text-emerald-400">{formatarMoeda(f.entradas)}</td>
                        <td className="py-2 text-right text-red-400">{formatarMoeda(f.saidas)}</td>
                        <td className={`py-2 text-right font-semibold ${f.saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formatarMoeda(f.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
}
