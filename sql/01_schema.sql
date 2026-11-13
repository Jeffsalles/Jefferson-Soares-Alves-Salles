-- ============================================================================
-- SISTEMA ESCOLA CONECTADA (SEC) — UFMS DIGITAL (Módulo 3: Banco de Dados)
-- Escola Parceira: EMEIEF Professor José Antônio de Miranda
-- Acadêmico: Jefferson Soares Alves Salles
-- Arquivo: 01_schema.sql (DDL — Definição de Estrutura e Restrições)
-- Padrão: SQL Relacional Normalizado (1FN, 2FN e 3NF)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- Limpeza segura em ordem reversa de dependência referencial
DROP TABLE IF EXISTS auditoria_lgpd;
DROP TABLE IF EXISTS mensagens;
DROP TABLE IF EXISTS alunos;
DROP TABLE IF EXISTS responsaveis;
DROP TABLE IF EXISTS turmas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS tipos_usuario;

-- 1. Tabela de Tipos de Usuário (RBAC - Controle de Acesso Baseado em Papéis)
-- Corresponde à classe TipoUsuario do Diagrama de Classes
CREATE TABLE tipos_usuario (
    id TEXT PRIMARY KEY,
    papel TEXT NOT NULL UNIQUE CHECK (papel IN ('direcao', 'pedagogico', 'coordenacao', 'professor', 'secretaria')),
    titulacao TEXT NOT NULL,
    pode_enviar_direto INTEGER NOT NULL DEFAULT 0 CHECK (pode_enviar_direto IN (0, 1)),
    pode_aprovar_docente INTEGER NOT NULL DEFAULT 0 CHECK (pode_aprovar_docente IN (0, 1)),
    apenas_administrativa INTEGER NOT NULL DEFAULT 0 CHECK (apenas_administrativa IN (0, 1))
);

