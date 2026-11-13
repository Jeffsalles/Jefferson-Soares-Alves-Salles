-- ============================================================================
-- SISTEMA ESCOLA CONECTADA (SEC) — UFMS DIGITAL (Módulo 3: Banco de Dados)
-- Arquivo: 02_seed.sql (DML — Carga Inicial Anonimizada aderente à LGPD)
-- ============================================================================

-- 1. Tipos de Usuário (5 Atores do Diagrama de Casos de Uso)
INSERT INTO tipos_usuario (id, papel, titulacao, pode_enviar_direto, pode_aprovar_docente, apenas_administrativa) VALUES
('tipo-dir', 'direcao', 'Direção Escolar', 1, 1, 0),
('tipo-ped', 'pedagogico', 'Equipe Pedagógica', 1, 1, 0),
('tipo-coord', 'coordenacao', 'Coordenação de Ensino', 1, 1, 0),
('tipo-prof', 'professor', 'Professor Regente', 0, 0, 0),
('tipo-sec', 'secretaria', 'Secretaria Escolar', 1, 0, 1);

-- 2. Usuários do Sistema (Incluindo docentes regentes das turmas)
INSERT INTO usuarios (id, tipo_usuario_id, nome, login, email, cargo, departamento, avatar_url) VALUES
('u-dir', 'tipo-dir', 'Profa. Valéria Rezende', 'valeria.direcao', 'valeria.direcao@escola.ufms.br', 'Diretora Geral', 'Diretoria Executiva', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('u-ped', 'tipo-ped', 'Prof. Marcos Antunes', 'marcos.pedagogico', 'marcos.pedagogico@escola.ufms.br', 'Supervisor Pedagógico', 'Equipe Pedagógica', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'),
('u-coord', 'tipo-coord', 'Profa. Lúcia Silveira', 'lucia.coordenacao', 'lucia.coordenacao@escola.ufms.br', 'Coordenadora de Ensino', 'Coordenação Pedagógica', 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80'),
('u-prof', 'tipo-prof', 'Prof. Carlos Eduardo Mendes', 'carlos.mendes', 'carlos.mendes@escola.ufms.br', 'Professor Regente (4º Ano A)', 'Corpo Docente', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('u-sec', 'tipo-sec', 'Regina Vasconcelos', 'regina.secretaria', 'regina.secretaria@escola.ufms.br', 'Secretária Escolar', 'Secretaria e Registros', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'),
('u-prof2', 'tipo-prof', 'Profa. Mariana Santos', 'mariana.santos', 'mariana.santos@escola.ufms.br', 'Professora Regente (4º Ano B)', 'Corpo Docente', NULL),
('u-prof3', 'tipo-prof', 'Profa. Juliana Oliveira', 'juliana.oliveira', 'juliana.oliveira@escola.ufms.br', 'Professora Regente (5º Ano A)', 'Corpo Docente', NULL),
('u-prof4', 'tipo-prof', 'Prof. Roberto Nogueira', 'roberto.nogueira', 'roberto.nogueira@escola.ufms.br', 'Professor Regente (3º Ano A)', 'Corpo Docente', NULL);

-- 3. Turmas (Espelhamento School+ / TecSystem)
INSERT INTO turmas (id, codigo, nome, sala, turno, professor_regente_id, professor_regente_nome, numero_alunos, completa) VALUES
('turma-4a', 'EF-4A-MAT', '4º Ano A - Fundamental I', 'Sala 04', 'Matutino', 'u-prof', 'Prof. Carlos Eduardo Mendes', 26, 1),
('turma-4b', 'EF-4B-VESP', '4º Ano B - Fundamental I', 'Sala 05', 'Vespertino', 'u-prof2', 'Profa. Mariana Santos', 24, 1),
('turma-5a', 'EF-5A-MAT', '5º Ano A - Fundamental I', 'Sala 06', 'Matutino', 'u-prof3', 'Profa. Juliana Oliveira', 28, 1),
('turma-3a', 'EF-3A-MAT', '3º Ano A - Fundamental I', 'Sala 03', 'Matutino', 'u-prof4', 'Prof. Roberto Nogueira', 25, 1);

-- 4. Responsáveis Legais (Entidade Normalizada 3FN)
INSERT INTO responsaveis (id, nome, grau_parentesco, telefone, email) VALUES
('resp-01', 'Fernanda Albuquerque', 'Mãe', '(67) 99245-8102', 'fernanda.albuquerque@gmail.com'),
('resp-02', 'Rodrigo Costa', 'Pai', '(67) 99188-4390', 'rodrigo.costa@hotmail.com'),
('resp-03', 'Tereza Ferreira', 'Avó', '(67) 99312-7741', 'tereza.ferreira@gmail.com'),
('resp-04', 'Juliana Prado', 'Mãe', '(67) 99655-2109', 'juliana.prado@outlook.com'),
('resp-05', 'Eduardo Carvalho', 'Pai', '(67) 99877-3321', 'eduardo.carvalho@gmail.com'),
('resp-06', 'Camila Dornelles', 'Mãe', '(67) 99234-9011', 'camila.dornelles@yahoo.com.br');

-- 5. Alunos Matriculados
INSERT INTO alunos (id, registro_escolar, nome, turma_id, responsavel_id, consentimento_lgpd, data_matricula, faltas_injustificadas) VALUES
('alu-01', '2026-0401', 'Lucas Gabriel Albuquerque', 'turma-4a', 'resp-01', 1, '2026-01-12', 6),
('alu-02', '2026-0402', 'Beatriz Vasconcellos Costa', 'turma-4a', 'resp-02', 1, '2026-01-14', 1),
('alu-03', '2026-0403', 'Enzo Miguel Ferreira', 'turma-4a', 'resp-03', 1, '2026-01-15', 4),
('alu-04', '2026-0404', 'Larissa Manoela Prado', 'turma-4b', 'resp-04', 1, '2026-01-18', 0),
('alu-05', '2026-0501', 'Thiago Martins Carvalho', 'turma-5a', 'resp-05', 1, '2026-01-20', 7),
('alu-06', '2026-0301', 'Sofia Helena Dornelles', 'turma-3a', 'resp-06', 0, '2026-02-01', 2);

-- 6. Mensagens Iniciais (Fila de Validação e Disparos Efetuados)
INSERT INTO mensagens (
    id, autor_id, autor_nome, autor_papel, categoria, urgencia, canal, destinatario_tipo,
    aluno_id, aluno_nome, turma_id, turma_nome, assunto, conteudo_corpo,
    cabecalho_formatado, mensagem_completa, status, criada_em, validada_por, validada_em,
    destinatarios_count, entregues_count, lidas_count
) VALUES
(
    'msg-01', 'u-prof', 'Prof. Carlos Eduardo Mendes', 'professor', 'frequencia', 'alta', 'whatsapp', 'individual',
    'alu-01', 'Lucas Gabriel Albuquerque', 'turma-4a', '4º Ano A - Fundamental I',
    'Alerta de Frequência - Faltas Consecutivas sem Justificativa',
    'Informamos que o aluno Lucas atingiu 6 faltas consecutivas na disciplina de Matemática nesta quinzena. Solicitamos comparecimento do responsável ou contato com a equipe de apoio pedagógico para acompanhamento.',
    '🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]' || char(10) || '👤 Aluno(a): Lucas Gabriel Albuquerque' || char(10) || '🏫 Turma: 4º Ano A - Fundamental I (Sala 04) | Turno: Matutino' || char(10) || '👨‍🏫 Prof. Regente: Prof. Carlos Eduardo Mendes' || char(10) || '📌 Assunto: ⚠️ [IMPORTANTE] Alerta de Frequência - Faltas Consecutivas sem Justificativa',
    '🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]' || char(10) || '👤 Aluno(a): Lucas Gabriel Albuquerque' || char(10) || '🏫 Turma: 4º Ano A - Fundamental I (Sala 04) | Turno: Matutino' || char(10) || '👨‍🏫 Prof. Regente: Prof. Carlos Eduardo Mendes' || char(10) || '📌 Assunto: ⚠️ [IMPORTANTE] Alerta de Frequência - Faltas Consecutivas sem Justificativa' || char(10) || '----------------------------------------' || char(10) || 'Informamos que o aluno Lucas atingiu 6 faltas consecutivas na disciplina de Matemática nesta quinzena. Solicitamos comparecimento do responsável ou contato com a equipe de apoio pedagógico para acompanhamento.' || char(10) || '----------------------------------------' || char(10) || '🔒 *Canal oficial e unidirecional do SEC (UFMS Digital). Por favor, não responda a esta mensagem. Para dúvidas ou justificativas, contate a secretaria escolar.*',
    'pendente', '2026-11-09 08:30', NULL, NULL, 1, 0, 0
),
(
    'msg-02', 'u-dir', 'Profa. Valéria Rezende', 'direcao', 'reuniao', 'normal', 'whatsapp', 'turma',
    NULL, NULL, 'turma-4a', '4º Ano A - Fundamental I',
    'Convocação para Conselho de Classe e Reunião de Pais do 4º Ano',
    'Prezados pais e responsáveis, convidamos para a nossa Reunião Geral de Pais no dia 14/11 às 19h00 na quadra coberta da escola. A pauta incluirá o desempenho acadêmico do 3º bimestre e o projeto de robótica escolar.',
    '🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]' || char(10) || '🏫 Turma: 4º Ano A - Fundamental I (Sala 04) | Turno: Matutino' || char(10) || '👨‍🏫 Prof. Regente: Prof. Carlos Eduardo Mendes' || char(10) || '📌 Assunto: Convocação para Conselho de Classe e Reunião de Pais do 4º Ano',
    '🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]' || char(10) || '🏫 Turma: 4º Ano A - Fundamental I (Sala 04) | Turno: Matutino' || char(10) || '👨‍🏫 Prof. Regente: Prof. Carlos Eduardo Mendes' || char(10) || '📌 Assunto: Convocação para Conselho de Classe e Reunião de Pais do 4º Ano' || char(10) || '----------------------------------------' || char(10) || 'Prezados pais e responsáveis, convidamos para a nossa Reunião Geral de Pais no dia 14/11 às 19h00 na quadra coberta da escola. A pauta incluirá o desempenho acadêmico do 3º bimestre e o projeto de robótica escolar.' || char(10) || '----------------------------------------' || char(10) || '🔒 *Canal oficial e unidirecional do SEC (UFMS Digital). Por favor, não responda a esta mensagem. Para dúvidas ou justificativas, contate a secretaria escolar.*',
    'enviada', '2026-11-08 14:15', 'Profa. Valéria Rezende (Diretora)', '2026-11-08 14:15', 26, 26, 25
),
(
    'msg-03', 'u-sec', 'Regina Vasconcelos', 'secretaria', 'administrativa', 'normal', 'whatsapp', 'escola_toda',
    NULL, NULL, NULL, NULL,
    'Cronograma de Rematrícula e Atualização Cadastral 2027',
    'A Secretaria Escolar informa que o período de rematrícula para o ano letivo de 2027 terá início na próxima segunda-feira. Favor apresentar comprovante de residência e carteira de vacinação atualizada.',
    '🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]' || char(10) || '📌 Assunto: Cronograma de Rematrícula e Atualização Cadastral 2027',
    '🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]' || char(10) || '📌 Assunto: Cronograma de Rematrícula e Atualização Cadastral 2027' || char(10) || '----------------------------------------' || char(10) || 'A Secretaria Escolar informa que o período de rematrícula para o ano letivo de 2027 terá início na próxima segunda-feira. Favor apresentar comprovante de residência e carteira de vacinação atualizada.' || char(10) || '----------------------------------------' || char(10) || '🔒 *Canal oficial e unidirecional do SEC (UFMS Digital). Por favor, não responda a esta mensagem. Para dúvidas ou justificativas, contate a secretaria escolar.*',
    'enviada', '2026-11-07 10:00', 'Regina Vasconcelos (Secretaria ADM)', '2026-11-07 10:00', 102, 101, 98
),
(
    'msg-04', 'u-prof', 'Prof. Carlos Eduardo Mendes', 'professor', 'apresentacao', 'normal', 'whatsapp', 'turma',
    NULL, NULL, 'turma-4a', '4º Ano A - Fundamental I',
    'Feira de Ciências - Materiais para Maquete do Sistema Solar',
    'Solicitamos aos alunos do 4º Ano A que tragam até sexta-feira bolas de isopor, tintas guache e papel machê para o trabalho prático de Ciências que será apresentado no evento cultural.',
    '🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]' || char(10) || '🏫 Turma: 4º Ano A - Fundamental I (Sala 04) | Turno: Matutino' || char(10) || '👨‍🏫 Prof. Regente: Prof. Carlos Eduardo Mendes' || char(10) || '📌 Assunto: Feira de Ciências - Materiais para Maquete do Sistema Solar',
    '🏛️ [SEC - EMEIEF Prof. José Antônio de Miranda]' || char(10) || '🏫 Turma: 4º Ano A - Fundamental I (Sala 04) | Turno: Matutino' || char(10) || '👨‍🏫 Prof. Regente: Prof. Carlos Eduardo Mendes' || char(10) || '📌 Assunto: Feira de Ciências - Materiais para Maquete do Sistema Solar' || char(10) || '----------------------------------------' || char(10) || 'Solicitamos aos alunos do 4º Ano A que tragam até sexta-feira bolas de isopor, tintas guache e papel machê para o trabalho prático de Ciências que será apresentado no evento cultural.' || char(10) || '----------------------------------------' || char(10) || '🔒 *Canal oficial e unidirecional do SEC (UFMS Digital). Por favor, não responda a esta mensagem. Para dúvidas ou justificativas, contate a secretaria escolar.*',
    'pendente', '2026-11-09 11:20', NULL, NULL, 26, 0, 0
);

-- 7. Auditoria LGPD Inicial
INSERT INTO auditoria_lgpd (entidade, entidade_id, acao, detalhes, usuario_responsavel, executado_em) VALUES
('alunos', 'alu-01', 'INSERT', 'Sincronização inicial de matrícula 2026-0401 via School+ com termo LGPD ativo.', 'Regina Vasconcelos', '2026-11-07 09:00'),
('mensagens', 'msg-03', 'DISPARO', 'Disparo broadcast administrativo para 102 responsáveis habilitados.', 'Regina Vasconcelos', '2026-11-07 10:00'),
('mensagens', 'msg-02', 'DISPARO', 'Disparo direto da Direção para turma 4º Ano A (26 destinatários).', 'Profa. Valéria Rezende', '2026-11-08 14:15'),
('mensagens', 'msg-01', 'INSERT', 'Mensagem docente retida na fila hierárquica aguardando validação.', 'Prof. Carlos Eduardo Mendes', '2026-11-09 08:30');
