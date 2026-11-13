import React, { useState } from 'react';
import {
  Database,
  Play,
  RotateCcw,
  Table2,
  Key,
  Link2,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Terminal,
  GitBranch,
  History,
  Layers,
} from 'lucide-react';
import type {
  AuditLogEntry,
  SqlExecutionResult,
  TableSchemaInfo,
} from '../types';

interface DatabaseStudioViewProps {
  schemaTables: TableSchemaInfo[];
  auditLogs: AuditLogEntry[];
  sqlScripts: {
    schemaSql: string;
    seedSql: string;
    dmlSql: string;
  };
  onExecuteSql: (sql: string) => Promise<SqlExecutionResult>;
  onResetDatabase: () => Promise<void>;
}

const PRESET_QUERIES: {
  id: string;
  label: string;
  badge: string;
  badgeColor: string;
  sql: string;
}[] = [
  {
    id: 'join-cabecalho',
    label: 'SELECT + INNER JOIN (Cabeçalho Completo)',
    badge: 'CONSULTA',
    badgeColor: 'bg-blue-100 text-blue-800',
    sql: `-- Cruzamento relacional (3FN) para injeção automática de cabeçalho\nSELECT\n  a.registro_escolar AS Matricula,\n  a.nome AS Aluno,\n  t.nome AS Turma,\n  t.turno AS Turno,\n  t.professor_regente_nome AS Prof_Regente,\n  r.nome AS Responsavel,\n  r.telefone AS WhatsApp,\n  CASE WHEN a.consentimento_lgpd = 1 THEN 'AUTORIZADO' ELSE 'BLOQUEADO_LGPD' END AS LGPD\nFROM alunos a\nINNER JOIN turmas t ON a.turma_id = t.id\nINNER JOIN responsaveis r ON a.responsavel_id = r.id\nORDER BY t.nome, a.nome;`,
  },
  {
    id: 'group-by',
    label: 'SELECT + GROUP BY (Métricas de Mensagens)',
    badge: 'AGREGAÇÃO',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    sql: `-- Estatísticas de comunicados agrupados por status na fila e categoria\nSELECT\n  status AS Situacao_Fila,\n  categoria AS Categoria,\n  COUNT(id) AS Total_Comunicados,\n  SUM(destinatarios_count) AS Destinatarios_Alcancados,\n  SUM(entregues_count) AS Total_Entregues\nFROM mensagens\nGROUP BY status, categoria\nORDER BY Total_Comunicados DESC;`,
  },
  {
    id: 'where-alerta',
    label: 'SELECT + WHERE (Faltas & Pendência LGPD)',
    badge: 'FILTRO',
    badgeColor: 'bg-amber-100 text-amber-800',
    sql: `-- Alunos com 4+ faltas injustificadas ou sem termo de consentimento LGPD\nSELECT\n  a.registro_escolar,\n  a.nome AS Aluno,\n  a.faltas_injustificadas AS Faltas,\n  a.consentimento_lgpd AS Consentimento_LGPD,\n  r.nome AS Responsavel,\n  r.telefone\nFROM alunos a\nINNER JOIN responsaveis r ON a.responsavel_id = r.id\nWHERE a.faltas_injustificadas >= 4 OR a.consentimento_lgpd = 0\nORDER BY a.faltas_injustificadas DESC;`,
  },
  {
    id: 'insert-demo',
    label: 'INSERT (Novo Responsável + Aluno)',
    badge: 'INSERÇÃO',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    sql: `-- Inserção transacional respeitando a 3ª Forma Normal (Responsável -> Aluno)\nINSERT INTO responsaveis (id, nome, grau_parentesco, telefone, email)\nVALUES ('resp-sql-99', 'Patrícia Vasques', 'Mãe', '(67) 99444-8899', 'patricia.vasques@email.com');\n\nINSERT INTO alunos (id, registro_escolar, nome, turma_id, responsavel_id, consentimento_lgpd, data_matricula, faltas_injustificadas)\nVALUES ('alu-sql-99', '2026-0999', 'Matheus Vasques Silva', 'turma-4a', 'resp-sql-99', 1, '2026-11-12', 0);`,
  },
  {
    id: 'update-demo',
    label: 'UPDATE (Ativar Consentimento LGPD)',
    badge: 'ATUALIZAÇÃO',
    badgeColor: 'bg-sky-100 text-sky-800',
    sql: `-- Atualiza o consentimento LGPD da aluna Sofia Helena Dornelles (alu-06)\nUPDATE alunos\nSET consentimento_lgpd = 1\nWHERE id = 'alu-06';`,
  },
  {
    id: 'delete-demo',
    label: 'DELETE (Remover Registro de Teste)',
    badge: 'REMOÇÃO',
    badgeColor: 'bg-rose-100 text-rose-800',
    sql: `-- Remoção segura respeitando a ordem das Chaves Estrangeiras\nDELETE FROM alunos WHERE id = 'alu-sql-99';\nDELETE FROM responsaveis WHERE id = 'resp-sql-99';`,
  },
  {
    id: 'fk-test',
    label: 'Testar Restrição FOREIGN KEY / CHECK',
    badge: 'INTEGRIDADE',
    badgeColor: 'bg-purple-100 text-purple-800',
    sql: `-- Demonstração de integridade referencial: tenta inserir aluno em turma inexistente\nINSERT INTO alunos (id, registro_escolar, nome, turma_id, responsavel_id, consentimento_lgpd, data_matricula)\nVALUES ('alu-erro', '2026-9999', 'Teste Integridade', 'turma-inexistente', 'resp-01', 1, '2026-11-12');`,
  },
  {
    id: 'audit-logs',
    label: 'SELECT auditoria_lgpd (Rastreabilidade)',
    badge: 'LGPD',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    sql: `-- Trilha de auditoria das operações críticas no banco de dados\nSELECT id, entidade, entidade_id, acao, detalhes, usuario_responsavel, executado_em\nFROM auditoria_lgpd\nORDER BY id DESC\nLIMIT 20;`,
  },
];

