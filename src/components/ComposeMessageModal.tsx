import React, { useState, useMemo } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  UserProfile, 
  Student, 
  Classroom, 
  MessageCategory, 
  UrgencyLevel, 
  DeliveryChannel,
  SystemMessage
} from '../types';
import { 
  canRoleAuthorCategory, 
  requiresHierarchicalApproval, 
  generateSecFormattedMessage, 
  validateStudentDispatch 
} from '../logic/sec-rules';

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  students: Student[];
  classrooms: Classroom[];
  onSendMessage: (newMessage: SystemMessage) => void;
  preSelectedStudentId?: string;
}

export const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  students,
  classrooms,
  onSendMessage,
  preSelectedStudentId,
}) => {
  if (!isOpen) return null;

  // Form states
  const [destinatarioTipo, setDestinatarioTipo] = useState<'individual' | 'turma' | 'escola_toda'>(
    preSelectedStudentId ? 'individual' : 'individual'
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>(preSelectedStudentId || students[0]?.id || '');
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>(classrooms[0]?.id || '');
  const [categoria, setCategoria] = useState<MessageCategory>(
    currentProfile.papel === 'secretaria' ? 'administrativa' : 'frequencia'
  );
  const [urgencia, setUrgencia] = useState<UrgencyLevel>('normal');
  const [canal, setCanal] = useState<DeliveryChannel>('whatsapp');
  const [assunto, setAssunto] = useState<string>('');
  const [conteudoCorpo, setConteudoCorpo] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cross-reference data
  const currentStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId),
    [students, selectedStudentId]
  );

  const currentClassroom = useMemo(() => {
    if (destinatarioTipo === 'individual' && currentStudent) {
      return classrooms.find((c) => c.id === currentStudent.turmaId);
    }
    return classrooms.find((c) => c.id === selectedClassroomId);
  }, [classrooms, destinatarioTipo, currentStudent, selectedClassroomId]);

  // Compute live injected header
  const formattedPreview = useMemo(() => {
    return generateSecFormattedMessage({
      escolaNome: 'EMEIEF Prof. José Antônio de Miranda',
      alunoNome: destinatarioTipo === 'individual' ? currentStudent?.nome : undefined,
      turmaNome: currentClassroom?.nome,
      sala: currentClassroom?.sala,
      turno: currentClassroom?.turno,
      professorRegenteNome: currentClassroom?.professorRegenteNome,
      assunto: assunto || '(Informe o assunto do comunicado)',
      conteudoCorpo: conteudoCorpo || '(Digite aqui o texto do aviso institucional...)',
      categoria,
      urgencia,
    });
  }, [destinatarioTipo, currentStudent, currentClassroom, assunto, conteudoCorpo, categoria, urgencia]);

  // LGPD validation
  const lgpdStatus = useMemo(() => {
    if (destinatarioTipo === 'individual') {
      return validateStudentDispatch(currentStudent);
    }
    return { valid: true };
  }, [destinatarioTipo, currentStudent]);

  // Available categories based on RBAC
  const categoriesList: { id: MessageCategory; label: string; docentOnly?: boolean; adminOnly?: boolean }[] = [
    { id: 'frequencia', label: 'Assiduidade & Frequência Acumulada', docentOnly: true },
    { id: 'reuniao', label: 'Reunião de Pais / Conselho', docentOnly: true },
    { id: 'indisciplina', label: 'Ocorrência Disciplinar / Atenção', docentOnly: true },
    { id: 'apresentacao', label: 'Apresentação & Evento Escolar', docentOnly: true },
    { id: 'demanda_particular', label: 'Demanda Particular do Aluno', docentOnly: true },
    { id: 'administrativa', label: 'Mensagem Administrativa (Secretaria)', adminOnly: true },
  ];

  const filteredCategories = categoriesList.filter((cat) => canRoleAuthorCategory(currentProfile.papel, cat.id));

  const isHierarchical = requiresHierarchicalApproval(currentProfile.papel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!assunto.trim()) {
      setErrorMessage('Por favor, preencha o assunto do comunicado.');
      return;
    }
    if (!conteudoCorpo.trim()) {
      setErrorMessage('Por favor, digite o conteúdo do comunicado.');
      return;
    }

    if (destinatarioTipo === 'individual' && !lgpdStatus.valid) {
      setErrorMessage(lgpdStatus.error || 'Impedimento de envio: cadastro incompleto ou sem consentimento LGPD.');
      return;
    }

    const calculatedDestinatarios = 
      destinatarioTipo === 'individual' ? 1 : 
      destinatarioTipo === 'turma' ? (currentClassroom?.numeroAlunos || 25) : 102;

    const newMessage: SystemMessage = {
      id: `msg-${Date.now()}`,
      autorId: currentProfile.id,
      autorNome: currentProfile.nome,
      autorPapel: currentProfile.papel,
      categoria,
      urgencia,
      canal,
      alunoId: destinatarioTipo === 'individual' ? currentStudent?.id : undefined,
      alunoNome: destinatarioTipo === 'individual' ? currentStudent?.nome : undefined,
      turmaId: currentClassroom?.id,
      turmaNome: currentClassroom?.nome,
      destinatarioTipo,
      assunto,
      conteudoCorpo,
      cabecalhoFormatado: formattedPreview.cabecalho,
      mensagemCompleta: formattedPreview.mensagemCompleta,
      status: isHierarchical ? 'pendente' : 'enviada',
      criadaEm: new Date().toISOString().replace('T', ' ').substring(0, 16),
      validadaPor: isHierarchical ? undefined : `${currentProfile.nome} (${currentProfile.cargo})`,
      validadaEm: isHierarchical ? undefined : new Date().toISOString().replace('T', ' ').substring(0, 16),
      destinatariosCount: calculatedDestinatarios,
      entreguesCount: isHierarchical ? 0 : calculatedDestinatarios,
      lidasCount: isHierarchical ? 0 : Math.round(calculatedDestinatarios * 0.95),
    };

    onSendMessage(newMessage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-modal-title"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 id="compose-modal-title" className="text-base font-bold text-white">
                Redigir Novo Comunicado Institucional
              </h2>
              <p className="text-xs text-slate-400">
                Injeção de cabeçalho padronizado e controle hierárquico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split in 2 columns (Form + Live Header Preview) */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Form: 7 cols */}
          <form id="compose-form" onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            {/* RBAC Notice banner */}
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              isHierarchical 
                ? 'bg-amber-50 border-amber-200 text-amber-900' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              {isHierarchical ? (
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block font-semibold">
                  {isHierarchical ? 'Atenção (Perfil Professor):' : 'Envio Direto Habilitado:'}
                </strong>
                <span>
                  {isHierarchical
                    ? 'Pelas regras do SEC, mensagens docentes não vão direto aos pais. Ficam retidas na Fila de Validação aguardando aprovação da Direção ou Coordenação.'
                    : `Você está autenticado como ${currentProfile.cargo} e possui permissão institucional para disparar mensagens sem validação prévia.`}
                </span>
              </div>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Destinatário Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tipo de Destinatário
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDestinatarioTipo('individual')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    destinatarioTipo === 'individual'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Individual (Aluno)
                </button>
                <button
                  type="button"
                  onClick={() => setDestinatarioTipo('turma')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    destinatarioTipo === 'turma'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Turma Inteira
                </button>
                <button
                  type="button"
                  onClick={() => setDestinatarioTipo('escola_toda')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    destinatarioTipo === 'escola_toda'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Toda a Escola (Geral)
                </button>
              </div>
            </div>

            {/* If Individual: Select Student */}
            {destinatarioTipo === 'individual' && (
              <div>
                <label htmlFor="student-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Selecione o Aluno (School+ / TecSystem)
                </label>
                <select
                  id="student-select"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.registroEscolar} — {s.nome} ({s.responsavelGrau}: {s.responsavelNome})
                    </option>
                  ))}
                </select>

                {/* LGPD validation info */}
                {currentStudent && (
                  <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                    currentStudent.consentimentoLGPD 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      {currentStudent.consentimentoLGPD ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                      )}
                      <span>
                        Resp: <strong>{currentStudent.responsavelNome}</strong> ({currentStudent.responsavelTelefone})
                      </span>
                    </div>
                    <span className="font-bold text-[11px]">
                      {currentStudent.consentimentoLGPD ? 'Consentimento LGPD OK' : 'SEM CONSENTIMENTO'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* If Turma: Select Classroom */}
            {destinatarioTipo === 'turma' && (
              <div>
                <label htmlFor="class-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Selecione a Turma
                </label>
                <select
                  id="class-select"
                  value={selectedClassroomId}
                  onChange={(e) => setSelectedClassroomId(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.sala}) — Turno {c.turno} ({c.numeroAlunos} alunos)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category & Urgency Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="category-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Categoria da Mensagem
                </label>
                <select
                  id="category-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as MessageCategory)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="urgency-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nível de Urgência
                </label>
                <select
                  id="urgency-select"
                  value={urgencia}
                  onChange={(e) => setUrgencia(e.target.value as UrgencyLevel)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="normal">Normal (Informativo rotineiro)</option>
                  <option value="alta">Alta (Reunião / Advertência)</option>
                  <option value="urgente">Urgente (Suspensão / Saúde)</option>
                </select>
              </div>
            </div>

            {/* Assunto Input */}
            <div>
              <label htmlFor="subject-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assunto do Comunicado
              </label>
              <input
                id="subject-input"
                type="text"
                placeholder="Ex: Convocação para Reunião de Pais e Mestres"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Conteudo Corpo Textarea */}
            <div>
              <label htmlFor="body-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Texto do Comunicado
              </label>
              <textarea
                id="body-input"
                rows={4}
                placeholder="Digite a mensagem institucional oficial de forma clara e objetiva..."
                value={conteudoCorpo}
                onChange={(e) => setConteudoCorpo(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                O cabeçalho institucional (escola, aluno, turma, professor) e o rodapé de unidirecionalidade serão inseridos automaticamente.
              </p>
            </div>
          </form>

          {/* Right Column: Live Injected Header Preview: 5 cols */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Pré-Visualização do Envio</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                WhatsApp Broadcast
              </span>
            </div>

            {/* Simulated WhatsApp Bubble */}
            <div className="bg-[#efeae2] p-3 sm:p-4 rounded-xl border border-slate-300 shadow-inner flex-1 flex flex-col justify-between">
              <div className="bg-white rounded-lg p-3.5 shadow-sm text-xs font-sans text-slate-800 space-y-2 border-l-4 border-l-blue-600">
                {/* Header Tag */}
                <div className="bg-slate-100 p-2.5 rounded-md border border-slate-200 text-[11px] space-y-0.5 font-mono text-slate-700">
                  <div className="font-bold text-blue-900">🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]</div>
                  {destinatarioTipo === 'individual' && currentStudent && (
                    <div>👤 Aluno(a): <span className="font-semibold text-slate-900">{currentStudent.nome}</span></div>
                  )}
                  {currentClassroom && (
                    <div>🏫 Turma: <span className="font-semibold text-slate-900">{currentClassroom.nome} ({currentClassroom.sala}) | Turno: {currentClassroom.turno}</span></div>
                  )}
                  {currentClassroom && (
                    <div>👨‍🏫 Prof. Regente: <span className="font-semibold text-slate-900">{currentClassroom.professorRegenteNome}</span></div>
                  )}
                  <div className="pt-1 text-slate-900 font-bold">
                    📌 Assunto: {urgencia === 'urgente' ? '🔴 [URGENTE] ' : urgencia === 'alta' ? '⚠️ [IMPORTANTE] ' : ''}
                    {assunto || '(Assunto do comunicado)'}
                  </div>
                </div>

                {/* Message Body */}
                <div className="py-2 text-slate-800 whitespace-pre-wrap leading-relaxed text-xs">
                  {conteudoCorpo || 'O corpo da mensagem aparecerá aqui conforme você digita no formulário...'}
                </div>

                {/* Unidirectional Footer */}
                <div className="border-t border-slate-100 pt-2 text-[10px] text-slate-500 italic">
                  🔒 *Canal oficial e unidirecional do SEC (UFMS Digital). Por favor, não responda a esta mensagem. Para dúvidas ou justificativas, contate a secretaria escolar.*
                </div>

                <div className="text-right text-[10px] text-slate-400 font-mono">
                  Hoje, 10:45 • Enviado ✓✓
                </div>
              </div>

              {/* Security info below preview */}
              <div className="mt-3 text-[11px] text-slate-500 bg-white/70 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Por que o cabeçalho é obrigatório?</span>
                </div>
                <p>
                  No diagnóstico de campo, comprovou-se que comunicados genéricos se perdem entre notificações pessoais. O cabeçalho garante identificação imediata e legitimidade perante as famílias.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            form="compose-form"
            type="submit"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all active:scale-95 cursor-pointer ${
              isHierarchical
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {isHierarchical
                ? 'Submeter para Validação Hierárquica'
                : 'Disparar Comunicado Imediatamente'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