-- 2. Tabela de Usuários do Sistema (Atores Internos da Escola)
-- Corresponde à classe Usuario do Diagrama de Classes
CREATE TABLE usuarios (
    id TEXT PRIMARY KEY,
    tipo_usuario_id TEXT NOT NULL,
    nome TEXT NOT NULL,
    login TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    cargo TEXT NOT NULL,
    departamento TEXT NOT NULL,
    avatar_url TEXT,
    ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
    criado_em TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    CONSTRAINT fk_usuario_tipo FOREIGN KEY (tipo_usuario_id)
        REFERENCES tipos_usuario(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 3. Tabela de Turmas (Espelhamento School+ / TecSystem)
-- Corresponde à classe Turma do Diagrama de Classes
CREATE TABLE turmas (
    id TEXT PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    sala TEXT NOT NULL,
    turno TEXT NOT NULL CHECK (turno IN ('Matutino', 'Vespertino', 'Noturno')),
    professor_regente_id TEXT NOT NULL,
    professor_regente_nome TEXT NOT NULL,
    numero_alunos INTEGER NOT NULL DEFAULT 0 CHECK (numero_alunos >= 0),
    completa INTEGER NOT NULL DEFAULT 1 CHECK (completa IN (0, 1)),
    CONSTRAINT fk_turma_regente FOREIGN KEY (professor_regente_id)
        REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 4. Tabela de Responsáveis Legais (Normalizada na 3FN)
-- Separação da entidade Responsavel para evitar redundância quando um responsável possui mais de um filho matriculado
CREATE TABLE responsaveis (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    grau_parentesco TEXT NOT NULL CHECK (grau_parentesco IN ('Mãe', 'Pai', 'Avó', 'Avô', 'Tutor Legal')),
    telefone TEXT NOT NULL CHECK (length(trim(telefone)) >= 10),
    email TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 5. Tabela de Alunos (Espelhamento School+ com Consentimento LGPD)
-- Corresponde à classe Aluno do Diagrama de Classes
CREATE TABLE alunos (
    id TEXT PRIMARY KEY,
    registro_escolar TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    turma_id TEXT NOT NULL,
    responsavel_id TEXT NOT NULL,
    consentimento_lgpd INTEGER NOT NULL DEFAULT 0 CHECK (consentimento_lgpd IN (0, 1)),
    data_matricula TEXT NOT NULL,
    faltas_injustificadas INTEGER NOT NULL DEFAULT 0 CHECK (faltas_injustificadas >= 0),
    CONSTRAINT fk_aluno_turma FOREIGN KEY (turma_id)
        REFERENCES turmas(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_aluno_responsavel FOREIGN KEY (responsavel_id)
        REFERENCES responsaveis(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 6. Tabela de Mensagens / Comunicados Institucionais (FormularioMensagem)
-- Registra autor, categoria, urgência, cabeçalho injetado e fila de validação hierárquica
CREATE TABLE mensagens (
    id TEXT PRIMARY KEY,
    autor_id TEXT NOT NULL,
    autor_nome TEXT NOT NULL,
    autor_papel TEXT NOT NULL CHECK (autor_papel IN ('direcao', 'pedagogico', 'coordenacao', 'professor', 'secretaria')),
    categoria TEXT NOT NULL CHECK (categoria IN ('frequencia', 'reuniao', 'indisciplina', 'apresentacao', 'demanda_particular', 'administrativa')),
    urgencia TEXT NOT NULL CHECK (urgencia IN ('baixa', 'normal', 'alta', 'urgente')),
    canal TEXT NOT NULL CHECK (canal IN ('whatsapp', 'sms', 'hibrido')),
    destinatario_tipo TEXT NOT NULL CHECK (destinatario_tipo IN ('individual', 'turma', 'escola_toda')),
    aluno_id TEXT,
    aluno_nome TEXT,
    turma_id TEXT,
    turma_nome TEXT,
    assunto TEXT NOT NULL,
    conteudo_corpo TEXT NOT NULL,
    cabecalho_formatado TEXT NOT NULL,
    mensagem_completa TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('rascunho', 'pendente', 'aprovada', 'reprovada', 'enviada')),
    criada_em TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    validada_por TEXT,
    validada_em TEXT,
    justificativa_rejeicao TEXT,
    destinatarios_count INTEGER NOT NULL DEFAULT 1 CHECK (destinatarios_count >= 0),
    entregues_count INTEGER NOT NULL DEFAULT 0 CHECK (entregues_count >= 0),
    lidas_count INTEGER NOT NULL DEFAULT 0 CHECK (lidas_count >= 0),
    CONSTRAINT fk_mensagem_autor FOREIGN KEY (autor_id)
        REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_mensagem_aluno FOREIGN KEY (aluno_id)
        REFERENCES alunos(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_mensagem_turma FOREIGN KEY (turma_id)
        REFERENCES turmas(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- 7. Tabela de Auditoria e Conformidade LGPD (Lei nº 13.709/2018)
-- Garante rastreabilidade de inserções, alterações de consentimento, aprovações e disparos
CREATE TABLE auditoria_lgpd (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entidade TEXT NOT NULL,
    entidade_id TEXT NOT NULL,
    acao TEXT NOT NULL CHECK (acao IN ('INSERT', 'UPDATE', 'DELETE', 'DISPARO', 'APROVACAO', 'REPROVACAO')),
    detalhes TEXT NOT NULL,
    usuario_responsavel TEXT NOT NULL,
    executado_em TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Índices para otimização de consultas frequentes e joins
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario_id);
CREATE INDEX idx_alunos_turma ON alunos(turma_id);
CREATE INDEX idx_alunos_responsavel ON alunos(responsavel_id);
CREATE INDEX idx_alunos_lgpd ON alunos(consentimento_lgpd);
CREATE INDEX idx_mensagens_status ON mensagens(status);
CREATE INDEX idx_mensagens_autor ON mensagens(autor_id);
CREATE INDEX idx_auditoria_entidade ON auditoria_lgpd(entidade, entidade_id);
