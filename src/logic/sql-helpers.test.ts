import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifySqlStatement,
  validateConsoleSql,
  splitSqlStatements,
  formatSqlErrorPtBr,
} from './sql-helpers';

test('classifySqlStatement identifies SELECT, WITH, INSERT, UPDATE, DELETE and DDL despite comments', () => {
  assert.equal(classifySqlStatement('-- comentário\nSELECT * FROM alunos;'), 'SELECT');
  assert.equal(classifySqlStatement('/* bloco */ WITH x AS (SELECT 1) SELECT * FROM x'), 'SELECT');
  assert.equal(classifySqlStatement('INSERT INTO alunos VALUES (...)'), 'INSERT');
  assert.equal(classifySqlStatement('UPDATE alunos SET consentimento_lgpd = 1'), 'UPDATE');
  assert.equal(classifySqlStatement('DELETE FROM alunos WHERE id = "x"'), 'DELETE');
  assert.equal(classifySqlStatement('CREATE TABLE teste (id TEXT PRIMARY KEY)'), 'DDL');
});

test('validateConsoleSql allows safe queries/DML and blocks DROP TABLE or ATTACH', () => {
  assert.equal(validateConsoleSql('SELECT * FROM alunos').valid, true);
  assert.equal(validateConsoleSql('UPDATE alunos SET faltas_injustificadas = 0 WHERE id = "alu-01"').valid, true);
  assert.equal(validateConsoleSql('DROP TABLE alunos').valid, false);
  assert.equal(validateConsoleSql('ATTACH DATABASE "x.db" AS x').valid, false);
  assert.equal(validateConsoleSql('-- only comment').valid, false);
});

test('splitSqlStatements splits multi-statement scripts cleanly without breaking semicolons in strings', () => {
  const script = `
    -- Header comment
    CREATE TABLE t (id TEXT PRIMARY KEY, txt TEXT);
    INSERT INTO t VALUES ('1', 'Olá; mundo; teste');
    /* block ; comment */
    SELECT * FROM t;
  `;
  const parts = splitSqlStatements(script);
  assert.equal(parts.length, 3);
  assert.match(parts[0], /CREATE TABLE t/);
  assert.match(parts[1], /'Olá; mundo; teste'/);
  assert.match(parts[2], /SELECT \* FROM t/);
});

test('formatSqlErrorPtBr translates constraint errors cleanly', () => {
  assert.match(formatSqlErrorPtBr('FOREIGN KEY constraint failed'), /Chave Estrangeira/);
  assert.match(formatSqlErrorPtBr('UNIQUE constraint failed: alunos.registro_escolar'), /alunos\.registro_escolar/);
  assert.match(formatSqlErrorPtBr('CHECK constraint failed: turno'), /CHECK/);
  assert.match(formatSqlErrorPtBr('NOT NULL constraint failed: alunos.nome'), /alunos\.nome/);
});
