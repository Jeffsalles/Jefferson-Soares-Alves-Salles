import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  classifySqlStatement,
  formatSqlErrorPtBr,
  splitSqlStatements,
  validateConsoleSql,
} from '../logic/sql-helpers.ts';
import type {
  AuditLogEntry,
  Classroom,
  ColumnSchemaInfo,
  ForeignKeyInfo,
  SqlExecutionResult,
  Student,
  SystemMessage,
  TableSchemaInfo,
  UserProfile,
  UserRole,
} from '../types/index.ts';

const DB_PATH = path.resolve(process.cwd(), 'sec_escola.db');
const SCHEMA_PATH = path.resolve(process.cwd(), 'sql', '01_schema.sql');
const SEED_PATH = path.resolve(process.cwd(), 'sql', '02_seed.sql');
const DML_REF_PATH = path.resolve(process.cwd(), 'sql', '03_operations_dml.sql');

const CORE_TABLES = [
  'tipos_usuario',
  'usuarios',
  'turmas',
  'responsaveis',
  'alunos',
  'mensagens',
  'auditoria_lgpd',
];

let dbInstance: DatabaseSync | null = null;

function executeSqlScript(db: DatabaseSync, filePath: string): void {
  const sqlContent = fs.readFileSync(filePath, 'utf-8');
  const statements = splitSqlStatements(sqlContent);
  for (const stmt of statements) {
    db.exec(stmt);
  }
}

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA foreign_keys = ON;');

  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'tipos_usuario'")
    .get();

  if (!tableExists) {
    executeSqlScript(db, SCHEMA_PATH);
    executeSqlScript(db, SEED_PATH);
  }

  dbInstance = db;
  return db;
}

export function resetDatabase(): void {
  const db = getDatabase();
  executeSqlScript(db, SCHEMA_PATH);
  executeSqlScript(db, SEED_PATH);
}

export function getSqlFilesContent(): {
  schemaSql: string;
  seedSql: string;
  dmlSql: string;
} {
  return {
    schemaSql: fs.readFileSync(SCHEMA_PATH, 'utf-8'),
    seedSql: fs.readFileSync(SEED_PATH, 'utf-8'),
    dmlSql: fs.readFileSync(DML_REF_PATH, 'utf-8'),
  };
}

export function getSchemaMetadata(): TableSchemaInfo[] {
  const db = getDatabase();
  return CORE_TABLES.map((tableName) => {
    const countRow = db
      .prepare(`SELECT COUNT(*) AS total FROM "${tableName}"`)
      .get() as { total: number };
    const columns = db
      .prepare(`PRAGMA table_info("${tableName}")`)
      .all() as unknown as ColumnSchemaInfo[];
    const foreignKeys = db
      .prepare(`PRAGMA foreign_key_list("${tableName}")`)
      .all() as unknown as ForeignKeyInfo[];

    return {
      name: tableName,
      rowCount: Number(countRow?.total ?? 0),
      columns,
      foreignKeys,
    };
  });
}

export function listProfiles(): UserProfile[] {
  const db = getDatabase();
  const rows = db
    .prepare(
      `SELECT u.id, u.nome, u.email, t.papel, u.cargo, u.departamento, u.avatar_url
       FROM usuarios u
       INNER JOIN tipos_usuario t ON u.tipo_usuario_id = t.id
       WHERE u.id IN ('u-dir', 'u-ped', 'u-coord', 'u-prof', 'u-sec')
       ORDER BY CASE t.papel
         WHEN 'direcao' THEN 1
         WHEN 'pedagogico' THEN 2
         WHEN 'coordenacao' THEN 3
         WHEN 'professor' THEN 4
         WHEN 'secretaria' THEN 5
         ELSE 6
       END`
    )
    .all() as Array<{
    id: string;
    nome: string;
    email: string;
    papel: UserRole;
    cargo: string;
    departamento: string;
    avatar_url: string | null;
  }>;

  return rows.map((r) => ({
    id: r.id,
    nome: r.nome,
    email: r.email,
    papel: r.papel,
    cargo: r.cargo,
    departamento: r.departamento,
    avatarUrl: r.avatar_url ?? undefined,
  }));
}

