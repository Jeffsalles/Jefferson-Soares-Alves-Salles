import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Send, 
  School, 
  Phone, 
  Mail, 
  Calendar,
  AlertTriangle,
  Database,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Student, Classroom, UserProfile } from '../types';

interface StudentsViewProps {
  students: Student[];
  classrooms: Classroom[];
  currentProfile: UserProfile;
  onComposeToStudent: (studentId: string) => void;
  onToggleLGPD: (studentId: string) => void;
  onAddStudent: (newStudent: Student) => Promise<void> | void;
  onUpdateStudent: (studentId: string, updates: Partial<Student>) => Promise<void> | void;
  onDeleteStudent: (studentId: string) => Promise<void> | void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classrooms,
  currentProfile,
  onComposeToStudent,
  onToggleLGPD,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurmaFilter, setSelectedTurmaFilter] = useState('todas');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // New / Edit student form states
  const [nome, setNome] = useState('');
  const [registroEscolar, setRegistroEscolar] = useState(`2026-0${Math.floor(100 + Math.random() * 900)}`);
  const [turmaId, setTurmaId] = useState(classrooms[0]?.id || '');
  const [responsavelNome, setResponsavelNome] = useState('');
  const [responsavelGrau, setResponsavelGrau] = useState<'Mãe' | 'Pai' | 'Avó' | 'Avô' | 'Tutor Legal'>('Mãe');
  const [responsavelTelefone, setResponsavelTelefone] = useState('(67) 99');
  const [responsavelEmail, setResponsavelEmail] = useState('');
  const [consentimentoLGPD, setConsentimentoLGPD] = useState(true);
  const [faltasInjustificadas, setFaltasInjustificadas] = useState(0);

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setNome(student.nome);
    setRegistroEscolar(student.registroEscolar);
    setTurmaId(student.turmaId);
    setResponsavelNome(student.responsavelNome);
    setResponsavelGrau(student.responsavelGrau);
    setResponsavelTelefone(student.responsavelTelefone);
    setResponsavelEmail(student.responsavelEmail);
    setConsentimentoLGPD(student.consentimentoLGPD);
    setFaltasInjustificadas(student.faltasInjustificadas);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !nome.trim() || !responsavelNome.trim()) return;
    await onUpdateStudent(editingStudent.id, {
      nome: nome.trim(),
      turmaId,
      responsavelNome: responsavelNome.trim(),
      responsavelGrau,
      responsavelTelefone: responsavelTelefone.trim(),
      responsavelEmail: responsavelEmail.trim(),
      consentimentoLGPD,
      faltasInjustificadas,
    });
    setEditingStudent(null);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.responsavelNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registroEscolar.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTurma = selectedTurmaFilter === 'todas' || s.turmaId === selectedTurmaFilter;
    return matchesSearch && matchesTurma;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !responsavelNome.trim()) return;

    const newStudent: Student = {
      id: `alu-${Date.now()}`,
      nome: nome.trim(),
      registroEscolar,
      turmaId,
      responsavelNome: responsavelNome.trim(),
      responsavelGrau,
      responsavelTelefone: responsavelTelefone.trim(),
      responsavelEmail: responsavelEmail.trim() || `${responsavelNome.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      consentimentoLGPD,
      dataMatricula: new Date().toISOString().split('T')[0],
      faltasInjustificadas: 0,
    };

    onAddStudent(newStudent);
    setIsAddModalOpen(false);
    setNome('');
    setResponsavelNome('');
    setRegistroEscolar(`2026-0${Math.floor(100 + Math.random() * 900)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Base de Alunos e Responsáveis
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Database className="w-3 h-3" /> Legados School+ e TecSystem
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Espelhamento de dados cadastrais, turmas, professores regentes e conformidade com a LGPD (Lei 13.709/2018)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar Aluno (Secretaria)</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome do aluno, responsável ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs text-slate-800"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedTurmaFilter}
            onChange={(e) => setSelectedTurmaFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs text-slate-800 font-medium cursor-pointer"
          >
            <option value="todas">Todas as Turmas (Fundamental I)</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} ({c.turno})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Matrícula / Aluno</th>
                <th className="py-3.5 px-4">Turma & Prof. Regente</th>
                <th className="py-3.5 px-4">Responsável Legal</th>
                <th className="py-3.5 px-4">Telefone (WhatsApp)</th>
                <th className="py-3.5 px-4">Assiduidade</th>
                <th className="py-3.5 px-4">LGPD Consentimento</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((student) => {
                const classroom = classrooms.find((c) => c.id === student.turmaId);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{student.nome}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Reg. {student.registroEscolar}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold">{classroom?.nome || 'Não vinculada'}</div>
                      <div className="text-[11px] text-slate-500">
                        Regente: {classroom?.professorRegenteNome || 'A definir'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold">{student.responsavelNome}</div>
                      <div className="text-[11px] text-slate-400">{student.responsavelGrau}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {student.responsavelTelefone}
                    </td>
                    <td className="py-3.5 px-4">
                      {student.faltasInjustificadas > 3 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> {student.faltasInjustificadas} faltas
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          {student.faltasInjustificadas} faltas
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleLGPD(student.id)}
                        title="Clique para alternar status do termo LGPD (para testes)"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          student.consentimentoLGPD
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {student.consentimentoLGPD ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Válido (Ativo)</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>Bloqueado (Pendente)</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(student)}
                          type="button"
                          aria-label={`Editar cadastro de ${student.nome}`}
                          title="Editar (SQL UPDATE)"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingStudent(student)}
                          type="button"
                          aria-label={`Remover cadastro de ${student.nome}`}
                          title="Remover (SQL DELETE)"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onComposeToStudent(student.id)}
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Send className="w-3 h-3 shrink-0" />
                          <span>Enviar Aviso</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Cadastrar Aluno */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>Cadastro de Aluno (Módulo Secretaria - School+)</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo do Aluno</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedro Henrique Silveira"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matrícula (Reg. Escolar)</label>
                  <input
                    type="text"
                    required
                    value={registroEscolar}
                    onChange={(e) => setRegistroEscolar(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Turma</label>
                  <select
                    value={turmaId}
                    onChange={(e) => setTurmaId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} ({c.turno})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Responsável Legal</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Luiza Silveira"
                    value={responsavelNome}
                    onChange={(e) => setResponsavelNome(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grau de Parentesco</label>
                  <select
                    value={responsavelGrau}
                    onChange={(e) => setResponsavelGrau(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mãe">Mãe</option>
                    <option value="Pai">Pai</option>
                    <option value="Avó">Avó</option>
                    <option value="Avô">Avô</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp do Responsável</label>
                  <input
                    type="text"
                    required
                    placeholder="(67) 99123-4567"
                    value={responsavelTelefone}
                    onChange={(e) => setResponsavelTelefone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={responsavelEmail}
                    onChange={(e) => setResponsavelEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentimentoLGPD}
                    onChange={(e) => setConsentimentoLGPD(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-semibold">
                    Termo de Consentimento LGPD assinado no ato da matrícula (Art. 7º e 14)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Aluno (SQL UPDATE) */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Pencil className="w-4 h-4 text-amber-400" />
                <span>Atualizar Registro (SQL UPDATE)</span>
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                type="button"
                aria-label="Fechar edição"
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo do Aluno</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Turma</label>
                  <select
                    value={turmaId}
                    onChange={(e) => setTurmaId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} ({c.turno})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faltas Injustificadas</label>
                  <input
                    type="number"
                    min={0}
                    value={faltasInjustificadas}
                    onChange={(e) => setFaltasInjustificadas(Number(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Responsável Legal</label>
                  <input
                    type="text"
                    required
                    value={responsavelNome}
                    onChange={(e) => setResponsavelNome(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp do Responsável</label>
                  <input
                    type="text"
                    required
                    value={responsavelTelefone}
                    onChange={(e) => setResponsavelTelefone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentimentoLGPD}
                    onChange={(e) => setConsentimentoLGPD(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-semibold">
                    Consentimento LGPD ativo para mensageria
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Salvar Alterações (UPDATE)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção (SQL DELETE) */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Exclusão (SQL DELETE)</span>
              </h3>
              <button
                onClick={() => setDeletingStudent(null)}
                type="button"
                aria-label="Fechar exclusão"
                className="text-rose-200 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed">
                Deseja remover permanentemente o registro do aluno <strong>{deletingStudent.nome}</strong> (Matrícula <span className="font-mono">{deletingStudent.registroEscolar}</span>) do banco de dados SQLite? Esta operação executará <code className="bg-slate-100 px-1 rounded">DELETE FROM alunos</code> e registrará o evento na tabela <code className="bg-slate-100 px-1 rounded">auditoria_lgpd</code>.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingStudent(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const idToDelete = deletingStudent.id;
                    setDeletingStudent(null);
                    await onDeleteStudent(idToDelete);
                  }}
                  className="px-4 py-2 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
