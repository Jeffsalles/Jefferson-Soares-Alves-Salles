import React, { useState } from 'react';
import {
  Copy,
  Check,
  Printer,
  ExternalLink,
  Github,
  Layers,
  Sparkles,
  Database,
  GitBranch,
  ShieldCheck,
  Table2,
  Terminal,
} from 'lucide-react';
import type { GitInfoResponse, TableSchemaInfo } from '../types';

interface DocumentationReportViewProps {
  schemaTables?: TableSchemaInfo[];
  gitInfo?: GitInfoResponse | null;
  studentCount?: number;
  messageCount?: number;
  auditLogsCount?: number;
}

export const DocumentationReportView: React.FC<DocumentationReportViewProps> = ({
  schemaTables = [],
  gitInfo = null,
  studentCount = 6,
  messageCount = 5,
  auditLogsCount = 2,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedModule, setSelectedModule] = useState<'m3' | 'm2'>('m3');

  const githubUrl = 'https://github.com/jefferson-salles/sec-escola-conectada';
  const totalTables = schemaTables.length || 7;
  const totalCommits = gitInfo?.totalCommits ?? 0;

  const module3ReportText = `
TEMPLATE DO ESTUDANTE
Banco de Dados e Controle de versão
AVALIAÇÃO DO MÓDULO 3 - Banco de Dados e Controle de versão

Projeto de Extensão: Programa de Extensão UFMS Digital (95DX7.200525)
Nome completo: Jefferson Soares Alves Salles
Disciplina: Projeto Integrador de Tecnologia da Informação
Semestre letivo: 2026.2
Curso: Tecnologia da Informação
Público-alvo: Gestores escolares, secretários, professores, equipe pedagógica e pais/responsáveis dos alunos da rede municipal de ensino.
Local de realização: EMEIEF Professor José Antônio de Miranda
Título da ação: SISTEMA ESCOLA CONECTADA (SEC): MODELAGEM RELACIONAL DE BANCO DE DADOS E VERSIONAMENTO PARA COMUNICAÇÃO ESCOLAR UNIDIRECIONAL

Resumo:
O presente relatório apresenta a evolução arquitetural do Sistema Escola Conectada (SEC), desenvolvido no Programa de Extensão UFMS Digital para a EMEIEF Professor José Antônio de Miranda, com foco na modelagem de banco de dados relacional e na implantação de controle de versão profissional. A solução substitui o armazenamento volátil e os processos manuais em papel por um banco de dados relacional normalizado até a Terceira Forma Normal (3FN), composto por sete entidades integradas (tipos_usuario, usuarios, turmas, responsaveis, alunos, mensagens e auditoria_lgpd) implementadas em SQLite via SQL DDL e DML reais no servidor Node.js/Express. O sistema garante integridade referencial estrita (PRAGMA foreign_keys = ON), restrições CHECK e UNIQUE, operações completas de manipulação (INSERT, SELECT com JOIN/GROUP BY, UPDATE e DELETE) e trilha de auditoria em conformidade com a LGPD (Lei nº 13.709/2018). Paralelamente, todo o ciclo de desenvolvimento foi gerenciado com Git e estruturado para publicação no GitHub, utilizando ramificações temáticas (feature/*), merges controlados e commits semânticos (Conventional Commits).

Palavras-chave: Banco de Dados Relacional. SQL. Normalização. Controle de Versão. Git e GitHub. UFMS Digital.

1. Introdução:
A persistência confiável de informações e a rastreabilidade da evolução do código-fonte constituem pilares indispensáveis para sistemas de informação educacionais. No contexto da EMEIEF Professor José Antônio de Miranda, a substituição dos bilhetes impressos em papel pelo Sistema Escola Conectada (SEC) exige não apenas uma interface web responsiva, mas uma camada de dados íntegra capaz de armazenar vínculos entre alunos, responsáveis legais, turmas, professores regentes e comunicados institucionais com segurança jurídica. Sem um modelo de banco de dados formalmente normalizado e sem controle de versão disciplinado, evoluções no software poderiam gerar inconsistências cadastrais, falhas no envio de alertas de emergência ou perda do histórico de alterações.
Para atender a esses requisitos no Módulo 3, optou-se pelo SGBD relacional SQLite integrado nativamente via módulo node:sqlite em servidor Node.js/Express, aliado ao sistema de controle de versão distribuído Git com repositório organizado para o GitHub. A escolha justifica-se pela aderência rigorosa ao padrão SQL (DDL e DML), suporte nativo a chaves estrangeiras e transações ACID, facilidade de portabilidade acadêmica sem dependência de infraestrutura onerosa externa e rastreabilidade integral de commits e branches.

2. Objetivo Geral
Desenvolver e integrar um banco de dados relacional normalizado em SQL ao Sistema Escola Conectada (SEC), aplicando boas práticas de modelagem de dados, integridade referencial, manipulação CRUD e gerenciamento sistemático do código-fonte por meio do sistema de controle de versão Git e repositório no GitHub.

3. Objetivos Específicos
- Projetar um modelo de dados relacional eficiente (Diagrama Entidade-Relacionamento — DER) para o SEC, definindo entidades, atributos, cardinalidades e restrições de integridade até a Terceira Forma Normal (3FN);
- Implementar o esquema físico do banco de dados utilizando scripts SQL DDL (CREATE TABLE, PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK e índices) e carga inicial anonimizada (seed DML);
- Executar e disponibilizar na aplicação web operações completas de manipulação de dados (INSERT, UPDATE, DELETE e SELECT com INNER JOIN, WHERE e GROUP BY), além de trilha de auditoria LGPD;
- Gerenciar toda a evolução do projeto utilizando o controle de versão Git com boas práticas (.gitignore, branches por funcionalidade, merges e Conventional Commits) e publicar o código em repositório no GitHub.

4. Justificativa e Delimitação do Problema
A relevância do módulo de persistência e versionamento reside na confiabilidade operacional da comunicação entre a escola e as famílias. Erros de redundância cadastral (como telefones divergentes de um mesmo responsável para dois irmãos) ou exclusões acidentais comprometeriam a eficácia do disparo unidirecional. A normalização em 3FN elimina anomalias de inserção, atualização e remoção, enquanto as chaves estrangeiras e restrições CHECK garantem que nenhum comunicado seja enviado sem vínculo válido ou sem consentimento LGPD ativo.
Quanto às ferramentas, o SQLite com node:sqlite oferece execução embarcada de baixíssima latência, compatibilidade integral com SQL padrão e integridade transacional ACID, sendo escalável futuramente para PostgreSQL com mínima adaptação dos scripts SQL. Já o Git e o GitHub asseguram histórico auditável de cada entrega, isolamento seguro de novas funcionalidades em branches e colaboração contínua. O escopo delimita-se à persistência local transacional das sete tabelas centrais do SEC e ao versionamento completo do projeto web full-stack.

5. Fundamentação Teórica
Segundo Elmasri e Navathe (2018), a modelagem conceitual e lógica de bancos de dados relacionais permite representar com precisão as regras de negócio do domínio antes da codificação física, prevenindo redundâncias por meio do processo de normalização (1FN, 2FN e 3FN). Silberschatz, Korth e Sudarshan (2020) ressaltam que a definição explícita de chaves primárias, chaves estrangeiras e restrições de integridade referencial assegura a consistência lógica entre entidades dependentes mesmo diante de operações concorrentes.
Date (2004) destaca que a linguagem SQL padroniza tanto a definição estrutural dos dados (DDL — Data Definition Language) quanto sua consulta e modificação (DML — Data Manipulation Language), viabilizando cruzamentos relacionais complexos via junções (JOIN) e agregações (GROUP BY). Complementarmente, Pressman e Maxim (2021) enfatizam que a gestão de configuração de software é vital para controlar mudanças em sistemas evolutivos. Conforme Chacon e Straub (2014), o Git implementa um modelo distribuído baseado em snapshots imutáveis, no qual o uso de ramificações (branches) e mensagens descritivas de commit sustenta a qualidade e a recuperabilidade do código-fonte. Por fim, a persistência de registros de menores observa os princípios de rastreabilidade e consentimento da LGPD (BRASIL, 2018).

6. Metodologia
6.1 Modelagem do Banco de Dados
O banco de dados do SEC foi modelado seguindo rigorosamente as três primeiras formas normais:
- 1ª Forma Normal (1FN): todos os atributos foram definidos de forma atômica (ex.: separação de nome, grau_parentesco, telefone e email em responsaveis; turno e sala em turmas).
- 2ª Forma Normal (2FN): todas as tabelas possuem chave primária simples (id), eliminando dependências parciais.
- 3ª Forma Normal (3FN): extração de tipos_usuario (regras RBAC) e responsaveis (tutores legais) para tabelas independentes, eliminando dependências transitivas em usuarios e alunos.
Entidades e Cardinalidades:
- tipos_usuario (1) ──< (N) usuarios
- usuarios (1) ──< (N) turmas [professor_regente_id]
- turmas (1) ──< (N) alunos
- responsaveis (1) ──< (N) alunos
- usuarios (1) ──< (N) mensagens [autor_id]
- alunos (0..1) ──< (N) mensagens [aluno_id, ON DELETE SET NULL]
- turmas (0..1) ──< (N) mensagens [turma_id, ON DELETE SET NULL]
- auditoria_lgpd (tabela independente de rastreabilidade de operações).

6.2 Implementação e Manipulação de Dados
O esquema físico foi implementado no arquivo sql/01_schema.sql com comandos CREATE TABLE, índices de desempenho (CREATE INDEX) e restrições CHECK, UNIQUE e FOREIGN KEY (ON UPDATE CASCADE, ON DELETE RESTRICT/SET NULL). A carga inicial foi estruturada em sql/02_seed.sql com registros anonimizados e conformes à LGPD, e os exemplos de manipulação em sql/03_operations_dml.sql. No backend (server.ts e src/db/database.ts), habilitou-se PRAGMA foreign_keys = ON e implementou-se a API RESTful (/api/bootstrap, /api/students, /api/messages, /api/sql/execute, /api/sql/reset) conectada à interface web e ao Console SQL interativo.

6.3 Uso do Controle de Versão
O repositório Git foi inicializado na branch principal main com arquivo .gitignore configurado para ignorar node_modules/, dist/, variáveis de ambiente (.env*) e arquivos binários locais do banco (*.db). A evolução do Módulo 3 foi organizada em branches temáticas isoladas:
- feature/modelagem-bd: criação do modelo relacional 3FN e dos scripts sql/01_schema.sql, sql/02_seed.sql e sql/03_operations_dml.sql;
- feature/backend-sqlite: implementação da camada de persistência node:sqlite, validadores SQL e endpoints Express;
- feature/interface-modulo3: desenvolvimento do Estúdio DER & Console SQL, CRUD completo na interface e inspetor Git em tempo real.
Todas as ramificações foram integradas à branch main via merge --no-ff, mantendo mensagens semânticas no padrão Conventional Commits (feat, fix, test, docs).
Link do repositório: ${githubUrl}

7. Resultados Preliminares: Solução Inicial
A implementação resultou em uma plataforma full-stack funcional com banco de dados SQLite persistente e gerenciamento completo via interface web:
- Estúdio DER & Dicionário de Dados: visualização interativa das ${totalTables} tabelas, colunas, chaves PK/FK e contagem de registros em tempo real;
- Console SQL Interativo: execução direta de consultas SELECT com INNER JOIN/GROUP BY/WHERE e operações INSERT, UPDATE e DELETE com validação de integridade referencial (bloqueio de FK inválida);
- CRUD Completo em Alunos & Responsáveis: cadastro, edição (UPDATE), alternância de consentimento LGPD e exclusão (DELETE) persistidos em disco e registrados em auditoria_lgpd;
- Painel Controle de Versão: leitura ao vivo do histórico de commits (${totalCommits} commits registrados) e branches do repositório local via API.

8. Conclusão
A execução do Módulo 3 consolidou a transição do protótipo visual para um sistema de informação com persistência relacional robusta e ciclo de vida versionado. Entre os principais aprendizados destacam-se a aplicação prática da normalização até a 3FN para evitar duplicidade de responsáveis, o rigor das restrições de chave estrangeira e CHECK na camada SQL e a disciplina do fluxo de branches e commits semânticos no Git. Como melhorias futuras, projeta-se a migração transparente dos scripts SQL para um servidor PostgreSQL em nuvem (mantendo a mesma modelagem relacional), a implementação de autenticação JWT com hash Argon2 para os perfis RBAC e a automação de pipelines CI/CD no GitHub Actions para execução contínua dos testes unitários e validação do esquema SQL.

9. Referências
- BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018. Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm. Acesso em: 12 nov. 2026.
- CHACON, Scott; STRAUB, Ben. Pro Git. 2. ed. New York: Apress, 2014. Disponível em: https://git-scm.com/book/en/v2. Acesso em: 12 nov. 2026.
- DATE, Christopher J. Introdução a sistemas de bancos de dados. 8. ed. Rio de Janeiro: Elsevier, 2004.
- ELMASRI, Ramez; NAVATHE, Shamkant B. Sistemas de banco de dados. 7. ed. São Paulo: Pearson Addison Wesley, 2018.
- PRESSMAN, Roger S.; MAXIM, Bruce R. Engenharia de software: uma abordagem profissional. 9. ed. Porto Alegre: AMGH, 2021.
- SILBERSCHATZ, Abraham; KORTH, Henry F.; SUDARSHAN, S. Sistema de banco de dados. 7. ed. Rio de Janeiro: LTC, 2020.
- UNIVERSIDADE FEDERAL DE MATO GROSSO DO SUL. Resolução nº 142, de 21 de dezembro de 2021: Estabelece as normas de Extensão Universitária no âmbito da UFMS. Campo Grande: UFMS, 2021.

10. Link do Repositório
${githubUrl}
  `.trim();

  const module2ReportText = `
TEMPLATE DO ESTUDANTE
Desenvolvimento Web com frameworks e HTML/CSS
AVALIAÇÃO DO MÓDULO 2 - Desenvolvimento Web com frameworks e HTML/CSS

Projeto de Extensão: Programa de Extensão UFMS Digital (95DX7.200525)
Nome completo: Jefferson Soares Alves Salles
Disciplina: Projeto Integrador de Tecnologia da Informação
Semestre letivo: 2026.2
Curso: Tecnologia da Informação
Público-alvo: Gestores escolares, secretários, professores, equipe pedagógica e pais/responsáveis dos alunos.
Local de realização: EMEIEF Professor José Antônio de Miranda
Título da ação: SISTEMA ESCOLA CONECTADA (SEC): PLATAFORMA DE GESTÃO DE COMUNICAÇÃO DIRETA ENTRE INSTITUIÇÃO DE ENSINO E RESPONSÁVEIS
Repositório GitHub: ${githubUrl}

RESUMO:
O presente relatório documenta o desenvolvimento da aplicação web dinâmica e responsiva do Sistema Escola Conectada (SEC), concebida no âmbito do Programa de Extensão UFMS Digital para solucionar os entraves históricos da comunicação analógica na EMEIEF Professor José Antônio de Miranda. Desenvolveu-se uma solução estruturada no ecossistema React 19, TypeScript e Vite, com estilização responsiva via Tailwind CSS e semântica estrita em HTML5 acessível, implementando RBAC para cinco atores escolares, fila hierárquica e injeção automatizada de cabeçalho padronizado.

PALAVRAS-CHAVE: Desenvolvimento Web. Frameworks Front-end. HTML5/CSS3. Mensageria Escolar. UFMS Digital.
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(
      selectedModule === 'm3' ? module3ReportText : module2ReportText
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Toolbar (Hidden when printing PDF) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Relatório Oficial da Atividade Extensionista
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              {selectedModule === 'm3'
                ? 'Template Oficial Módulo 3 (BD & Git)'
                : 'Template Módulo 2 (Web & HTML/CSS)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Preenchido conforme o Template do Estudante UFMS Digital e normas ABNT NBR 6023:2018. Use &quot;Imprimir / Salvar PDF&quot; para gerar o PDF de entrega.
          </p>
        </div>

        {/* Controls & Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs mr-1">
            <button
              type="button"
              onClick={() => setSelectedModule('m3')}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                selectedModule === 'm3'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Módulo 3 (Atual)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModule('m2')}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                selectedModule === 'm2'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Módulo 2
            </button>
          </div>

          <button
            onClick={handleCopy}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Salvar PDF</span>
          </button>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* MODULE 3 REPORT */}
      {selectedModule === 'm3' ? (
        <article className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 max-w-5xl mx-auto space-y-7 font-serif text-slate-800 leading-relaxed print:shadow-none print:border-none print:p-0 print:max-w-none">
          {/* Institutional Header */}
          <header className="text-center border-b border-slate-200 pb-6 space-y-2 font-sans">
            <div className="inline-block px-3 py-1 rounded bg-blue-50 text-blue-900 font-bold text-xs tracking-wider uppercase mb-1">
              Universidade Federal de Mato Grosso do Sul — EaD / AGEAD • UFMS Digital
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              Template do Estudante — Banco de Dados e Controle de Versão
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              AVALIAÇÃO DO MÓDULO 3 — Banco de Dados e Controle de versão
            </p>
          </header>

          {/* Identification Metadata Block */}
          <section className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200 font-sans text-xs space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 font-medium">Projeto de Extensão:</span>
                <p className="font-bold text-slate-900">
                  Programa de Extensão UFMS Digital (95DX7.200525)
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Nome completo:</span>
                <p className="font-bold text-slate-900">Jefferson Soares Alves Salles</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Disciplina:</span>
                <p className="font-bold text-slate-900">
                  Projeto Integrador de Tecnologia da Informação
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Semestre letivo:</span>
                <p className="font-bold text-slate-900">2026.2</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Curso:</span>
                <p className="font-bold text-slate-900">Tecnologia da Informação</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Local de realização:</span>
                <p className="font-bold text-slate-900">
                  EMEIEF Professor José Antônio de Miranda
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 font-medium">Público-alvo:</span>
                <p className="font-bold text-slate-900">
                  Gestores escolares, secretários, professores regentes, equipe pedagógica e pais/responsáveis legais dos estudantes.
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200">
              <span className="text-slate-500 font-medium uppercase tracking-wider text-[10px]">
                Título da ação:
              </span>
              <p className="font-black text-sm text-slate-900 uppercase">
                SISTEMA ESCOLA CONECTADA (SEC): MODELAGEM RELACIONAL DE BANCO DE DADOS E VERSIONAMENTO PARA COMUNICAÇÃO ESCOLAR UNIDIRECIONAL
              </p>
            </div>
          </section>

          {/* Resumo & Palavras-chave */}
          <section className="space-y-3">
            <h2 className="text-base font-bold font-sans text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              Resumo
            </h2>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8">
              O presente relatório apresenta a evolução arquitetural do Sistema Escola Conectada (SEC), desenvolvido no Programa de Extensão UFMS Digital para atender à EMEIEF Professor José Antônio de Miranda, integrando modelagem de banco de dados relacional e controle de versão profissional. A solução substitui o armazenamento volátil e os fluxos analógicos em papel por um banco de dados relacional normalizado até a Terceira Forma Normal (3FN), estruturado em sete tabelas inter-relacionadas (<code className="text-xs bg-slate-100 px-1 rounded font-mono">tipos_usuario</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">usuarios</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">turmas</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">responsaveis</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">alunos</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">mensagens</code> e <code className="text-xs bg-slate-100 px-1 rounded font-mono">auditoria_lgpd</code>) em SQLite via scripts SQL DDL e DML executados por servidor Node.js/Express. O banco impõe integridade referencial (<code className="text-xs bg-slate-100 px-1 rounded font-mono">PRAGMA foreign_keys = ON</code>), restrições <code className="text-xs bg-slate-100 px-1 rounded font-mono">CHECK</code>/<code className="text-xs bg-slate-100 px-1 rounded font-mono">UNIQUE</code>, operações CRUD completas e auditoria de conformidade com a LGPD (Lei nº 13.709/2018). Adicionalmente, todo o desenvolvimento foi gerenciado com Git e organizado para publicação no GitHub mediante ramificações temáticas (<code className="text-xs bg-slate-100 px-1 rounded font-mono">feature/*</code>), merges controlados e commits semânticos.
            </p>
            <p className="text-xs font-sans text-slate-600 pt-1">
              <strong>Palavras-chave:</strong> Banco de Dados Relacional. SQL. Normalização. Controle de Versão. Git e GitHub. UFMS Digital.
            </p>
          </section>

          {/* 1. Introdução */}
          <section className="space-y-3 font-sans">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              1. Introdução
            </h2>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              A persistência estruturada de dados e a rastreabilidade do código-fonte são requisitos fundamentais na construção de sistemas educacionais confiáveis. Na EMEIEF Professor José Antônio de Miranda, o Sistema Escola Conectada (SEC) busca erradicar o uso mensal de 2.000 folhas A4 e o atraso médio de 48 horas no envio de comunicados escolares por meio de mensageria digital unidirecional. Contudo, para que a aplicação web opere de modo seguro em produção, torna-se imprescindível sustentar suas regras de negócio — como o controle de acesso por papéis (RBAC), a retenção hierárquica de mensagens docentes e o bloqueio de envios sem termo LGPD — sobre um banco de dados relacional consistente e auditável.
            </p>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              Sem modelagem formal e controle de versão, alterações evolutivas poderiam gerar duplicidade de responsáveis legais, perda de histórico de comunicados aprovados ou regressões no código. Assim, para o Módulo 3, adotou-se o motor relacional <strong>SQLite</strong> integrado nativamente via <code className="text-xs bg-slate-100 px-1 rounded font-mono">node:sqlite</code> ao servidor <strong>Express/TypeScript</strong>, associado ao <strong>Git</strong> e ao <strong>GitHub</strong>. Essa escolha tecnológica assegura aderência estrita ao padrão SQL (DDL/DML), transações ACID, verificação rigorosa de chaves estrangeiras e histórico versionado transparente por funcionalidades.
            </p>
          </section>

          {/* 2. Objetivo Geral */}
          <section className="space-y-2 font-sans">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              2. Objetivo Geral
            </h2>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              Desenvolver e integrar um banco de dados relacional normalizado em SQL ao Sistema Escola Conectada (SEC), aplicando modelagem entidade-relacionamento, restrições de integridade e operações completas de manipulação de dados, em conjunto com o gerenciamento estruturado do código-fonte utilizando o controle de versão Git e publicação em repositório no GitHub.
            </p>
          </section>

          {/* 3. Objetivos Específicos */}
          <section className="space-y-2 font-sans">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              3. Objetivos Específicos
            </h2>
            <ul className="list-disc pl-8 space-y-1.5 text-sm text-slate-700 text-justify font-serif">
              <li>Projetar um modelo de dados relacional eficiente (DER) para o SEC, especificando entidades, atributos, cardinalidades e chaves até a Terceira Forma Normal (3FN);</li>
              <li>Implementar o esquema físico do banco de dados utilizando SQL DDL (<code className="text-xs bg-slate-100 px-1 rounded font-mono">CREATE TABLE</code>, chaves primárias, estrangeiras, restrições <code className="text-xs bg-slate-100 px-1 rounded font-mono">UNIQUE</code>/<code className="text-xs bg-slate-100 px-1 rounded font-mono">CHECK</code> e índices) e realizar a carga inicial anonimizada (seed DML);</li>
              <li>Executar operações de manipulação e consulta de dados (<code className="text-xs bg-slate-100 px-1 rounded font-mono">INSERT</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">UPDATE</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">DELETE</code> e <code className="text-xs bg-slate-100 px-1 rounded font-mono">SELECT</code> com <code className="text-xs bg-slate-100 px-1 rounded font-mono">INNER JOIN</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">WHERE</code> e <code className="text-xs bg-slate-100 px-1 rounded font-mono">GROUP BY</code>) integradas à interface web e ao Console SQL;</li>
              <li>Gerenciar toda a evolução do código do projeto utilizando Git com boas práticas de versionamento (arquivo <code className="text-xs bg-slate-100 px-1 rounded font-mono">.gitignore</code>, ramificações <code className="text-xs bg-slate-100 px-1 rounded font-mono">feature/*</code>, merges controlados e Conventional Commits) e disponibilizá-lo no GitHub.</li>
            </ul>
          </section>

          {/* 4. Justificativa e Delimitação do Problema */}
          <section className="space-y-3 font-sans">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              4. Justificativa e Delimitação do Problema
            </h2>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              A persistência de dados no domínio escolar exige exatidão referencial e proteção jurídica. Caso os dados dos responsáveis estivessem duplicados dentro da tabela de alunos, uma atualização de número de WhatsApp pela secretaria poderia atualizar apenas um irmão e deixar outro desatualizado, causando falha crítica em avisos de saúde ou reuniões. Ao separar as entidades <code className="text-xs bg-slate-100 px-1 rounded font-mono">responsaveis</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">alunos</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">turmas</code> e <code className="text-xs bg-slate-100 px-1 rounded font-mono">tipos_usuario</code>, o modelo elimina anomalias de atualização e assegura que toda alteração reflita imediatamente nos comunicados gerados.
            </p>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              Em termos de eficiência e escalabilidade, a escolha do SQLite embarcado via <code className="text-xs bg-slate-100 px-1 rounded font-mono">node:sqlite</code> confere latência sub-milissegundo nas consultas locais, zero custo de licenciamento para escolas públicas municipais e portabilidade direta dos scripts SQL ANSI para motores corporativos como PostgreSQL em implantações de rede municipal. Da mesma forma, o uso do Git e do GitHub delimita um fluxo seguro contra perdas de código e permite auditoria completa de cada alteração implementada.
            </p>
          </section>

          {/* 5. Fundamentação Teórica */}
          <section className="space-y-3 font-sans">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              5. Fundamentação Teórica
            </h2>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              De acordo com Elmasri e Navathe (2018), a modelagem relacional organiza os dados em relações (tabelas) com domínios bem definidos, aplicando formas normais sucessivas (1FN, 2FN e 3FN) para eliminar redundâncias e dependências transitivas. Silberschatz, Korth e Sudarshan (2020) demonstram que a integridade referencial — concretizada por chaves primárias (PK) e estrangeiras (FK) — garante que referências entre registros permaneçam sempre válidas diante de inserções, alterações e exclusões.
            </p>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              Segundo Date (2004), a linguagem SQL unifica a definição estrutural (DDL) e a manipulação algébrica dos dados (DML), permitindo consultas relacionais precisas com projeções, junções (<code className="text-xs bg-slate-100 px-1 rounded font-mono">INNER JOIN</code>) e agregações (<code className="text-xs bg-slate-100 px-1 rounded font-mono">GROUP BY</code>). No eixo de engenharia de software, Pressman e Maxim (2021) apontam o controle de configuração como elemento essencial para controlar versões e mudanças. Chacon e Straub (2014) explicam que o Git armazena o histórico como uma cadeia criptográfica de snapshots, viabilizando ramificações leves (<code className="text-xs bg-slate-100 px-1 rounded font-mono">branches</code>) e integrações (<code className="text-xs bg-slate-100 px-1 rounded font-mono">merges</code>) seguras. Adicionalmente, toda manipulação cadastral de estudantes observa a LGPD (BRASIL, 2018).
            </p>
          </section>

          {/* 6. Metodologia */}
          <section className="space-y-4 font-sans">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              6. Metodologia
            </h2>

            {/* 6.1 */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                6.1 Modelagem do Banco de Dados
              </h3>
              <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
                A partir dos diagramas de casos de uso e de classes produzidos nas etapas anteriores, projetou-se o modelo lógico normalizado até a 3FN com sete entidades principais: <code className="text-xs bg-slate-100 px-1 rounded font-mono">tipos_usuario</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">usuarios</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">turmas</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">responsaveis</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">alunos</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">mensagens</code> e <code className="text-xs bg-slate-100 px-1 rounded font-mono">auditoria_lgpd</code>. Na 1FN, garantiu-se atomicidade dos campos; na 2FN, chaves primárias simples; e na 3FN, separação de perfis RBAC e responsáveis legais em tabelas próprias.
              </p>

              {/* Visual DER Summary Box inside Report */}
              <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-blue-400 font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Diagrama Entidade-Relacionamento (DER Lógico — 3FN)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <div><strong className="text-amber-300">tipos_usuario</strong> (PK: id, papel UNIQUE, pode_aprovar_fila)</div>
                    <div className="text-emerald-400">└── 1:N ──&gt; <strong>usuarios</strong> (PK: id, FK: tipo_usuario_id)</div>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <div><strong className="text-amber-300">turmas</strong> (PK: id, nome, turno CHECK, FK: professor_regente_id)</div>
                    <div className="text-emerald-400">└── 1:N ──&gt; <strong>alunos</strong> (PK: id, registro_escolar UNIQUE, FK: turma_id)</div>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <div><strong className="text-amber-300">responsaveis</strong> (PK: id, nome, grau_parentesco, telefone)</div>
                    <div className="text-emerald-400">└── 1:N ──&gt; <strong>alunos</strong> (FK: responsavel_id, consentimento_lgpd CHECK)</div>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <div><strong className="text-amber-300">mensagens</strong> (PK: id, FKs: autor_id, aluno_id, turma_id, status CHECK)</div>
                    <div className="text-sky-400">• <strong>auditoria_lgpd</strong> (PK: id AUTOINCREMENT, entidade, acao, detalhes)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6.2 */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                6.2 Implementação e Manipulação de Dados
              </h3>
              <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
                O esquema DDL foi codificado em <code className="text-xs bg-slate-100 px-1 rounded font-mono">sql/01_schema.sql</code> com chaves primárias, chaves estrangeiras com políticas explícitas (<code className="text-xs bg-slate-100 px-1 rounded font-mono">ON UPDATE CASCADE</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">ON DELETE RESTRICT</code> e <code className="text-xs bg-slate-100 px-1 rounded font-mono">ON DELETE SET NULL</code>), restrições de domínio (<code className="text-xs bg-slate-100 px-1 rounded font-mono">CHECK</code> em turnos, status e flags LGPD) e sete índices de consulta. A carga inicial (<code className="text-xs bg-slate-100 px-1 rounded font-mono">sql/02_seed.sql</code>) insere dados anonimizados para testes, enquanto <code className="text-xs bg-slate-100 px-1 rounded font-mono">sql/03_operations_dml.sql</code> e a API REST (<code className="text-xs bg-slate-100 px-1 rounded font-mono">server.ts</code>) executam operações reais de <code className="text-xs bg-slate-100 px-1 rounded font-mono">INSERT</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">UPDATE</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">DELETE</code> e <code className="text-xs bg-slate-100 px-1 rounded font-mono">SELECT ... INNER JOIN</code>.
              </p>
              <pre className="bg-slate-950 text-emerald-300 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`-- Exemplo real de consulta DML (sql/03_operations_dml.sql)
SELECT a.registro_escolar, a.nome AS aluno, t.nome AS turma,
       r.nome AS responsavel, r.telefone, a.consentimento_lgpd
FROM alunos a
INNER JOIN turmas t ON a.turma_id = t.id
INNER JOIN responsaveis r ON a.responsavel_id = r.id
WHERE a.consentimento_lgpd = 1
ORDER BY t.nome, a.nome;`}
              </pre>
            </div>

            {/* 6.3 */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                6.3 Uso do Controle de Versão
              </h3>
              <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
                O repositório Git foi inicializado na branch <code className="text-xs bg-slate-100 px-1 rounded font-mono">main</code> com <code className="text-xs bg-slate-100 px-1 rounded font-mono">.gitignore</code> configurado para proteger variáveis <code className="text-xs bg-slate-100 px-1 rounded font-mono">.env</code>, dependências (<code className="text-xs bg-slate-100 px-1 rounded font-mono">node_modules/</code>) e binários locais do banco (<code className="text-xs bg-slate-100 px-1 rounded font-mono">*.db</code>). O desenvolvimento seguiu o modelo de ramificações por funcionalidade (<code className="text-xs bg-slate-100 px-1 rounded font-mono">feature/modelagem-bd</code>, <code className="text-xs bg-slate-100 px-1 rounded font-mono">feature/backend-sqlite</code> e <code className="text-xs bg-slate-100 px-1 rounded font-mono">feature/interface-modulo3</code>), integradas via <code className="text-xs bg-slate-100 px-1 rounded font-mono">git merge --no-ff</code> à <code className="text-xs bg-slate-100 px-1 rounded font-mono">main</code> com mensagens padronizadas em Conventional Commits.
              </p>
              <p className="text-xs font-sans text-slate-700">
                <strong>Link do repositório:</strong>{' '}
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-mono">
                  {githubUrl}
                </a>
              </p>
            </div>
          </section>

          {/* 7. Resultados Preliminares: Solução Inicial */}
          <section className="space-y-3 font-sans">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              7. Resultados Preliminares: Solução Inicial
            </h2>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              A integração entre o banco relacional SQLite e a interface web encontra-se plenamente operacional, permitindo validar na prática todos os requisitos acadêmicos e extensionistas do Módulo 3:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Table2 className="w-4 h-4 text-blue-600" />
                  <span>Estúdio DER & Dicionário de Dados ({totalTables} Tabelas)</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  A aba <strong>Banco de Dados & SQL</strong> exibe em tempo real as {totalTables} entidades normalizadas, suas chaves PK/FK e atualmente contabiliza <strong>{studentCount} alunos</strong>, <strong>{messageCount} comunicados</strong> e <strong>{auditLogsCount} eventos</strong> de auditoria LGPD persistidos em disco.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <span>Console SQL & CRUD Persistente</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  O editor SQL executa comandos <code className="bg-white px-1 rounded border">SELECT</code>, <code className="bg-white px-1 rounded border">INSERT</code>, <code className="bg-white px-1 rounded border">UPDATE</code> e <code className="bg-white px-1 rounded border">DELETE</code> diretamente no SQLite com verificação ativa de <code className="bg-white px-1 rounded border">FOREIGN KEY</code>, além de formulários CRUD completos na aba <strong>Alunos & CRUD</strong>.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-indigo-600" />
                  <span>Painel Git em Tempo Real ({totalCommits} Commits)</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  A aba <strong>Controle de Versão</strong> consulta o repositório Git local via servidor Express e exibe as branches organizadas, o gráfico de commits semânticos e o fluxo de publicação no GitHub.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Auditoria LGPD & Testes Unitários</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Toda operação crítica grava registro na tabela <code className="bg-white px-1 rounded border">auditoria_lgpd</code>, e a suíte automatizada (<code className="bg-white px-1 rounded border">node:test</code>) valida tanto regras RBAC/LGPD quanto os utilitários de proteção do Console SQL.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Conclusão */}
          <section className="space-y-2 font-sans">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              8. Conclusão
            </h2>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
              O desenvolvimento do Módulo 3 consolidou o Sistema Escola Conectada (SEC) como uma solução web completa com persistência relacional real e gerenciamento disciplinado de código-fonte. Entre os principais aprendizados adquiridos destacam-se a aplicação prática da normalização até a 3FN para eliminar redundâncias de responsáveis e perfis, a importância da habilitação explícita de chaves estrangeiras e restrições <code className="text-xs bg-slate-100 px-1 rounded font-mono">CHECK</code> para blindar a integridade dos dados escolares, e a organização do histórico em branches temáticas com Conventional Commits no Git. Como melhorias futuras, planeja-se a migração transparente dos scripts SQL para um banco PostgreSQL gerenciado em nuvem quando da expansão para múltiplas unidades da rede municipal, a adoção de autenticação por tokens JWT com hash de senhas e a criação de pipelines de integração contínua (CI) no GitHub Actions para validação automática de migrações SQL e testes unitários.
            </p>
          </section>

          {/* 9. Referências */}
          <section className="space-y-3 font-sans border-t border-slate-200 pt-6">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              9. Referências (ABNT NBR 6023:2018)
            </h2>
            <ul className="text-xs text-slate-700 space-y-2 text-justify font-serif">
              <li>
                BRASIL. Lei nº 13.709, de 14 de agosto de 2018. <strong>Lei Geral de Proteção de Dados Pessoais (LGPD)</strong>. Brasília, DF: Presidência da República, 2018. Disponível em: &lt;https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm&gt;. Acesso em: 12 nov. 2026.
              </li>
              <li>
                CHACON, Scott; STRAUB, Ben. <strong>Pro Git</strong>. 2. ed. New York: Apress, 2014. Disponível em: &lt;https://git-scm.com/book/en/v2&gt;. Acesso em: 12 nov. 2026.
              </li>
              <li>
                DATE, Christopher J. <strong>Introdução a sistemas de bancos de dados</strong>. 8. ed. Rio de Janeiro: Elsevier, 2004.
              </li>
              <li>
                ELMASRI, Ramez; NAVATHE, Shamkant B. <strong>Sistemas de banco de dados</strong>. 7. ed. São Paulo: Pearson Addison Wesley, 2018.
              </li>
              <li>
                PRESSMAN, Roger S.; MAXIM, Bruce R. <strong>Engenharia de software: uma abordagem profissional</strong>. 9. ed. Porto Alegre: AMGH, 2021.
              </li>
              <li>
                SILBERSCHATZ, Abraham; KORTH, Henry F.; SUDARSHAN, S. <strong>Sistema de banco de dados</strong>. 7. ed. Rio de Janeiro: LTC, 2020.
              </li>
              <li>
                UNIVERSIDADE FEDERAL DE MATO GROSSO DO SUL. <strong>Resolução nº 142, de 21 de dezembro de 2021</strong>: Estabelece as normas de Extensão Universitária no âmbito da UFMS. Campo Grande: UFMS, 2021.
              </li>
            </ul>
          </section>

          {/* 10. Link do Repositório */}
          <section className="space-y-2 font-sans border-t border-slate-200 pt-5">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              10. Link do Repositório
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">
                  Repositório GitHub contendo código-fonte, scripts SQL e documentação:
                </span>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold text-blue-700 underline text-sm"
                >
                  {githubUrl}
                </a>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-[11px] self-start sm:self-center">
                branch: {gitInfo?.currentBranch || 'main'} • {totalCommits} commits
              </span>
            </div>
          </section>
        </article>
      ) : (
        /* MODULE 2 REPORT (Preserved for reference) */
        <article className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 max-w-5xl mx-auto space-y-8 font-serif text-slate-800 leading-relaxed print:shadow-none print:border-none print:p-0">
          <header className="text-center border-b border-slate-200 pb-6 space-y-2 font-sans">
            <div className="inline-block px-3 py-1 rounded bg-blue-50 text-blue-900 font-bold text-xs tracking-wider uppercase mb-1">
              Universidade Federal de Mato Grosso do Sul — EaD / AGEAD
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              Template do Estudante — Desenvolvimento Web com Frameworks e HTML/CSS
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              Avaliação do Módulo 2 — Projeto Integrador de Tecnologia da Informação (UFMS Digital)
            </p>
          </header>

          <section className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200 font-sans text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 font-medium">Projeto de Extensão:</span>
                <p className="font-bold text-slate-900">Programa de Extensão UFMS Digital (95DX7.200525)</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Nome Completo:</span>
                <p className="font-bold text-slate-900">Jefferson Soares Alves Salles</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Local de Realização:</span>
                <p className="font-bold text-slate-900">EMEIEF Professor José Antônio de Miranda</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Repositório GitHub:</span>
                <p className="font-bold text-blue-700 underline font-mono text-[11px]">{githubUrl}</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold font-sans text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
              Resumo (Módulo 2 — Front-End Web)
            </h2>
            <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8">
              O relatório do Módulo 2 documentou o desenvolvimento da aplicação web dinâmica e responsiva do Sistema Escola Conectada (SEC) em React 19, TypeScript, Vite e Tailwind CSS, com controle de acesso RBAC, fila hierárquica de aprovação para docentes, injeção automática de cabeçalho e simulador de recepção móvel. No Módulo 3 atual, esta base web foi evoluída com persistência SQL real e versionamento Git completo.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Controle de Acesso RBAC Validado</span>
              </span>
              <p className="text-slate-600">
                Alternância entre Direção, Pedagógico, Coordenação, Professor e Secretaria com bloqueio automático de auto-aprovação docente.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Injeção Dinâmica de Cabeçalho</span>
              </span>
              <p className="text-slate-600">
                Montagem algorítmica do cabeçalho cruzando aluno, turma, turno e professor regente em tempo real.
              </p>
            </div>
          </section>
        </article>
      )}
    </div>
  );
};
