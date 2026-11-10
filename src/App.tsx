import React, { useState, useMemo } from 'react';
import { 
  PROFILES, 
  CLASSROOMS, 
  INITIAL_STUDENTS, 
  INITIAL_MESSAGES 
} from './data/mockData';
import { 
  UserProfile, 
  SystemMessage, 
  Student, 
  Classroom 
} from './types';
import { calculateImpactMetrics } from './logic/sec-rules';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ComposeMessageModal } from './components/ComposeMessageModal';
import { MessageQueueView } from './components/MessageQueueView';
import { StudentsView } from './components/StudentsView';
import { ParentSimulatorView } from './components/ParentSimulatorView';
import { DocumentationReportView } from './components/DocumentationReportView';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Check URL params for quick tab navigation
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = (searchParams.get('tab') as ActiveTab) || 'dashboard';

  const [currentProfile, setCurrentProfile] = useState<UserProfile>(PROFILES[0]); // Default: Direção
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [messages, setMessages] = useState<SystemMessage[]>(INITIAL_MESSAGES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [classrooms] = useState<Classroom[]>(CLASSROOMS);
  
  // Compose modal state
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [preSelectedStudentId, setPreSelectedStudentId] = useState<string | undefined>(undefined);
  
  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Metrics computation
  const sentMessagesCount = messages.filter((m) => m.status === 'enviada').length;
  const pendingMessagesCount = messages.filter((m) => m.status === 'pendente').length;
  
  const metrics = useMemo(() => {
    return calculateImpactMetrics(sentMessagesCount, pendingMessagesCount);
  }, [sentMessagesCount, pendingMessagesCount]);

  // Handlers
  const handleSendMessage = (newMessage: SystemMessage) => {
    setMessages((prev) => [newMessage, ...prev]);
    if (newMessage.status === 'pendente') {
      showToast('Comunicado submetido com sucesso! Retido na Fila de Validação para aprovação da Direção/Coordenação.', 'info');
      setActiveTab('queue');
    } else {
      showToast('Comunicado disparado instantaneamente via broadcast para os responsáveis!', 'success');
      setActiveTab('simulator');
    }
  };

  const handleApproveMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            status: 'enviada',
            validadaPor: `${currentProfile.nome} (${currentProfile.cargo})`,
            validadaEm: new Date().toISOString().replace('T', ' ').substring(0, 16),
            entreguesCount: m.destinatariosCount,
            lidasCount: Math.round(m.destinatariosCount * 0.95),
          };
        }
        return m;
      })
    );
    showToast(`Comunicado aprovado por ${currentProfile.nome} e disparado com sucesso!`, 'success');
  };

  const handleRejectMessage = (messageId: string, reason: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            status: 'reprovada',
            justificativaRejeicao: reason,
            validadaPor: `${currentProfile.nome} (${currentProfile.cargo})`,
            validadaEm: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return m;
      })
    );
    showToast('Comunicado reprovado e devolvido ao autor com a justificativa.', 'info');
  };

  const handleToggleLGPD = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updatedConsent = !s.consentimentoLGPD;
          showToast(
            updatedConsent 
              ? `Termo LGPD de ${s.nome} validado com sucesso!` 
              : `Termo LGPD de ${s.nome} suspenso (envios bloqueados).`,
            updatedConsent ? 'success' : 'info'
          );
          return { ...s, consentimentoLGPD: updatedConsent };
        }
        return s;
      })
    );
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Aluno ${newStudent.nome} cadastrado com sucesso no School+!`, 'success');
  };

  const handleOpenComposeToStudent = (studentId: string) => {
    setPreSelectedStudentId(studentId);
    setIsComposeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-950 text-emerald-200 border-emerald-800' 
              : toastMessage.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-800'
              : 'bg-slate-950 text-blue-200 border-blue-800'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Institutional Header */}
      <Header
        currentProfile={currentProfile}
        onProfileChange={(profile) => {
          setCurrentProfile(profile);
          showToast(`Perfil alterado para: ${profile.cargo} (${profile.nome})`, 'info');
        }}
        pendingCount={pendingMessagesCount}
        onOpenCompose={() => {
          setPreSelectedStudentId(undefined);
          setIsComposeModalOpen(true);
        }}
      />

      {/* Tabs Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        pendingCount={pendingMessagesCount}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            metrics={metrics}
            messages={messages}
            currentProfile={currentProfile}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCompose={() => {
              setPreSelectedStudentId(undefined);
              setIsComposeModalOpen(true);
            }}
          />
        )}

        {activeTab === 'compose' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Emissão de Comunicado Institucional</h2>
            <p className="text-xs text-slate-500">
              Clique abaixo para abrir o compositor com injeção automática de metadados e validação por perfil RBAC:
            </p>
            <button
              onClick={() => {
                setPreSelectedStudentId(undefined);
                setIsComposeModalOpen(true);
              }}
              type="button"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              Abrir Compositor de Comunicados
            </button>
          </div>
        )}

        {activeTab === 'queue' && (
          <MessageQueueView
            messages={messages}
            currentProfile={currentProfile}
            onApprove={handleApproveMessage}
            onReject={handleRejectMessage}
            onOpenCompose={() => {
              setPreSelectedStudentId(undefined);
              setIsComposeModalOpen(true);
            }}
          />
        )}

        {activeTab === 'students' && (
          <StudentsView
            students={students}
            classrooms={classrooms}
            currentProfile={currentProfile}
            onComposeToStudent={handleOpenComposeToStudent}
            onToggleLGPD={handleToggleLGPD}
            onAddStudent={handleAddStudent}
          />
        )}

        {activeTab === 'simulator' && (
          <ParentSimulatorView
            students={students}
            messages={messages}
            classrooms={classrooms}
          />
        )}

        {activeTab === 'report' && (
          <DocumentationReportView />
        )}
      </main>

      {/* Compose Message Modal */}
      <ComposeMessageModal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        currentProfile={currentProfile}
        students={students}
        classrooms={classrooms}
        onSendMessage={handleSendMessage}
        preSelectedStudentId={preSelectedStudentId}
      />

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Sistema Escola Conectada (SEC)</span>
            <span>•</span>
            <span>Universidade Federal de Mato Grosso do Sul (UFMS Digital)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Acadêmico: <strong>Jefferson Soares Alves Salles</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> LGPD 13.709/2018
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
