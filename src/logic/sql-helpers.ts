export type SqlStatementKind = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'PRAGMA' | 'DDL' | 'OTHER';

/**
 * Strips leading SQL single-line (--) and block (/* ... *\/) comments to inspect the verb.
 */
export function stripLeadingSqlComments(sql: string): string {
  let remaining = sql.trimStart();
  while (remaining.length > 0) {
    if (remaining.startsWith('--')) {
      const nl = remaining.indexOf('\n');
      remaining = nl === -1 ? '' : remaining.slice(nl + 1).trimStart();
    } else if (remaining.startsWith('/*')) {
      const end = remaining.indexOf('*/');
      remaining = end === -1 ? '' : remaining.slice(end + 2).trimStart();
    } else {
      break;
    }
  }
  return remaining;
}

/**
 * Classifies a single SQL statement based on its leading keyword.
 */
export function classifySqlStatement(sql: string): SqlStatementKind {
  const cleaned = stripLeadingSqlComments(sql).toUpperCase();
  if (!cleaned) return 'OTHER';
  if (cleaned.startsWith('SELECT') || cleaned.startsWith('WITH') || cleaned.startsWith('EXPLAIN')) {
    return 'SELECT';
  }
  if (cleaned.startsWith('INSERT')) return 'INSERT';
  if (cleaned.startsWith('UPDATE')) return 'UPDATE';
  if (cleaned.startsWith('DELETE')) return 'DELETE';
  if (cleaned.startsWith('PRAGMA')) return 'PRAGMA';
  if (
    cleaned.startsWith('CREATE') ||
    cleaned.startsWith('ALTER') ||
    cleaned.startsWith('DROP')
  ) {
    return 'DDL';
  }
  return 'OTHER';
}

/**
 * Validates whether user-submitted SQL from the interactive console is safe to run.
 * Blocks destructive system-wide commands (ATTACH, DETACH, VACUUM, DROP TABLE on core schema).
 */
export function validateConsoleSql(sql: string): { valid: boolean; reason?: string } {
  const trimmed = stripLeadingSqlComments(sql);
  if (!trimmed) {
    return { valid: false, reason: 'Digite uma instrução SQL válida antes de executar.' };
  }

  const upper = trimmed.toUpperCase();
  if (/\bATTACH\b/.test(upper) || /\bDETACH\b/.test(upper)) {
    return { valid: false, reason: 'Comandos ATTACH/DETACH não são permitidos no console interativo.' };
  }
  if (/\bDROP\s+TABLE\b/.test(upper)) {
    return {
      valid: false,
      reason: 'DROP TABLE está bloqueado no console interativo para preservar o esquema oficial. Use "Resetar Banco" para restaurar os dados.',
    };
  }
  return { valid: true };
}

/**
 * Splits a multi-statement SQL script by semicolons outside string literals and comments.
 */
export function splitSqlStatements(script: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < script.length; i++) {
    const ch = script[i];
    const next = script[i + 1] || '';

    if (inLineComment) {
      current += ch;
      if (ch === '\n') inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      current += ch;
      if (ch === '*' && next === '/') {
        current += '/';
        i++;
        inBlockComment = false;
      }
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote) {
      if (ch === '-' && next === '-') {
        current += '--';
        i++;
        inLineComment = true;
        continue;
      }
      if (ch === '/' && next === '*') {
        current += '/*';
        i++;
        inBlockComment = true;
        continue;
      }
    }

    if (ch === "'" && !inDoubleQuote) {
      if (inSingleQuote && next === "'") {
        current += "''";
        i++;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      current += ch;
      continue;
    }

    if (ch === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      current += ch;
      continue;
    }

    if (ch === ';' && !inSingleQuote && !inDoubleQuote) {
      const trimmed = current.trim();
      if (trimmed && stripLeadingSqlComments(trimmed).length > 0) {
        statements.push(trimmed);
      }
      current = '';
      continue;
    }

    current += ch;
  }

  const tail = current.trim();
  if (tail && stripLeadingSqlComments(tail).length > 0) {
    statements.push(tail);
  }

  return statements;
}

/**
 * Translates common SQLite constraint and syntax error messages into clear Portuguese explanations.
 */
export function formatSqlErrorPtBr(rawMessage: string): string {
  if (rawMessage.includes('FOREIGN KEY constraint failed')) {
    return 'Violação de Chave Estrangeira (FOREIGN KEY): o registro referenciado não existe ou está vinculado a outros registros protegidos.';
  }
  if (rawMessage.includes('UNIQUE constraint failed')) {
    const match = rawMessage.match(/UNIQUE constraint failed:\s*([^\s]+)/i);
    const col = match ? match[1] : 'campo único';
    return `Violação de Unicidade (UNIQUE): já existe um registro cadastrado com o mesmo valor em "${col}".`;
  }
  if (rawMessage.includes('CHECK constraint failed')) {
    return 'Violação de Restrição de Domínio (CHECK): o valor informado não atende às regras válidas da tabela.';
  }
  if (rawMessage.includes('NOT NULL constraint failed')) {
    const match = rawMessage.match(/NOT NULL constraint failed:\s*([^\s]+)/i);
    const col = match ? match[1] : 'obrigatório';
    return `Violação de Campo Obrigatório (NOT NULL): a coluna "${col}" não pode ser nula.`;
  }
  return rawMessage;
}