export function listClassrooms(): Classroom[] {
  const db = getDatabase();
  const rows = db
    .prepare(
      `SELECT id, codigo, nome, sala, turno, numero_alunos, professor_regente_id, professor_regente_nome, completa
       FROM turmas
       ORDER BY codigo`
    )
    .all() as Array<{
    id: string;
    codigo: string;
    nome: string;
    sala: string;
    turno: 'Matutino' | 'Vespertino';
    numero_alunos: number;
    professor_regente_id: string;
    professor_regente_nome: string;
    completa: number;
  }>;

  return rows.map((r) => ({
    id: r.id,
    codigo: r.codigo,
    nome: r.nome,
    sala: r.sala,
    turno: r.turno,
    numeroAlunos: r.numero_alunos,
    professorRegenteId: r.professor_regente_id,
    professorRegenteNome: r.professor_regente_nome,
    completa: r.completa === 1,
  }));
}

export function listStudents(): Student[] {
  const db = getDatabase();
  const rows = db
    .prepare(
      `SELECT a.id, a.registro_escolar, a.nome, a.turma_id,
              r.nome AS responsavel_nome, r.grau_parentesco, r.telefone, r.email,
              a.consentimento_lgpd, a.data_matricula, a.faltas_injustificadas
       FROM alunos a
       INNER JOIN responsaveis r ON a.responsavel_id = r.id
       ORDER BY a.data_matricula DESC, a.nome ASC`
    )
    .all() as Array<{
    id: string;
    registro_escolar: string;
    nome: string;
    turma_id: string;
    responsavel_nome: string;
    grau_parentesco: 'Mãe' | 'Pai' | 'Avó' | 'Avô' | 'Tutor Legal';
    telefone: string;
    email: string;
    consentimento_lgpd: number;
    data_matricula: string;
    faltas_injustificadas: number;
  }>;

  return rows.map((r) => ({
    id: r.id,
    registroEscolar: r.registro_escolar,
    nome: r.nome,
    turmaId: r.turma_id,
    responsavelNome: r.responsavel_nome,
    responsavelGrau: r.grau_parentesco,
    responsavelTelefone: r.telefone,
    responsavelEmail: r.email,
    consentimentoLGPD: r.consentimento_lgpd === 1,
    dataMatricula: r.data_matricula,
    faltasInjustificadas: r.faltas_injustificadas,
  }));
}

export function listMessages(): SystemMessage[] {
  const db = getDatabase();
  const rows = db
    .prepare(
      `SELECT id, autor_id, autor_nome, autor_papel, categoria, urgencia, canal, destinatario_tipo,
              aluno_id, aluno_nome, turma_id, turma_nome, assunto, conteudo_corpo,
              cabecalho_formatado, mensagem_completa, status, criada_em, validada_por,
              validada_em, justificativa_rejeicao, destinatarios_count, entregues_count, lidas_count
       FROM mensagens
       ORDER BY criada_em DESC, rowid DESC`
    )
    .all() as Array<{
    id: string;
    autor_id: string;
    autor_nome: string;
    autor_papel: UserRole;
    categoria: SystemMessage['categoria'];
    urgencia: SystemMessage['urgencia'];
    canal: SystemMessage['canal'];
    destinatario_tipo: SystemMessage['destinatarioTipo'];
    aluno_id: string | null;
    aluno_nome: string | null;
    turma_id: string | null;
    turma_nome: string | null;
    assunto: string;
    conteudo_corpo: string;
    cabecalho_formatado: string;
    mensagem_completa: string;
    status: SystemMessage['status'];
    criada_em: string;
    validada_por: string | null;
    validada_em: string | null;
    justificativa_rejeicao: string | null;
    destinatarios_count: number;
    entregues_count: number;
    lidas_count: number;
  }>;

  return rows.map((r) => ({
    id: r.id,
    autorId: r.autor_id,
    autorNome: r.autor_nome,
    autorPapel: r.autor_papel,
    categoria: r.categoria,
    urgencia: r.urgencia,
    canal: r.canal,
    destinatarioTipo: r.destinatario_tipo,
    alunoId: r.aluno_id ?? undefined,
    alunoNome: r.aluno_nome ?? undefined,
    turmaId: r.turma_id ?? undefined,
    turmaNome: r.turma_nome ?? undefined,
    assunto: r.assunto,
    conteudoCorpo: r.conteudo_corpo,
    cabecalhoFormatado: r.cabecalho_formatado,
    mensagemCompleta: r.mensagem_completa,
    status: r.status,
    criadaEm: r.criada_em,
    validadaPor: r.validada_por ?? undefined,
    validadaEm: r.validada_em ?? undefined,
    justificativaRejeicao: r.justificativa_rejeicao ?? undefined,
    destinatariosCount: r.destinatarios_count,
    entreguesCount: r.entregues_count,
    lidasCount: r.lidas_count,
  }));
}

