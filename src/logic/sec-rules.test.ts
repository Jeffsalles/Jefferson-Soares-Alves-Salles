import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canRoleAuthorCategory,
  requiresHierarchicalApproval,
  canRoleApproveMessages,
  generateSecFormattedMessage,
  validateStudentDispatch,
} from './sec-rules';
import { Student } from '../types';

test('RBAC: Professor can only author docent categories, not administrative', () => {
  assert.equal(canRoleAuthorCategory('professor', 'frequencia'), true);
  assert.equal(canRoleAuthorCategory('professor', 'indisciplina'), true);
  assert.equal(canRoleAuthorCategory('professor', 'reuniao'), true);
  assert.equal(canRoleAuthorCategory('professor', 'administrativa'), false);
});

test('RBAC: Secretaria can only author administrative messages', () => {
  assert.equal(canRoleAuthorCategory('secretaria', 'administrativa'), true);
  assert.equal(canRoleAuthorCategory('secretaria', 'indisciplina'), false);
  assert.equal(canRoleAuthorCategory('secretaria', 'frequencia'), false);
});

test('RBAC: Direção, Pedagógico and Coordenação can author all categories', () => {
  (['direcao', 'pedagogico', 'coordenacao'] as const).forEach((role) => {
    assert.equal(canRoleAuthorCategory(role, 'administrativa'), true);
    assert.equal(canRoleAuthorCategory(role, 'indisciplina'), true);
    assert.equal(canRoleAuthorCategory(role, 'reuniao'), true);
  });
});

test('Hierarchical Queue: Only Professor messages require approval', () => {
  assert.equal(requiresHierarchicalApproval('professor'), true);
  assert.equal(requiresHierarchicalApproval('direcao'), false);
  assert.equal(requiresHierarchicalApproval('coordenacao'), false);
  assert.equal(requiresHierarchicalApproval('pedagogico'), false);
  assert.equal(requiresHierarchicalApproval('secretaria'), false);
});

test('Hierarchical Queue: Only leadership roles can approve messages', () => {
  assert.equal(canRoleApproveMessages('direcao'), true);
  assert.equal(canRoleApproveMessages('coordenacao'), true);
  assert.equal(canRoleApproveMessages('pedagogico'), true);
  assert.equal(canRoleApproveMessages('professor'), false);
  assert.equal(canRoleApproveMessages('secretaria'), false);
});

test('Header Injection: Properly includes school, student, class, teacher regente and disclaimer', () => {
  const result = generateSecFormattedMessage({
    alunoNome: 'Gabriel Henrique Silva',
    turmaNome: '4º Ano B - Ensino Fundamental',
    sala: '04',
    turno: 'Matutino',
    professorRegenteNome: 'Mariana Santos',
    assunto: 'Aviso de Reunião Pedagógica',
    conteudoCorpo: 'Convidamos os responsáveis para a reunião trimestral nesta quinta-feira.',
    categoria: 'reuniao',
    urgencia: 'normal',
  });

  assert.match(result.cabecalho, /\[SEC - EMEIEF Prof\. José Antônio de Miranda\]/);
  assert.match(result.cabecalho, /Gabriel Henrique Silva/);
  assert.match(result.cabecalho, /4º Ano B - Ensino Fundamental/);
  assert.match(result.cabecalho, /Mariana Santos/);
  assert.match(result.mensagemCompleta, /Canal oficial e unidirecional do SEC/);
});

test('LGPD Validation: Rejects dispatch if consent is missing or phone is invalid', () => {
  const studentValid: Student = {
    id: 's1',
    registroEscolar: '2026-001',
    nome: 'Ana Beatriz',
    turmaId: 't1',
    responsavelNome: 'Claudio Beatriz',
    responsavelGrau: 'Pai',
    responsavelTelefone: '(67) 99123-4567',
    responsavelEmail: 'claudio@email.com',
    consentimentoLGPD: true,
    dataMatricula: '2026-01-15',
    faltasInjustificadas: 1,
  };

  assert.equal(validateStudentDispatch(studentValid).valid, true);

  const studentNoConsent: Student = { ...studentValid, consentimentoLGPD: false };
  const consentResult = validateStudentDispatch(studentNoConsent);
  assert.equal(consentResult.valid, false);
  assert.match(consentResult.error || '', /LGPD/);

  const studentBadPhone: Student = { ...studentValid, responsavelTelefone: '123' };
  const phoneResult = validateStudentDispatch(studentBadPhone);
  assert.equal(phoneResult.valid, false);
  assert.match(phoneResult.error || '', /Telefone/);
});
