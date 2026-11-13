# Sistema Escola Conectada (SEC) — UFMS Digital

> **Programa de Extensão Universitária UFMS Digital (Código 95DX7.200525)**  
> **Instituição de Ensino:** Universidade Federal de Mato Grosso do Sul (UFMS) — EaD / AGEAD  
> **Escola Parceira:** EMEIEF Professor José Antônio de Miranda  
> **Acadêmico:** Jefferson Soares Alves Salles  
> **Semestre Letivo:** 2026.2 | **Curso:** Tecnologia da Informação  
> **Disciplina:** Projeto Integrador de Tecnologia da Informação (Módulo 2: Web/HTML/CSS • Módulo 3: Banco de Dados e Controle de Versão)  
> **Repositório GitHub:** `https://github.com/jefferson-salles/sec-escola-conectada`

---

## 📌 1. Visão Geral do Projeto

O **Sistema Escola Conectada (SEC)** é uma plataforma web full-stack desenvolvida para substituir os bilhetes físicos impressos, recortados e colados em agendas escolares por um canal oficial de **mensageria digital unidirecional (broadcast)**, respaldado por um **banco de dados relacional normalizado (3FN)** e gerenciamento estruturado em **Git/GitHub**.

### 🎯 Impacto Social & Benefícios Técnicos
* **Economia Sustentável:** Erradicação de **2.000 folhas A4 por mês** e toner de alta capacidade (~**R$ 360,00/mês** economizados).
* **Agilidade Operacional:** Redução do tempo de tramitação de **48 horas** para **1,8 segundos**.
* **Persistência Relacional (Módulo 3):** Banco SQLite real (`node:sqlite`) normalizado até a 3ª Forma Normal com 7 tabelas, chaves estrangeiras (`PRAGMA foreign_keys = ON`), restrições `CHECK`/`UNIQUE` e trilha de auditoria LGPD.
* **Controle de Versão (Módulo 3):** Repositório Git estruturado com `.gitignore`, ramificações temáticas (`feature/*`), merges controlados e padrão **Conventional Commits**.

---

## 🗄️ 2. Modelagem do Banco de Dados (3ª Forma Normal)

O esquema SQL completo encontra-se em [`sql/01_schema.sql`](sql/01_schema.sql), a carga inicial anonimizada em [`sql/02_seed.sql`](sql/02_seed.sql) e as operações de consulta e manipulação em [`sql/03_operations_dml.sql`](sql/03_operations_dml.sql).

### Entidades e Cardinalidades
1. `tipos_usuario` **(1) ──< (N)** `usuarios` — Isola papéis RBAC (`direcao`, `pedagogico`, `coordenacao`, `professor`, `secretaria`) e permissões de aprovação.
2. `usuarios` **(1) ──< (N)** `turmas` — Vincula cada turma ao seu Professor Regente (`professor_regente_id`).
3. `turmas` **(1) ──< (N)** `alunos` e `responsaveis` **(1) ──< (N)** `alunos` — Separa tutores legais dos estudantes para eliminar redundância de telefone/e-mail entre irmãos (3FN).
4. `usuarios` **(1) ──< (N)** `mensagens` — Armazena comunicados, cabeçalhos injetados e estado da fila hierárquica (`pendente`, `enviada`, `reprovada`).
5. `auditoria_lgpd` — Registro imutável de operações críticas (`INSERT`, `UPDATE`, `DELETE`, `APPROVE`, `REJECT`) em conformidade com a Lei nº 13.709/2018.

---

## 🏗️ 3. Arquitetura e Stack Tecnológica

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Front-End** | **React 19 + TypeScript 7 + Vite 8** | Componentização modular, tipagem estática e alta reatividade. |
| **Estilização** | **Tailwind CSS 4** | Layout responsivo *Mobile First*, semântica HTML5 acessível e suporte a impressão em PDF. |
| **Back-End** | **Node.js 22 + Express 4 (`server.ts`)** | API RESTful com validação RBAC no servidor e telemetria Git em tempo real. |
| **Banco de Dados** | **SQLite (`node:sqlite`)** | Motor SQL embarcado com transações ACID, integridade referencial ativa e execução SQL interativa. |
| **Testes** | **Node Test Runner (`node:test`) + `tsx`** | Validação automatizada das regras de negócio e validadores SQL. |

---

## 📂 4. Estrutura do Projeto

```text
├── server.ts                        # Servidor Express + API REST + Vite middlewares
├── sql/
│   ├── 01_schema.sql                # DDL: 7 tabelas normalizadas (3FN), PKs, FKs, CHECK e índices
│   ├── 02_seed.sql                  # DML: Carga inicial anonimizada para testes
│   └── 03_operations_dml.sql        # Exemplos de SELECT JOIN/GROUP BY, INSERT, UPDATE e DELETE
├── src/
│   ├── db/
│   │   └── database.ts              # Camada SQLite (node:sqlite), CRUD transacional e introspecção
│   ├── logic/
│   │   ├── sec-rules.ts             # Regras puras RBAC, cabeçalho e LGPD
│   │   ├── sec-rules.test.ts        # Testes unitários das regras de negócio
│   │   ├── sql-helpers.ts           # Classificação, segmentação e sanitização do Console SQL
│   │   └── sql-helpers.test.ts      # Testes unitários dos utilitários SQL
│   └── components/
│       ├── DatabaseStudioView.tsx   # Estúdio DER interativo, Console SQL e Auditoria LGPD
│       ├── GitVersionControlView.tsx# Painel ao vivo do repositório Git e fluxo GitHub
│       ├── StudentsView.tsx         # CRUD completo de alunos/responsáveis + LGPD
│       ├── DocumentationReportView.tsx # Relatório Oficial UFMS (Módulo 3 e Módulo 2) com exportação PDF
│       └── ...                      # Header, Navigation, DashboardView, MessageQueueView, ParentSimulatorView
```

---

## 🌿 5. Estratégia de Controle de Versão (Git & GitHub)

O histórico do projeto segue o fluxo de ramificações por responsabilidade integradas à branch `main`:
- `feature/modelagem-bd` — Definição do DER e scripts `sql/01_schema.sql`, `02_seed.sql`, `03_operations_dml.sql`.
- `feature/backend-sqlite` — Camada `node:sqlite` (`src/db/database.ts`), helpers SQL e endpoints em `server.ts`.
- `feature/interface-modulo3` — Estúdio DER/SQL, CRUD completo, inspetor Git e Relatório do Módulo 3.

Padrão de mensagens adotado: **Conventional Commits** (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

---

## 🧪 6. Testes Automatizados e Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar suíte de testes unitários:**
   ```bash
   npx --yes tsx --test src/logic/sec-rules.test.ts src/logic/sql-helpers.test.ts
   ```

3. **Iniciar servidor full-stack (Express + SQLite + Vite) em desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse em `http://localhost:3000`.

4. **Gerar build de produção e iniciar:**
   ```bash
   npm run build
   npm start
   ```

---

## 📜 7. Licença e Créditos

Desenvolvido no âmbito do **Programa de Extensão UFMS Digital (95DX7.200525)** — Universidade Federal de Mato Grosso do Sul (UFMS). Licenciado sob Creative Commons Atribuição 4.0 Internacional (CC BY 4.0).