const TABLE_DESCRIPTIONS: Record<string, { title: string; role: string; norm: string }> = {
  tipos_usuario: {
    title: 'tipos_usuario',
    role: 'Perfis de acesso RBAC (Direção, Pedagógico, Coordenação, Professor, Secretaria)',
    norm: '3FN: Isola regras de permissão dos atributos individuais dos usuários.',
  },
  usuarios: {
    title: 'usuarios',
    role: 'Atores internos autenticáveis da escola e docentes regentes',
    norm: 'Chave Estrangeira tipo_usuario_id -> tipos_usuario(id).',
  },
  turmas: {
    title: 'turmas',
    role: 'Turmas espelhadas do School+/TecSystem com Professor Regente vinculado',
    norm: 'FK professor_regente_id -> usuarios(id); CHECK de turno válido.',
  },
  responsaveis: {
    title: 'responsaveis',
    role: 'Pais e tutores legais com contato oficial WhatsApp/SMS',
    norm: '3FN: Desacoplada de alunos para eliminar redundância de telefone/e-mail entre irmãos.',
  },
  alunos: {
    title: 'alunos',
    role: 'Estudantes matriculados com matrícula UNIQUE e termo de consentimento LGPD',
    norm: 'FKs para turmas(id) e responsaveis(id); CHECK em consentimento_lgpd (0/1).',
  },
  mensagens: {
    title: 'mensagens',
    role: 'Comunicados com cabeçalho injetado e estado da fila hierárquica',
    norm: 'FKs para autor, aluno (ON DELETE SET NULL) e turma; CHECK de categoria/status.',
  },
  auditoria_lgpd: {
    title: 'auditoria_lgpd',
    role: 'Trilha de auditoria imutável de INSERT, UPDATE, DELETE e disparos',
    norm: 'Atende aos requisitos de rastreabilidade da Lei nº 13.709/2018 (LGPD).',
  },
};

