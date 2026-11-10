import React from 'react';
import { 
  FileSpreadsheet, 
  Clock, 
  Coins, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  School,
  FileCheck
} from 'lucide-react';
import { SystemMessage, SystemMetrics, UserProfile } from '../types';

interface DashboardViewProps {
  metrics: SystemMetrics;
  messages: SystemMessage[];
  currentProfile: UserProfile;
  onNavigate: (tab: any) => void;
  onOpenCompose: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  messages,
  currentProfile,
  onNavigate,
  onOpenCompose,
}) => {
  const pendingMessages = messages.filter((m) => m.status === 'pendente');
  const sentMessages = messages.filter((m) => m.status === 'enviada');

  return (
    <div className="space-y-6">
      {/* Banner de boas-vindas com contexto da escola e do acadêmico */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>EMEIEF Professor José Antônio de Miranda — UFMS Digital 2026.2</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Painel de Comunicação Institucional Unidirecional
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Substituindo o fluxo manual de 2.000 folhas A4 coladas em agendas escolares por mensageria instantânea com injeção de cabeçalho padronizado e controle de acesso hierárquico (RBAC).
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Autenticado como: <strong className="text-white">{currentProfile.nome}</strong> ({currentProfile.cargo})
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-blue-300 font-mono">School+ & TecSystem Sincronizados</span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={onOpenCompose}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Novo Comunicado</span>
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Ver Celular dos Pais</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Cards Principais de Indicadores e Economia Extensionista */}
      <section aria-label="Indicadores de Desempenho e Sustentabilidade">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Papel Economizado */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Folhas A4 Poupadas</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {metrics.folhasEconomizadasMes.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> 100% de erradicação de papel em bilhetes
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Meta do diagnóstico in loco: 2.000 folhas/mês poupadas
              </p>
            </div>
          </div>

          {/* Card 2: Economia Financeira */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Economia em Insumos</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                R$ {metrics.custoEconomizadoReais},00
              </div>
              <p className="text-xs text-amber-700 font-semibold flex items-center gap-1 mt-1">
                Toner de alta capacidade + 4 resmas A4
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Redução de custos recorrentes nos cofres públicos
              </p>
            </div>
          </div>

          {/* Card 3: Tempo de Tramitação */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tempo de Envio</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-blue-600 tracking-tight">
                {metrics.tempoMedioEntregaSegundos}s
              </div>
              <p className="text-xs text-blue-700 font-semibold flex items-center gap-1 mt-1">
                Antes: 2 dias úteis de espera
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Transmissão em tempo real via WhatsApp Cloud API / SMS
              </p>
            </div>
          </div>

          {/* Card 4: Fila de Validação */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fila de Validação</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {pendingMessages.length}
              </div>
              <p className="text-xs text-purple-700 font-semibold flex items-center gap-1 mt-1">
                Mensagens docentes retidas
              </p>
              <button
                onClick={() => onNavigate('queue')}
                type="button"
                className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>Acessar Fila Hierárquica</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Comparativa: Fluxo Tradicional vs Solução Digital SEC */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <School className="w-5 h-5 text-blue-600" />
          <span>Comparativo do Diagnóstico Extensionista: Processo Físico vs SEC Digital</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lado A: Fluxo Arcaico */}
          <div className="p-5 rounded-xl bg-rose-50/60 border border-rose-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Fluxo Arcaico (Diagnosticado)</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-200 text-rose-900">48h de atraso</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-900">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">1.</span>
                <span>Digitação, redação manual e autorização impressa pela direção escolar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">2.</span>
                <span>Impressão em larga escala (2.000 folhas A4/mês) e corte manual dos bilhetes na guilhotina.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">3.</span>
                <span>Separação por turma, colagem individual em agendas pelos professores regentes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">4.</span>
                <span>Alunos perdem o papel, esquecem na mochila ou os pais não abrem a agenda física.</span>
              </li>
            </ul>
          </div>

          {/* Lado B: Solução SEC UFMS */}
          <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Solução SEC (UFMS Digital)</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-200 text-emerald-900">1.8s (Tempo Real)</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Integração automatizada com os bancos de dados legados School+ e TecSystem.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Injeção dinâmica de cabeçalho padronizado eliminando dispersão em apps de mensagens.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Trava hierárquica (RBAC): mensagens docentes passam obrigatoriamente por aprovação.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Disparo unidirecional via WhatsApp e SMS com 94.6% de taxa de abertura imediata.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comunicados Recentes & Estado do Sistema */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Últimos Comunicados Institucionais</h3>
            <p className="text-xs text-slate-500">Histórico de mensagens emitidas e em validação na escola</p>
          </div>
          <button
            onClick={() => onNavigate('queue')}
            type="button"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Fila Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Assunto / Metadados</th>
                <th className="py-3 px-4">Autor / Papel</th>
                <th className="py-3 px-4">Destinatário</th>
                <th className="py-3 px-4">Urgência</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {messages.slice(0, 5).map((msg) => (
                <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 line-clamp-1">{msg.assunto}</div>
                    <div className="text-[11px] text-slate-500 capitalize">{msg.categoria.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-800 font-semibold">{msg.autorNome}</span>
                    <div className="text-[10px] text-slate-400 capitalize">{msg.autorPapel}</div>
                  </td>
                  <td className="py-3 px-4">
                    {msg.alunoNome ? (
                      <span className="text-slate-700">{msg.alunoNome}</span>
                    ) : msg.turmaNome ? (
                      <span className="text-slate-700">{msg.turmaNome}</span>
                    ) : (
                      <span className="text-blue-700 font-bold">Toda a Escola</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {msg.urgencia === 'urgente' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Urgente
                      </span>
                    )}
                    {msg.urgencia === 'alta' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Alta
                      </span>
                    )}
                    {msg.urgencia === 'normal' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {msg.status === 'pendente' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3" /> Aguardando Validação
                      </span>
                    )}
                    {msg.status === 'enviada' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Enviada ({msg.entreguesCount}/{msg.destinatariosCount})
                      </span>
                    )}
                    {msg.status === 'reprovada' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Reprovada
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                    {msg.criadaEm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