export function listAuditLogs(limit = 30): AuditLogEntry[] {
  const db = getDatabase();
  return db
    .prepare(
      `SELECT id, entidade, entidade_id, acao, detalhes, usuario_responsavel, executado_em
       FROM auditoria_lgpd
       ORDER BY id DESC
       LIMIT ?`
    )
    .all(limit) as unknown as AuditLogEntry[];
}

function logAudit(
  db: DatabaseSync,
  entidade: string,
  entidadeId: string,
  acao: AuditLogEntry['acao'],
  detalhes: string,
  usuarioResponsavel: string
) {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  db.prepare(
    `INSERT INTO auditoria_lgpd (entidade, entidade_id, acao, detalhes, usuario_responsavel, executado_em)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(entidade, entidadeId, acao, detalhes, usuarioResponsavel, now);
}

export function createStudentRecord(student: Student, actorName: string): Student {
  const db = getDatabase();
  const respId = `resp-${Date.now()}`;

  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare(
      `INSERT INTO responsaveis (id, nome, grau_parentesco, telefone, email)
       VALUES (?, ?, ?, ?, ?)`
    ).run(
      respId,
      student.responsavelNome,
      student.responsavelGrau,
      student.responsavelTelefone,
      student.responsavelEmail
    );

    db.prepare(
      `INSERT INTO alunos (id, registro_escolar, nome, turma_id, responsavel_id, consentimento_lgpd, data_matricula, faltas_injustificadas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      student.id,
      student.registroEscolar,
      student.nome,
      student.turmaId,
      respId,
      student.consentimentoLGPD ? 1 : 0,
      student.dataMatricula,
      student.faltasInjustificadas
    );

    logAudit(
      db,
      'alunos',
      student.id,
      'INSERT',
      `Cadastro do aluno ${student.nome} (Matrícula ${student.registroEscolar}) vinculado ao responsável ${student.responsavelNome}.`,
      actorName
    );
    db.exec('COMMIT');
    return student;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function updateStudentRecord(
  studentId: string,
  updates: Partial<Pick<Student, 'nome' | 'turmaId' | 'responsavelNome' | 'responsavelGrau' | 'responsavelTelefone' | 'responsavelEmail' | 'consentimentoLGPD' | 'faltasInjustificadas'>>,
  actorName: string
): Student | null {
  const db = getDatabase();
  const existing = db
    .prepare('SELECT id, responsavel_id, nome, consentimento_lgpd FROM alunos WHERE id = ?')
    .get(studentId) as { id: string; responsavel_id: string; nome: string; consentimento_lgpd: number } | undefined;

  if (!existing) return null;

  db.exec('BEGIN TRANSACTION');
  try {
    if (
      updates.responsavelNome !== undefined ||
      updates.responsavelGrau !== undefined ||
      updates.responsavelTelefone !== undefined ||
      updates.responsavelEmail !== undefined
    ) {
      const resp = db
        .prepare('SELECT nome, grau_parentesco, telefone, email FROM responsaveis WHERE id = ?')
        .get(existing.responsavel_id) as {
        nome: string;
        grau_parentesco: string;
        telefone: string;
        email: string;
      };

      db.prepare(
        `UPDATE responsaveis
         SET nome = ?, grau_parentesco = ?, telefone = ?, email = ?
         WHERE id = ?`
      ).run(
        updates.responsavelNome ?? resp.nome,
        updates.responsavelGrau ?? resp.grau_parentesco,
        updates.responsavelTelefone ?? resp.telefone,
        updates.responsavelEmail ?? resp.email,
        existing.responsavel_id
      );
    }

    const currStudent = db
      .prepare('SELECT nome, turma_id, consentimento_lgpd, faltas_injustificadas FROM alunos WHERE id = ?')
      .get(studentId) as {
      nome: string;
      turma_id: string;
      consentimento_lgpd: number;
      faltas_injustificadas: number;
    };

    const nextConsent =
      updates.consentimentoLGPD !== undefined
        ? updates.consentimentoLGPD
          ? 1
          : 0
        : currStudent.consentimento_lgpd;

    db.prepare(
      `UPDATE alunos
       SET nome = ?, turma_id = ?, consentimento_lgpd = ?, faltas_injustificadas = ?
       WHERE id = ?`
    ).run(
      updates.nome ?? currStudent.nome,
      updates.turmaId ?? currStudent.turma_id,
      nextConsent,
      updates.faltasInjustificadas ?? currStudent.faltas_injustificadas,
      studentId
    );

    const detailMsg =
      updates.consentimentoLGPD !== undefined && Object.keys(updates).length === 1
        ? `Alteração do termo LGPD de ${existing.nome} para ${updates.consentimentoLGPD ? 'ATIVO' : 'BLOQUEADO'}.`
        : `Atualização cadastral (SQL UPDATE) do registro de ${updates.nome ?? existing.nome}.`;

    logAudit(db, 'alunos', studentId, 'UPDATE', detailMsg, actorName);
    db.exec('COMMIT');

    return listStudents().find((s) => s.id === studentId) ?? null;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function deleteStudentRecord(studentId: string, actorName: string): boolean {
  const db = getDatabase();
  const existing = db
    .prepare('SELECT id, nome, registro_escolar, responsavel_id FROM alunos WHERE id = ?')
    .get(studentId) as { id: string; nome: string; registro_escolar: string; responsavel_id: string } | undefined;

  if (!existing) return false;

  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare('DELETE FROM alunos WHERE id = ?').run(studentId);

    const remainingDependents = db
      .prepare('SELECT COUNT(*) AS cnt FROM alunos WHERE responsavel_id = ?')
      .get(existing.responsavel_id) as { cnt: number };

    if (remainingDependents.cnt === 0) {
      db.prepare('DELETE FROM responsaveis WHERE id = ?').run(existing.responsavel_id);
    }

    logAudit(
      db,
      'alunos',
      studentId,
      'DELETE',
      `Remoção (SQL DELETE) do cadastro de ${existing.nome} (Matrícula ${existing.registro_escolar}).`,
      actorName
    );
    db.exec('COMMIT');
    return true;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function createMessageRecord(message: SystemMessage): SystemMessage {
  const db = getDatabase();

  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare(
      `INSERT INTO mensagens (
        id, autor_id, autor_nome, autor_papel, categoria, urgencia, canal, destinatario_tipo,
        aluno_id, aluno_nome, turma_id, turma_nome, assunto, conteudo_corpo,
        cabecalho_formatado, mensagem_completa, status, criada_em, validada_por, validada_em,
        justificativa_rejeicao, destinatarios_count, entregues_count, lidas_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      message.id,
      message.autorId,
      message.autorNome,
      message.autorPapel,
      message.categoria,
      message.urgencia,
      message.canal,
      message.destinatarioTipo,
      message.alunoId ?? null,
      message.alunoNome ?? null,
      message.turmaId ?? null,
      message.turmaNome ?? null,
      message.assunto,
      message.conteudoCorpo,
      message.cabecalhoFormatado,
      message.mensagemCompleta,
      message.status,
      message.criadaEm,
      message.validadaPor ?? null,
      message.validadaEm ?? null,
      message.justificativaRejeicao ?? null,
      message.destinatariosCount,
      message.entreguesCount,
      message.lidasCount
    );

    logAudit(
      db,
      'mensagens',
      message.id,
      message.status === 'enviada' ? 'DISPARO' : 'INSERT',
      message.status === 'enviada'
        ? `Disparo direto "${message.assunto}" para ${message.destinatariosCount} destinatário(s).`
        : `Mensagem docente "${message.assunto}" retida na Fila de Validação Hierárquica.`,
      message.autorNome
    );
    db.exec('COMMIT');
    return message;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function approveMessageRecord(messageId: string, approverLabel: string, actorName: string): SystemMessage | null {
  const db = getDatabase();
  const existing = db
    .prepare('SELECT id, assunto, destinatarios_count FROM mensagens WHERE id = ?')
    .get(messageId) as { id: string; assunto: string; destinatarios_count: number } | undefined;

  if (!existing) return null;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const entregues = existing.destinatarios_count;
  const lidas = Math.round(entregues * 0.95);

  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare(
      `UPDATE mensagens
       SET status = 'enviada', validada_por = ?, validada_em = ?, entregues_count = ?, lidas_count = ?
       WHERE id = ?`
    ).run(approverLabel, now, entregues, lidas, messageId);

    logAudit(
      db,
      'mensagens',
      messageId,
      'APROVACAO',
      `Comunicado "${existing.assunto}" homologado e disparado para ${entregues} destinatário(s).`,
      actorName
    );
    db.exec('COMMIT');

    return listMessages().find((m) => m.id === messageId) ?? null;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function rejectMessageRecord(
  messageId: string,
  reason: string,
  approverLabel: string,
  actorName: string
): SystemMessage | null {
  const db = getDatabase();
  const existing = db
    .prepare('SELECT id, assunto FROM mensagens WHERE id = ?')
    .get(messageId) as { id: string; assunto: string } | undefined;

  if (!existing) return null;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare(
      `UPDATE mensagens
       SET status = 'reprovada', justificativa_rejeicao = ?, validada_por = ?, validada_em = ?
       WHERE id = ?`
    ).run(reason, approverLabel, now, messageId);

    logAudit(
      db,
      'mensagens',
      messageId,
      'REPROVACAO',
      `Comunicado "${existing.assunto}" reprovado com justificativa: ${reason}`,
      actorName
    );
    db.exec('COMMIT');

    return listMessages().find((m) => m.id === messageId) ?? null;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function executeInteractiveSql(sqlInput: string): SqlExecutionResult {
  const start = performance.now();
  const validation = validateConsoleSql(sqlInput);
  if (!validation.valid) {
    return {
      ok: false,
      kind: 'QUERY',
      statementType: 'BLOCKED',
      columns: [],
      rows: [],
      changes: 0,
      lastInsertRowid: null,
      durationMs: Math.round((performance.now() - start) * 100) / 100,
      error: validation.reason,
    };
  }

  const db = getDatabase();
  const statements = splitSqlStatements(sqlInput);

  if (statements.length === 0) {
    return {
      ok: false,
      kind: 'QUERY',
      statementType: 'EMPTY',
      columns: [],
      rows: [],
      changes: 0,
      lastInsertRowid: null,
      durationMs: 0,
      error: 'Nenhuma instrução SQL encontrada.',
    };
  }

  try {
    let lastResult: SqlExecutionResult = {
      ok: true,
      kind: 'QUERY',
      statementType: 'SELECT',
      columns: [],
      rows: [],
      changes: 0,
      lastInsertRowid: null,
      durationMs: 0,
    };

    let totalChanges = 0;

    for (const stmtSql of statements) {
      const kind = classifySqlStatement(stmtSql);
      if (kind === 'SELECT' || kind === 'PRAGMA') {
        const stmt = db.prepare(stmtSql);
        const rows = stmt.all() as Record<string, unknown>[];
        const columns =
          rows.length > 0
            ? Object.keys(rows[0])
            : stmt.columns().map((c) => c.name);
        lastResult = {
          ok: true,
          kind: 'QUERY',
          statementType: kind,
          columns,
          rows,
          changes: totalChanges,
          lastInsertRowid: null,
          durationMs: 0,
        };
      } else {
        const stmt = db.prepare(stmtSql);
        const info = stmt.run();
        totalChanges += Number(info.changes ?? 0);
        lastResult = {
          ok: true,
          kind: 'MUTATION',
          statementType: kind,
          columns: [],
          rows: [],
          changes: totalChanges,
          lastInsertRowid:
            typeof info.lastInsertRowid === 'bigint'
              ? Number(info.lastInsertRowid)
              : (info.lastInsertRowid ?? null),
          durationMs: 0,
        };
      }
    }

    lastResult.durationMs = Math.round((performance.now() - start) * 100) / 100;
    return lastResult;
  } catch (err) {
    const rawMsg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      kind: 'QUERY',
      statementType: classifySqlStatement(statements[0]),
      columns: [],
      rows: [],
      changes: 0,
      lastInsertRowid: null,
      durationMs: Math.round((performance.now() - start) * 100) / 100,
      error: formatSqlErrorPtBr(rawMsg),
    };
  }
}