export const DatabaseStudioView: React.FC<DatabaseStudioViewProps> = ({
  schemaTables,
  auditLogs,
  sqlScripts,
  onExecuteSql,
  onResetDatabase,
}) => {
  const [subTab, setSubTab] = useState<'der' | 'console' | 'scripts'>('der');
  const [selectedTableName, setSelectedTableName] = useState<string>('alunos');
  const [sqlInput, setSqlInput] = useState<string>(PRESET_QUERIES[0].sql);
  const [sqlResult, setSqlResult] = useState<SqlExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeScriptTab, setActiveScriptTab] = useState<'schema' | 'seed' | 'dml'>('schema');
  const [copiedScript, setCopiedScript] = useState(false);

  const selectedTable =
    schemaTables.find((t) => t.name === selectedTableName) || schemaTables[0];

  const handleRunSql = async (queryToRun?: string) => {
    const query = queryToRun ?? sqlInput;
    setIsRunning(true);
    try {
      const res = await onExecuteSql(query);
      setSqlResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const currentScriptText =
    activeScriptTab === 'schema'
      ? sqlScripts.schemaSql
      : activeScriptTab === 'seed'
      ? sqlScripts.seedSql
      : sqlScripts.dmlSql;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Modelagem Relacional (DER) & Console SQL</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              SQLite Real Ativo (3FN • FK ON)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Módulo 3 UFMS Digital: Esquema normalizado com 7 tabelas relacionais, chaves primárias/estrangeiras, restrições CHECK/UNIQUE e manipulação SQL em tempo real.
          </p>
        </div>

        {/* Sub-navigation */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setSubTab('der')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'der'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>Modelo DER & Tabelas</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('console')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'console'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span>Console SQL (CRUD)</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('scripts')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'scripts'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 shrink-0" />
            <span>Scripts SQL & Auditoria</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DER & SCHEMA INSPECTOR */}
      {subTab === 'der' && (
        <div className="space-y-6">
          {/* Normalization Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-extrabold text-blue-700 uppercase tracking-wider mb-1">
                1ª Forma Normal (1FN)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Todos os atributos são atômicos e indivisíveis (ex.: separação de <code className="bg-slate-100 px-1 rounded">nome</code>, <code className="bg-slate-100 px-1 rounded">telefone</code>, <code className="bg-slate-100 px-1 rounded">turno</code> e <code className="bg-slate-100 px-1 rounded">sala</code> sem grupos repetitivos).
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-1">
                2ª Forma Normal (2FN)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaves primárias simples identificadoras (<code className="bg-slate-100 px-1 rounded">id</code>) em todas as tabelas, eliminando dependências parciais dos atributos não-chave.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider mb-1">
                3ª Forma Normal (3FN)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eliminação de dependências transitivas: <code className="bg-slate-100 px-1 rounded">responsaveis</code> e <code className="bg-slate-100 px-1 rounded">tipos_usuario</code> foram extraídos para tabelas próprias com FKs.
              </p>
            </div>
          </div>

          {/* Interactive Entity Grid + Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Visual ER Cards Grid (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Diagrama Entidade-Relacionamento (DER Lógico)</h3>
                  <p className="text-[11px] text-slate-400">
                    Clique em uma entidade abaixo para inspecionar colunas, PKs, FKs e restrições SQL
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-slate-800 px-2.5 py-1 rounded text-emerald-400 border border-slate-700">
                  {schemaTables.length} Entidades
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {schemaTables.map((table) => {
                  const isSelected = table.name === selectedTable?.name;
                  return (
                    <button
                      key={table.name}
                      type="button"
                      onClick={() => setSelectedTableName(table.name)}
                      className={`text-left rounded-xl p-3.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/90 border-blue-500 ring-2 ring-blue-500/40'
                          : 'bg-slate-800/70 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-blue-300 flex items-center gap-1.5">
                          <Table2 className="w-3.5 h-3.5 text-blue-400" />
                          {table.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                          {table.rowCount} reg.
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] font-mono">
                        {table.columns.slice(0, 5).map((col) => {
                          const isFk = table.foreignKeys.some((fk) => fk.from === col.name);
                          return (
                            <div key={col.name} className="flex items-center justify-between text-slate-300">
                              <span className="flex items-center gap-1 truncate">
                                {col.pk > 0 && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                                {isFk && <Link2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                                <span className={col.pk > 0 ? 'text-amber-300 font-bold' : isFk ? 'text-emerald-300' : ''}>
                                  {col.name}
                                </span>
                              </span>
                              <span className="text-slate-500 text-[10px]">{col.type}</span>
                            </div>
                          );
                        })}
                        {table.columns.length > 5 && (
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            + {table.columns.length - 5} coluna(s)...
                          </div>
                        )}
                      </div>

                      {table.foreignKeys.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/80 flex flex-wrap gap-1">
                          {table.foreignKeys.map((fk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/70"
                            >
                              {fk.from} → {fk.table}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Cardinalities summary */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-blue-400 font-bold">Cardinalidades Mapeadas:</div>
                <div>• tipos_usuario (1) ──&lt; (N) usuarios</div>
                <div>• usuarios (1) ──&lt; (N) turmas [professor_regente_id]</div>
                <div>• turmas (1) ──&lt; (N) alunos &nbsp;|&nbsp; responsaveis (1) ──&lt; (N) alunos</div>
                <div>• usuarios (1) ──&lt; (N) mensagens &nbsp;|&nbsp; alunos (0..1) ──&lt; (N) mensagens</div>
              </div>
            </div>

            {/* Right: Selected Table Schema Inspector (5 cols) */}
            {selectedTable && (
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      Dicionário de Dados
                    </span>
                    <h3 className="text-lg font-extrabold font-mono text-slate-900">
                      {selectedTable.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs">
                    {selectedTable.rowCount} registros
                  </span>
                </div>

                {TABLE_DESCRIPTIONS[selectedTable.name] && (
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-xs space-y-1">
                    <div className="font-semibold text-blue-950">
                      {TABLE_DESCRIPTIONS[selectedTable.name].role}
                    </div>
                    <div className="text-blue-800 text-[11px]">
                      <strong>Normalização:</strong> {TABLE_DESCRIPTIONS[selectedTable.name].norm}
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Coluna</th>
                        <th className="py-2 px-3">Tipo</th>
                        <th className="py-2 px-3">Restrições</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {selectedTable.columns.map((col) => {
                        const fk = selectedTable.foreignKeys.find((f) => f.from === col.name);
                        return (
                          <tr key={col.name} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-900">{col.name}</td>
                            <td className="py-2 px-3 text-slate-600">{col.type}</td>
                            <td className="py-2 px-3 space-x-1">
                              {col.pk > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                                  PK
                                </span>
                              )}
                              {fk && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                                  FK→{fk.table}
                                </span>
                              )}
                              {col.notnull === 1 && col.pk === 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                                  NOT NULL
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const q = `SELECT * FROM ${selectedTable.name} LIMIT 25;`;
                    setSqlInput(q);
                    setSubTab('console');
                    handleRunSql(q);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Consultar dados de "{selectedTable.name}" no Console SQL</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SQL CONSOLE */}
      {subTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Preset Queries (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Operações SQL Prontas (DDL/DML)
            </h3>
            <p className="text-xs text-slate-500">
              Clique em qualquer exemplo para carregar e testar diretamente contra o banco SQLite real:
            </p>
            <div className="space-y-2">
              {PRESET_QUERIES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSqlInput(preset.sql);
                    handleRunSql(preset.sql);
                  }}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-slate-800">{preset.label}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: SQL Editor + Live Results (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="sql-editor" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Editor SQL (SQLite Engine Real)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await onResetDatabase();
                      setSqlResult({
                        ok: true,
                        kind: 'MUTATION',
                        statementType: 'RESET',
                        columns: [],
                        rows: [],
                        changes: 0,
                        lastInsertRowid: null,
                        durationMs: 2,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resetar Banco</span>
                  </button>

                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => handleRunSql()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isRunning ? 'Executando...' : 'Executar SQL'}</span>
                  </button>
                </div>
              </div>

              <textarea
                id="sql-editor"
                rows={7}
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                spellCheck={false}
                className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            {/* Result Output Area */}
            {sqlResult && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div
                  className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-bold ${
                    sqlResult.ok
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {sqlResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>
                      {sqlResult.ok
                        ? sqlResult.kind === 'QUERY'
                          ? `Consulta executada com sucesso: ${sqlResult.rows.length} registro(s) retornado(s).`
                          : `Operação ${sqlResult.statementType} concluída: ${sqlResult.changes} linha(s) afetada(s).`
                        : 'Erro na execução SQL'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] opacity-80">
                    {sqlResult.durationMs} ms
                  </span>
                </div>

                {!sqlResult.ok && sqlResult.error && (
                  <div className="p-5 text-xs text-rose-800 font-medium bg-rose-50/40">
                    {sqlResult.error}
                  </div>
                )}

                {sqlResult.ok && sqlResult.kind === 'QUERY' && (
                  <div className="overflow-x-auto max-h-96">
                    {sqlResult.rows.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500">
                        A consulta não retornou nenhuma linha.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                          <tr>
                            {sqlResult.columns.map((col) => (
                              <th key={col} className="py-2.5 px-3 font-mono whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                          {sqlResult.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              {sqlResult.columns.map((col) => (
                                <td key={col} className="py-2 px-3 text-slate-800 max-w-xs truncate">
                                  {row[col] === null ? (
                                    <span className="text-slate-400 italic">NULL</span>
                                  ) : (
                                    String(row[col])
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SQL SCRIPTS & AUDIT LOG */}
      {subTab === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SQL Scripts Viewer (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveScriptTab('schema')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    activeScriptTab === 'schema'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  01_schema.sql (DDL)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScriptTab('seed')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    activeScriptTab === 'seed'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  02_seed.sql (Carga)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScriptTab('dml')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    activeScriptTab === 'dml'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  03_operations_dml.sql
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopyScript(currentScriptText)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>

            <pre className="p-5 bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-[540px] leading-relaxed">
              {currentScriptText}
            </pre>
          </div>

          {/* LGPD Audit Log Feed (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Trilha de Auditoria SQL & LGPD</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Registros persistidos na tabela <code className="font-mono">auditoria_lgpd</code>
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">{auditLogs.length} eventos</span>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {log.acao} • {log.entidade}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{log.executado_em}</span>
                  </div>
                  <p className="text-slate-800 font-medium leading-snug">{log.detalhes}</p>
                  <div className="text-[11px] text-slate-500">
                    Responsável: <strong className="text-slate-700">{log.usuario_responsavel}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
