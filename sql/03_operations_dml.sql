-- ============================================================================
-- SISTEMA ESCOLA CONECTADA (SEC) — UFMS DIGITAL (Módulo 3: Banco de Dados)
-- Arquivo: 03_operations_dml.sql (DML — Exemplos de Manipulação e Consultas SQL)
-- Contempla: INSERT, UPDATE, DELETE e SELECT com JOINs e Agregações
-- ============================================================================

-- 1. CONSULTA COM INNER JOIN: Cruzamento completo para Injeção de Cabeçalho (Aluno + Turma + Responsável + Prof. Regente)
SELECT
    a.registro_escolar AS Matricula,
    a.nome AS Aluno,
    t.nome AS Turma,
    t.turno AS Turno,
    t.professor_regente_nome AS Professor_Regente,
    r.nome AS Responsavel_Legal,
    r.telefone AS WhatsApp_Destino,
    CASE WHEN a.consentimento_lgpd = 1 THEN 'AUTORIZADO' ELSE 'BLOQUEADO_LGPD' END AS Status_LGPD
FROM alunos a
INNER JOIN turmas t ON a.turma_id = t.id
INNER JOIN responsaveis r ON a.responsavel_id = r.id
ORDER BY t.nome, a.nome;

-- 2. CONSULTA COM AGREGAÇÃO (GROUP BY + COUNT + SUM): Consolidado de Mensagens por Status e Categoria
SELECT
    status AS Situacao_Fila,
    categoria AS Categoria_Comunicado,
    COUNT(id) AS Total_Comunicados,
    SUM(destinatarios_count) AS Alcance_Destinatarios,
    SUM(entregues_count) AS Total_Entregues
FROM mensagens
GROUP BY status, categoria
ORDER BY Total_Comunicados DESC;

-- 3. CONSULTA DE ALERTA PREVENTIVO (WHERE + ORDER BY): Alunos com excesso de faltas ou pendência LGPD
SELECT
    a.registro_escolar,
    a.nome AS Aluno,
    a.faltas_injustificadas,
    a.consentimento_lgpd,
    r.nome AS Responsavel,
    r.telefone
FROM alunos a
INNER JOIN responsaveis r ON a.responsavel_id = r.id
WHERE a.faltas_injustificadas >= 4 OR a.consentimento_lgpd = 0
ORDER BY a.faltas_injustificadas DESC;

-- 4. OPERAÇÃO DE INSERÇÃO (INSERT): Cadastro de novo responsável e respectivo aluno
INSERT INTO responsaveis (id, nome, grau_parentesco, telefone, email)
VALUES ('resp-demo', 'Mariana Teixeira', 'Mãe', '(67) 99111-2233', 'mariana.teixeira@email.com');

INSERT INTO alunos (id, registro_escolar, nome, turma_id, responsavel_id, consentimento_lgpd, data_matricula, faltas_injustificadas)
VALUES ('alu-demo', '2026-0999', 'Pedro Henrique Teixeira', 'turma-4a', 'resp-demo', 1, '2026-11-12', 0);

-- 5. OPERAÇÃO DE ATUALIZAÇÃO (UPDATE): Atualização do termo LGPD da aluna Sofia Helena Dornelles
UPDATE alunos
SET consentimento_lgpd = 1
WHERE id = 'alu-06';

-- 6. OPERAÇÃO DE REMOÇÃO (DELETE): Exclusão segura dos registros de demonstração respeitando chaves estrangeiras
DELETE FROM alunos WHERE id = 'alu-demo';
DELETE FROM responsaveis WHERE id = 'resp-demo';
