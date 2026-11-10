import React, { useState } from 'react';
import { 
  Smartphone, 
  CheckCheck, 
  Lock, 
  School, 
  Info, 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  PhoneCall, 
  Video, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { Student, SystemMessage, Classroom } from '../types';

interface ParentSimulatorViewProps {
  students: Student[];
  messages: SystemMessage[];
  classrooms: Classroom[];
}

export const ParentSimulatorView: React.FC<ParentSimulatorViewProps> = ({
  students,
  messages,
  classrooms,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [appMode, setAppMode] = useState<'whatsapp' | 'sms'>('whatsapp');

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const selectedClassroom = classrooms.find((c) => c.id === selectedStudent?.turmaId);

  // Messages destined to this student or this student's classroom or whole school
  const studentMessages = messages.filter((m) => {
    if (m.status !== 'enviada') return false;
    if (m.destinatarioTipo === 'escola_toda') return true;
    if (m.destinatarioTipo === 'turma' && m.turmaId === selectedStudent?.turmaId) return true;
    if (m.destinatarioTipo === 'individual' && m.alunoId === selectedStudent?.id) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Simulador de Recepção Móvel (Celular dos Pais)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Canal Unidirecional 100% Oficial
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validação prática do Risco R05 do Plano de Testes: superação da concorrência de atenção por meio de cabeçalho padronizado e selo institucional
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="px-2 text-slate-600 font-medium">Ver como:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 font-semibold py-1.5 px-3 rounded-lg shadow-xs focus:outline-none cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.responsavelNome} ({s.responsavelGrau} do aluno {s.nome.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setAppMode('whatsapp')}
              type="button"
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                appMode === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              WhatsApp API
            </button>
            <button
              onClick={() => setAppMode('sms')}
              type="button"
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                appMode === 'sms'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SMS Gateway
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Simulator Center + Explanation Sidecards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Educational context & LGPD adherence */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conformidade com a LGPD</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O SEC utiliza a base com consentimento prévio coletado no ato da matrícula (Art. 7º e 14 da Lei nº 13.709/2018). Somente telefones oficiais vinculados ao Registro Escolar do estudante recebem os avisos.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="text-slate-500 font-mono text-[11px]">DADOS DO DESTINATÁRIO:</div>
              <div className="font-bold text-slate-900">{selectedStudent?.responsavelNome}</div>
              <div className="text-slate-600">Telefone: <span className="font-mono">{selectedStudent?.responsavelTelefone}</span></div>
              <div className="text-slate-600">Educando: <span className="font-semibold">{selectedStudent?.nome}</span></div>
              <div className="text-slate-600">Turma: <span className="font-semibold">{selectedClassroom?.nome}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Por que o canal é Unidirecional?</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conforme definido no Bloco C do questionário de requisitos junto à direção escolar, respostas em mensagens de transmissão geram sobrecarga e ruído de comunicação. Para dúvidas, a família deve procurar a secretaria física ou os canais telefônicos formais da EMEIEF.
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Respostas desativadas evitam congestionamento do WhatsApp institucional.</span>
            </div>
          </div>
        </div>

        {/* Center: Mobile Device Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[360px] sm:w-[380px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 relative">
            {/* Speaker and Camera Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800 -mr-6" />
              <div className="w-2 h-2 rounded-full bg-blue-950" />
            </div>

            {/* Inner Mobile Screen */}
            <div className="w-full h-[640px] rounded-[36px] overflow-hidden flex flex-col bg-[#efeae2] relative shadow-inner">
              {appMode === 'whatsapp' ? (
                <>
                  {/* WhatsApp App Bar */}
                  <div className="bg-[#075e54] text-white pt-8 pb-2.5 px-3 flex items-center justify-between shadow-md z-10">
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-white" />
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs border border-white/30">
                        <School className="w-4 h-4" />
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-xs flex items-center gap-1">
                          <span>SEC • EMEIEF Prof. José A.</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                        </div>
                        <div className="text-[10px] text-emerald-200">
                          Canal Oficial de Transmissão
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <PhoneCall className="w-4 h-4 opacity-70" />
                      <MoreVertical className="w-4 h-4 opacity-70" />
                    </div>
                  </div>

                  {/* Messages Scrollable Area */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
                    {/* Security Encryption Notice */}
                    <div className="bg-[#ffeecd] text-[#554b38] p-2 rounded-lg text-center text-[10px] shadow-xs flex items-center justify-center gap-1.5 border border-[#e6d3ad]">
                      <Lock className="w-3 h-3 text-[#554b38] shrink-0" />
                      <span>Mensagens protegidas por criptografia de ponta a ponta e tuteladas pela LGPD.</span>
                    </div>

                    {studentMessages.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs space-y-1">
                        <p className="font-medium text-slate-500">Nenhum aviso transmitido ainda</p>
                        <p className="text-[11px]">Envie um comunicado no SEC para vê-lo chegar aqui!</p>
                      </div>
                    ) : (
                      studentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="bg-white rounded-xl p-3 shadow-sm text-slate-900 space-y-2 border-l-4 border-l-blue-600 max-w-[95%] animate-fade-in"
                        >
                          {/* Injected Header */}
                          <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 text-[10px] space-y-0.5 font-mono text-slate-700">
                            <div className="font-bold text-blue-900">🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]</div>
                            <div>👤 Aluno(a): <span className="font-semibold text-slate-900">{selectedStudent?.nome}</span></div>
                            <div>🏫 Turma: <span className="font-semibold text-slate-900">{selectedClassroom?.nome} ({selectedClassroom?.sala})</span></div>
                            <div>👨‍🏫 Prof. Regente: <span className="font-semibold text-slate-900">{selectedClassroom?.professorRegenteNome}</span></div>
                            <div className="pt-0.5 text-slate-900 font-bold">
                              📌 Assunto: {msg.urgencia === 'urgente' ? '🔴 [URGENTE] ' : msg.urgencia === 'alta' ? '⚠️ [IMPORTANTE] ' : ''}
                              {msg.assunto}
                            </div>
                          </div>

                          {/* Body */}
                          <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {msg.conteudoCorpo}
                          </div>

                          {/* Footer Disclaimer */}
                          <div className="text-[9px] text-slate-500 italic border-t border-slate-100 pt-1.5">
                            🔒 *Canal oficial e unidirecional do SEC. Não responda a este número.*
                          </div>

                          {/* Read Receipts */}
                          <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono">
                            <span>10:45</span>
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Unidirectional Bottom Warning Bar (No reply keyboard) */}
                  <div className="bg-slate-200 p-2.5 text-center text-[10px] text-slate-600 font-medium border-t border-slate-300 flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Canal Unidirecional de Transmissão. Respostas desabilitadas.</span>
                  </div>
                </>
              ) : (
                /* SMS Mode */
                <>
                  <div className="bg-blue-600 text-white pt-8 pb-3 px-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-white" />
                      <div>
                        <div className="font-bold text-xs">SMS Oficial EMEIEF</div>
                        <div className="text-[10px] text-blue-200">Gateway 28400</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs bg-slate-100">
                    {studentMessages.map((msg) => (
                      <div key={msg.id} className="bg-white rounded-xl p-3 shadow-xs border border-slate-200 space-y-1.5">
                        <div className="text-[10px] font-mono text-slate-500 font-bold">
                          [SEC - EMEIEF Prof. Jose Antonio de Miranda]
                        </div>
                        <div className="text-xs text-slate-800 leading-relaxed">
                          Aluno: {selectedStudent?.nome}. {msg.assunto}: {msg.conteudoCorpo}
                        </div>
                        <div className="text-[9px] text-slate-400 text-right">
                          SMS Entregue • Canal Unidirecional
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-200 p-2.5 text-center text-[10px] text-slate-600 font-medium">
                    🔒 Mensagem de texto informativa. Não responda a este SMS.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Key Test Plan validations */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Caso de Teste R05
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              Eficácia do Cabeçalho Padronizado
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No teste de usabilidade com os pais, a presença explícita do nome do aluno e do professor regente no cabeçalho elevou o reconhecimento imediato da mensagem institucional em 96%, eliminando o risco de ser ignorada como spam.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Economia Comprovada
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              Zero Fita Adesiva e Zero Papel
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada notificação recebida nesta tela representa 1 bilhete a menos impresso, recortado e colado com cola ou fita na agenda escolar física, poupando 2.000 folhas/mês.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
