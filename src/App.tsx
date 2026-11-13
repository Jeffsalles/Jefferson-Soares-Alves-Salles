import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  PROFILES,
  CLASSROOMS,
  INITIAL_STUDENTS,
  INITIAL_MESSAGES,
} from './data/mockData';
import type {
  UserProfile,
  SystemMessage,
  Student,
  Classroom,
  AuditLogEntry,
  TableSchemaInfo,
  SqlExecutionResult,
  GitInfoResponse,
} from './types';
import { calculateImpactMetrics } from './logic/sec-rules';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { DatabaseStudioView } from './components/DatabaseStudioView';
import { ComposeMessageModal } from './components/ComposeMessageModal';
import { MessageQueueView } from './components/MessageQueueView';
import { StudentsView } from './components/StudentsView';
import { ParentSimulatorView } from './components/ParentSimulatorView';
import { GitVersionControlView } from './components/GitVersionControlView';
import { DocumentationReportView } from './components/DocumentationReportView';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const rawTab = searchParams.get('tab') as ActiveTab | null;
  const validTabs: ActiveTab[] = [
    'dashboard',
    'database',
    'queue',
    'students',
    'simulator',
    'git',
    'report',
  ];
  const initialTab: ActiveTab =
    rawTab && validTabs.includes(rawTab) ? rawTab : 'dashboard';

  const [profiles, setProfiles] = useState<UserProfile[]>(PROFILES);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(PROFILES[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [messages, setMessages] = useState<SystemMessage[]>(INITIAL_MESSAGES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(CLASSROOMS);

  // Module 3: SQLite Schema, Audit & Git state
  const [schemaTables, setSchemaTables] = useState<TableSchemaInfo[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [sqlScripts, setSqlScripts] = useState({
    schemaSql: '',
    seedSql: '',
    dmlSql: '',
  });
  const [gitInfo, setGitInfo] = useState<GitInfoResponse | null>(null);

  // Compose modal state
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [preSelectedStudentId, setPreSelectedStudentId] = useState<string | undefined>(
    undefined
  );

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const showToast = useCallback(
    (text: string, type: 'success' | 'info' | 'error' = 'success') => {
      setToastMessage({ text, type });
      setTimeout(() => {
        setToastMessage(null);
      }, 4500);
    },
    []
  );

  const fetchBootstrap = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.profiles) && data.profiles.length > 0) {
        setProfiles(data.profiles);
        setCurrentProfile((prev) => {
          const matched = data.profiles.find((p: UserProfile) => p.id === prev.id);
          return matched || data.profiles[0];
        });
      }
      if (Array.isArray(data.classrooms)) setClassrooms(data.classrooms);
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      if (data.sqlScripts) setSqlScripts(data.sqlScripts);
    } catch {
      // Keep safe fallback state if backend is momentarily unreachable
    }
  }, []);

  const fetchGitInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/git/info');
      if (!res.ok) return;
      const data: GitInfoResponse = await res.json();
      setGitInfo(data);
    } catch {
      // Ignore transient network errors
    }
  }, []);

  useEffect(() => {
    fetchBootstrap();
    fetchGitInfo();
  }, [fetchBootstrap, fetchGitInfo]);

  // Metrics computation
  const sentMessagesCount = messages.filter((m) => m.status === 'enviada').length;
  const pendingMessagesCount = messages.filter((m) => m.status === 'pendente').length;

  const metrics = useMemo(() => {
    return calculateImpactMetrics(sentMessagesCount, pendingMessagesCount);
  }, [sentMessagesCount, pendingMessagesCount]);

  // Handlers backed by SQLite Express API
  const handleSendMessage = async (newMessage: SystemMessage) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao salvar comunicado no banco SQLite.', 'error');
        return;
      }
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);

      if (data.message?.status === 'pendente') {
        showToast(
          'Comunicado gravado no SQLite e retido na Fila de Validação para aprovação da Direção/Coordenação.',
          'info'
        );
        setActiveTab('queue');
      } else {
        showToast(
          'Comunicado persistido no banco de dados e disparado via broadcast aos responsáveis!',
          'success'
        );
        setActiveTab('simulator');
      }
    } catch {
      showToast('Falha de comunicação com o servidor SQLite.', 'error');
    }
  };

  const handleApproveMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(messageId)}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approverRole: currentProfile.papel,
          approverLabel: `${currentProfile.nome} (${currentProfile.cargo})`,
          actorName: currentProfile.nome,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Permissão negada ao aprovar comunicado.', 'error');
        return;
      }
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      showToast(
        `Comunicado aprovado por ${currentProfile.nome} e atualizado via SQL UPDATE!`,
        'success'
      );
    } catch {
      showToast('Erro de rede ao aprovar comunicado.', 'error');
    }
  };

  const handleRejectMessage = async (messageId: string, reason: string) => {
    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(messageId)}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          approverRole: currentProfile.papel,
          approverLabel: `${currentProfile.nome} (${currentProfile.cargo})`,
          actorName: currentProfile.nome,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao reprovar comunicado.', 'error');
        return;
      }
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      showToast('Comunicado reprovado no banco SQLite com justificativa registrada.', 'info');
    } catch {
      showToast('Erro de rede ao reprovar comunicado.', 'error');
    }
  };

  const handleToggleLGPD = async (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;
    const updatedConsent = !target.consentimentoLGPD;
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(studentId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: { consentimentoLGPD: updatedConsent },
          actorName: currentProfile.nome,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao atualizar termo LGPD.', 'error');
        return;
      }
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      showToast(
        updatedConsent
          ? `Termo LGPD de ${target.nome} validado (SQL UPDATE)!`
          : `Termo LGPD de ${target.nome} suspenso (envios bloqueados).`,
        updatedConsent ? 'success' : 'info'
      );
    } catch {
      showToast('Erro de rede ao atualizar LGPD.', 'error');
    }
  };

  const handleAddStudent = async (newStudent: Student) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: newStudent,
          actorName: currentProfile.nome,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao cadastrar aluno no SQLite.', 'error');
        return;
      }
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      showToast(
        `Aluno ${newStudent.nome} inserido via SQL INSERT com sucesso!`,
        'success'
      );
    } catch {
      showToast('Erro de rede ao cadastrar aluno.', 'error');
    }
  };

  const handleUpdateStudent = async (studentId: string, updates: Partial<Student>) => {
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(studentId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates,
          actorName: currentProfile.nome,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao atualizar aluno.', 'error');
        return;
      }
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      showToast('Cadastro atualizado via SQL UPDATE no SQLite!', 'success');
    } catch {
      showToast('Erro de rede ao atualizar cadastro.', 'error');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(studentId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorName: currentProfile.nome }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao remover aluno.', 'error');
        return;
      }
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      showToast('Registro removido via SQL DELETE e auditado na LGPD.', 'info');
    } catch {
      showToast('Erro de rede ao remover aluno.', 'error');
    }
  };

  const handleExecuteSql = async (sql: string): Promise<SqlExecutionResult> => {
    try {
      const res = await fetch('/api/sql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const data = await res.json();
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      return data.result;
    } catch {
      return {
        ok: false,
        kind: 'QUERY',
        statementType: 'SQL',
        columns: [],
        rows: [],
        changes: 0,
        lastInsertRowid: null,
        durationMs: 0,
        error: 'Falha ao conectar ao motor SQLite no servidor.',
      };
    }
  };

  const handleResetDatabase = async () => {
    try {
      const res = await fetch('/api/sql/reset', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao resetar banco de dados.', 'error');
        return;
      }
      if (Array.isArray(data.profiles)) setProfiles(data.profiles);
      if (Array.isArray(data.classrooms)) setClassrooms(data.classrooms);
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (Array.isArray(data.schemaTables)) setSchemaTables(data.schemaTables);
      showToast('Banco de dados SQLite restaurado para a carga inicial (02_seed.sql)!', 'info');
    } catch {
      showToast('Erro ao restaurar banco SQLite.', 'error');
    }
  };

  const handleOpenComposeToStudent = (studentId: string) => {
    setPreSelectedStudentId(studentId);
    setIsComposeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short print:hidden">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                : toastMessage.type === 'error'
                ? 'bg-rose-950 text-rose-200 border-rose-800'
                : 'bg-slate-950 text-blue-200 border-blue-800'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle
                className={`w-4 h-4 shrink-0 ${
                  toastMessage.type === 'error' ? 'text-rose-400' : 'text-blue-400'
                }`}
              />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Institutional Header */}
      <Header
        currentProfile={currentProfile}
        profiles={profiles}
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

        {activeTab === 'database' && (
          <DatabaseStudioView
            schemaTables={schemaTables}
            auditLogs={auditLogs}
            sqlScripts={sqlScripts}
            onExecuteSql={handleExecuteSql}
            onResetDatabase={handleResetDatabase}
          />
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
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {activeTab === 'simulator' && (
          <ParentSimulatorView
            students={students}
            messages={messages}
            classrooms={classrooms}
          />
        )}

        {activeTab === 'git' && (
          <GitVersionControlView gitInfo={gitInfo} onRefresh={fetchGitInfo} />
        )}

        {activeTab === 'report' && (
          <DocumentationReportView
            schemaTables={schemaTables}
            gitInfo={gitInfo}
            studentCount={students.length}
            messageCount={messages.length}
            auditLogsCount={auditLogs.length}
          />
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
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Sistema Escola Conectada (SEC)</span>
            <span>•</span>
            <span>Universidade Federal de Mato Grosso do Sul (UFMS Digital)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>
              Acadêmico: <strong>Jefferson Soares Alves Salles</strong>
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> LGPD 13.709/2018 • SQLite 3FN
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
