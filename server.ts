import express from 'express';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import {
  approveMessageRecord,
  createMessageRecord,
  createStudentRecord,
  deleteStudentRecord,
  executeInteractiveSql,
  getDatabase,
  getSchemaMetadata,
  getSqlFilesContent,
  listAuditLogs,
  listClassrooms,
  listMessages,
  listProfiles,
  listStudents,
  rejectMessageRecord,
  resetDatabase,
  updateStudentRecord,
} from './src/db/database.ts';
import { canRoleApproveMessages, canRoleAuthorCategory, requiresHierarchicalApproval } from './src/logic/sec-rules.ts';
import { formatSqlErrorPtBr } from './src/logic/sql-helpers.ts';
import type { GitCommitInfo, GitInfoResponse, Student, SystemMessage, UserRole } from './src/types/index.ts';

const execFileAsync = promisify(execFile);
const PORT = Number(process.env.PORT) || 3000;

async function readGitInfo(): Promise<GitInfoResponse> {
  const cwd = process.cwd();
  try {
    const [branchOut, branchesOut, logOut, statusOut, remoteOut] = await Promise.all([
      execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd }),
      execFileAsync('git', ['branch', '--format=%(refname:short)'], { cwd }),
      execFileAsync(
        'git',
        ['log', '-n', '30', '--pretty=format:%H||%h||%an||%ad||%s||%D', '--date=format:%d/%m/%Y %H:%M'],
        { cwd }
      ),
      execFileAsync('git', ['status', '--short'], { cwd }),
      execFileAsync('git', ['remote', '-v'], { cwd }).catch(() => ({ stdout: '' })),
    ]);

    const commits: GitCommitInfo[] = logOut.stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [hash, shortHash, author, date, subject, refs] = line.split('||');
        const prefixMatch = subject?.match(/^([a-z]+)(\(.+\))?:/i);
        return {
          hash: hash || '',
          shortHash: shortHash || '',
          author: author || 'Jefferson Soares Alves Salles',
          date: date || '',
          subject: subject || '',
          refs: refs || '',
          type: prefixMatch ? prefixMatch[1].toLowerCase() : 'chore',
        };
      });

    const branches = branchesOut.stdout
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const statusLines = statusOut.stdout
      .split('\n')
      .map((s) => s.trimEnd())
      .filter(Boolean);

    const remoteMatch = remoteOut.stdout.match(/origin\s+([^\s]+)/);

    return {
      available: true,
      currentBranch: branchOut.stdout.trim() || 'main',
      branches,
      totalCommits: commits.length,
      commits,
      statusLines,
      remoteUrl: remoteMatch ? remoteMatch[1] : 'https://github.com/jefferson-salles/sec-escola-conectada.git',
    };
  } catch {
    return {
      available: false,
      currentBranch: 'main',
      branches: ['main'],
      totalCommits: 0,
      commits: [],
      statusLines: [],
      remoteUrl: 'https://github.com/jefferson-salles/sec-escola-conectada.git',
    };
  }
}

