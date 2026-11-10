import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Send, 
  ShieldAlert, 
  Eye, 
  Check, 
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { SystemMessage, UserProfile } from '../types';
import { canRoleApproveMessages } from '../logic/sec-rules';

interface MessageQueueViewProps {
  messages: SystemMessage[];
  currentProfile: UserProfile;
  onApprove: (messageId: string) => void;
  onReject: (messageId: string, reason: string) => void;
  onOpenCompose: () => void;
}

export const MessageQueueView: React.FC<MessageQueueViewProps> = ({
  messages,
  currentProfile,
  onApprove,
  onReject,
  onOpenCompose,
}) => {
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'enviada' | 'reprovada'>('pendente');
  const [selectedMessage, setSelectedMessage] = useState<SystemMessage | null>(null);
  const [rejectionModalMsg, setRejectionModalMsg] = useState<SystemMessage | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const canApprove = canRoleApproveMessages(currentProfile.papel);

  const filteredMessages = messages.filter((m) => {
    if (filter === 'todos') return true;
    return m.status === filter;
  });

  const pendingCount = messages.filter((m) => m.status === 'pendente').length;

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalMsg || !rejectionReason.trim()) return;
    onReject(rejectionModalMsg.id, rejectionReason.trim());
    setRejectionModalMsg(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Fila de Validação Hierárquica
            </h2>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Garantia da qualidade institucional: mensagens do corpo docente passam por análise prévia antes do disparo
          </p>
        </div>

        {/* Status of current user authority */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
            canApprove 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {canApprove ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Perfil Autorizado para Aprovação ({currentProfile.cargo})</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Somente Leitura: Aprovação restrita à Direção/Coordenação</span>
              </>
            )}
          </div>

          <button
            onClick={onOpenCompose}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nova Mensagem</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs w-fit">
        <button
          type="button"
          onClick={() => setFilter('pendente')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            filter === 'pendente'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Aguardando Aprovação ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('enviada')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            filter === 'enviada'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Aprovadas & Enviadas ({messages.filter((m) => m.status === 'enviada').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('reprovada')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            filter === 'reprovada'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Reprovadas ({messages.filter((m) => m.status === 'reprovada').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('todos')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            filter === 'todos'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todas ({messages.length})
        </button>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Nenhum comunicado com este status</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Quando professores registrarem mensagens com cunho de frequência, reunião ou indisciplina, elas serão retidas nesta fila para análise.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => {
            const isPending = msg.status === 'pendente';
            return (
              <div
                key={msg.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-3 flex-1">
                  {/* Category and Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {msg.categoria.replace('_', ' ')}
                    </span>
                    {msg.urgencia === 'urgente' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        🔴 Urgente
                      </span>
                    )}
                    {msg.urgencia === 'alta' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        ⚠️ Alta Urgência
                      </span>
                    )}
                    {msg.status === 'pendente' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        <Clock className="w-3 h-3" /> Aguardando Validação
                      </span>
                    )}
                    {msg.status === 'enviada' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Aprovada e Disparada
                      </span>
                    )}
                    {msg.status === 'reprovada' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-200">
                        <XCircle className="w-3 h-3" /> Reprovada
                      </span>
                    )}
                  </div>

                  {/* Title and Author Info */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{msg.assunto}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>Redigido por: <strong className="text-slate-700">{msg.autorNome}</strong> ({msg.autorPapel})</span>
                      <span>•</span>
                      <span>Criada em: {msg.criadaEm}</span>
                      {msg.validadaPor && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">Validada por: {msg.validadaPor}</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Body Preview */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-800 font-sans leading-relaxed">
                    <p className="line-clamp-2">{msg.conteudoCorpo}</p>
                  </div>

                  {/* If Rejected: Show Justification */}
                  {msg.justificativaRejeicao && (
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                      <strong className="block font-semibold">Motivo da Reprovação pela Coordenação/Direção:</strong>
                      <p>{msg.justificativaRejeicao}</p>
                    </div>
                  )}

                  {/* Meta tags (Destinatário, Turma, Professor) */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>
                      Destinatário: <strong className="text-slate-700">{msg.alunoNome || msg.turmaNome || 'Toda a Escola'}</strong>
                    </span>
                    <span>•</span>
                    <span>Canal: <strong className="text-slate-700 uppercase">{msg.canal}</strong></span>
                    {msg.status === 'enviada' && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">
                          Entregues: {msg.entreguesCount}/{msg.destinatariosCount}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => setSelectedMessage(msg)}
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Texto & Cabeçalho</span>
                  </button>

                  {isPending && canApprove && (
                    <>
                      <button
                        onClick={() => onApprove(msg.id)}
                        type="button"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar & Disparar</span>
                      </button>

                      <button
                        onClick={() => {
                          setRejectionModalMsg(msg);
                          setRejectionReason('');
                        }}
                        type="button"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reprovar...</span>
                      </button>
                    </>
                  )}

                  {isPending && !canApprove && (
                    <div className="text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-200 max-w-xs">
                      🔒 Aguardando decisão da Coordenação ou Direção. Você não tem permissão para aprovar o próprio envio.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: View Full Injected Message */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Visualização Completa do Comunicado</span>
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-[#efeae2] p-4 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.mensagemCompleta}
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                type="button"
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rejection Reason */}
      {rejectionModalMsg && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Justificativa da Reprovação</span>
              </h3>
              <button
                onClick={() => setRejectionModalMsg(null)}
                className="text-rose-200 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmReject} className="p-5 space-y-3">
              <p className="text-xs text-slate-600">
                Informe ao docente <strong>{rejectionModalMsg.autorNome}</strong> o motivo pelo qual este comunicado foi recusado para adequação:
              </p>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Favor ajustar a data do encontro e revisar o horário com a secretaria..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalMsg(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
                >
                  Confirmar Reprovação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