async function createApp() {
  // Initialize SQLite database & seed if empty
  getDatabase();

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Healthcheck
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', database: 'sqlite-ready' });
  });

  // Bootstrap complete application state from SQLite
  app.get('/api/bootstrap', (_req, res) => {
    try {
      res.json({
        profiles: listProfiles(),
        classrooms: listClassrooms(),
        students: listStudents(),
        messages: listMessages(),
        auditLogs: listAuditLogs(40),
        schemaTables: getSchemaMetadata(),
        sqlScripts: getSqlFilesContent(),
      });
    } catch (err) {
      res.status(500).json({ error: formatSqlErrorPtBr(err instanceof Error ? err.message : String(err)) });
    }
  });

  // CRUD: Create Student + Guardian
  app.post('/api/students', (req, res) => {
    try {
      const { student, actorName } = req.body as { student: Student; actorName?: string };
      if (!student || !student.nome || !student.responsavelNome || !student.responsavelTelefone) {
        return res.status(400).json({ error: 'Dados obrigatórios do aluno ou responsável ausentes.' });
      }
      const created = createStudentRecord(student, actorName || 'Secretaria Escolar');
      res.status(201).json({
        student: created,
        students: listStudents(),
        auditLogs: listAuditLogs(40),
        schemaTables: getSchemaMetadata(),
      });
    } catch (err) {
      res.status(400).json({ error: formatSqlErrorPtBr(err instanceof Error ? err.message : String(err)) });
    }
  });

  // CRUD: Update Student / Guardian / LGPD Consent
  app.patch('/api/students/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { updates, actorName } = req.body as {
        updates: Partial<Student>;
        actorName?: string;
      };
      const updated = updateStudentRecord(id, updates || {}, actorName || 'Secretaria Escolar');
      if (!updated) {
        return res.status(404).json({ error: 'Aluno não encontrado no banco de dados.' });
      }
      res.json({
        student: updated,
        students: listStudents(),
        auditLogs: listAuditLogs(40),
        schemaTables: getSchemaMetadata(),
      });
    } catch (err) {
      res.status(400).json({ error: formatSqlErrorPtBr(err instanceof Error ? err.message : String(err)) });
    }
  });

  // CRUD: Delete Student
  app.delete('/api/students/:id', (req, res) => {
    try {
      const { id } = req.params;
      const actorName = (req.body?.actorName as string) || 'Secretaria Escolar';
      const removed = deleteStudentRecord(id, actorName);
      if (!removed) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
      }
      res.json({
        ok: true,
        students: listStudents(),
        auditLogs: listAuditLogs(40),
        schemaTables: getSchemaMetadata(),
      });
    } catch (err) {
      res.status(400).json({ error: formatSqlErrorPtBr(err instanceof Error ? err.message : String(err)) });
    }
  });

  // Create Message (enforces RBAC server-side as well)
  app.post('/api/messages', (req, res) => {
    try {
      const { message } = req.body as { message: SystemMessage };
      if (!message || !message.assunto || !message.conteudoCorpo) {
        return res.status(400).json({ error: 'Assunto e corpo do comunicado são obrigatórios.' });
      }
      if (!canRoleAuthorCategory(message.autorPapel, message.categoria)) {
        return res.status(403).json({
          error: `Perfil "${message.autorPapel}" não autorizado a redigir mensagens da categoria "${message.categoria}".`,
        });
      }
      const enforcedStatus = requiresHierarchicalApproval(message.autorPapel) ? 'pendente' : 'enviada';
      const normalizedMessage: SystemMessage = {
        ...message,
        status: enforcedStatus,
        entreguesCount: enforcedStatus === 'pendente' ? 0 : message.destinatariosCount,
        lidasCount: enforcedStatus === 'pendente' ? 0 : Math.round(message.destinatariosCount * 0.95),
      };

      const created = createMessageRecord(normalizedMessage);
      res.status(201).json({
        message: created,
        messages: listMessages(),
        auditLogs: listAuditLogs(40),
        schemaTables: getSchemaMetadata(),
      });
    } catch (err) {
      res.status(400).json({ error: formatSqlErrorPtBr(err instanceof Error ? err.message : String(err)) });
    }
  });

  // Approve Pending Message (enforces RBAC server-side)
  app.post('/api/messages/:id/approve', (req, res) => {
    try {
      const { id } = req.params;
      const { approverRole, approverLabel, actorName } = req.body as {
        approverRole: UserRole;
        approverLabel: string;
        actorName: string;
      };
      if (!canRoleApproveMessages(approverRole)) {
        return res.status(403).json({
          error: 'HTTP 403 Forbidden: Apenas Direção, Pedagógico ou Coordenação podem aprovar mensagens docentes.',
        });
      }
      const updated = approveMessageRecord(id, approverLabel, actorName);
      if (!updated) {
        return res.status(404).json({ error: 'Comunicado não encontrado.' });
      }
      res.json({
        message: updated,
        messages: listMessages(),
        auditLogs: listAuditLogs(40),
        schemaTables: getSchemaMetadata(),
      });
    } catch (err) {
      res.status(400).json({ error: formatSqlErrorPtBr(err instanceof Error ? err.message : String(err)) });
    }
  });

  // Reject Pending Message
  app.post('/api/messages/:id/reject', (req, res) => {
    try {
      const { id } = req.params;
      const { reason, approverRole, approverLabel, actorName } = req.body as {
        reason: string;
        approverRole: UserRole;
        approverLabel: string;
        actorName: string;
      };
      if (!canRoleApproveMessages(approverRole)) {
        return res.status(403).json({
          error: 'HTTP 403 Forbidden: Perfil sem permissão para reprovar mensagens.',
        });
      }
      if (!reason?.trim()) {
        return res.status(400).json({ error: 'Justificativa é obrigatória para reprovação.' });
      }
      const updated = rejectMessageRecord(id, reason.trim(), approverLabel, actorName);
      if (!updated) {
        return res.status(404).json({ error: 'Comunicado não encontrado.' });
      }
      res.json({
        message: updated,
        messages: listMessages(),
        auditLogs: listAuditLogs(40),
        schemaTables: getSchemaMetadata(),
      });
    } catch (err) {
      res.status(400).json({ error: formatSqlErrorPtBr(err instanceof Error ? err.message : String(err)) });
    }
  });

  // Execute Interactive SQL Console Query / DML
  app.post('/api/sql/execute', (req, res) => {
    const { sql } = req.body as { sql?: string };
    const result = executeInteractiveSql(sql || '');
    res.json({
      result,
      students: listStudents(),
      messages: listMessages(),
      auditLogs: listAuditLogs(40),
      schemaTables: getSchemaMetadata(),
    });
  });

  // Reset SQLite Database to Clean Initial Seed
  app.post('/api/sql/reset', (_req, res) => {
    try {
      resetDatabase();
      res.json({
        ok: true,
        profiles: listProfiles(),
        classrooms: listClassrooms(),
        students: listStudents(),
        messages: listMessages(),
        auditLogs: listAuditLogs(40),
        schemaTables: getSchemaMetadata(),
      });
    } catch (err) {
      res.status(500).json({ error: formatSqlErrorPtBr(err instanceof Error ? err.message : String(err)) });
    }
  });

  // Git Repository Telemetry
  app.get('/api/git/info', async (_req, res) => {
    const info = await readGitInfo();
    res.json(info);
  });

  // Vite integration in development / static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEC Server listening on http://localhost:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start SEC server:', err);
  process.exit(1);
});
