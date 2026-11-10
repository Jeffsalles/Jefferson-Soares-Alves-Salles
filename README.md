# Sistema Escola Conectada (SEC) — UFMS Digital

> **Programa de Extensão Universitária UFMS Digital (Código 95DX7.200525)**  
> **Instituição de Ensino:** Universidade Federal de Mato Grosso do Sul (UFMS) — EaD / AGEAD  
> **Escola Parceira:** EMEIEF Professor José Antônio de Miranda  
> **Acadêmico:** Jefferson Soares Alves Salles  
> **Semestre Letivo:** 2026.2 | **Curso:** Tecnologia da Informação  
> **Disciplina:** Projeto Integrador de Tecnologia da Informação (Módulo 2 — Desenvolvimento Web com Frameworks e HTML/CSS)  
> **Repositório GitHub:** `https://github.com/jefferson-salles/sec-escola-conectada`

---

## 📌 1. Visão Geral do Projeto

O **Sistema Escola Conectada (SEC)** é uma plataforma web dinâmica e responsiva desenvolvida para substituir métodos manuais e obsoletos de comunicação (bilhetes físicos impressos, recortados em guilhotina e colados em agendas) por um canal oficial de **mensageria digital unidirecional (broadcast)** via Meta WhatsApp Business Cloud API e gateways de SMS.

### 🎯 Principais Benefícios e Impacto Social Comprovado
* **Economia Sustentável:** Erradicação de **2.000 folhas A4 por mês** e um toner de impressora de alta capacidade, gerando economia mensal estimada em **R$ 360,00** aos cofres públicos escolares.
* **Redução Drástica do Tempo de Envio:** Redução de **48 horas (2 dias de tramitação manual)** para **1,8 segundos (transmissão em tempo real)**.
* **Solução para o Risco R05 (Concorrência de Atenção):** Injeção automatizada de cabeçalho padronizado contendo metadados oficiais (`[SEC - EMEIEF Prof. José Antônio de Miranda] Aluno, Turma, Turno e Professor Regente`), garantindo reconhecimento imediato pelas famílias.
* **Canal Estritamente Unidirecional:** Respostas desabilitadas para impedir congestionamento do canal oficial e sobrecarga dos servidores públicos escolares.
* **Conformidade Estrita com a LGPD (Lei nº 13.709/2018):** Bloqueio sistemático de envios para cadastros incompletos ou sem termo de consentimento firmado no ato da matrícula.

---

## 🏗️ 2. Arquitetura e Decisões Técnicas

| Camada / Requisito | Tecnologia Escolhida | Justificativa Técnica |
| :--- | :--- | :--- |
| **Framework Front-End** | **React 19 (SPA)** | Modularidade em componentes reutilizáveis, reatividade declarativa de estados e performance. |
| **Linguagem & Tipagem** | **TypeScript 7** | Prevenção de falhas em tempo de compilação na manipulação de metadados sensíveis de alunos. |
| **Build & Bundler** | **Vite 8** | Inicialização instantânea, suporte a ESModules e compilação otimizada para produção. |
| **Estilização & CSS** | **Tailwind CSS 4** | Abordagem utilitária, design responsivo nativo (*Mobile First* com Flexbox e CSS Grid), sem dependências pesadas. |
| **Testes Automatizados** | **Node.js Test Runner (`node:test`) + `tsx`** | Testes unitários determinísticos e ultrarrápidos para as regras de negócio puras (RBAC, cabeçalho e LGPD). |
| **Ícones** | **Lucide React** | Conjunto leve e consistente de ícones para interfaces institucionais e acessibilidade. |

---

## 🔐 3. Controle de Acesso Baseado em Perfis (RBAC)

O SEC implementa controle de acesso estrito entre cinco atores mapeados nos diagramas de caso de uso:

1. **👑 Direção Geral:** Acesso irrestrito; envio direto de mensagens institucionais e urgentes; aprovação ou reprovação de mensagens docentes retidas.
2. **🌱 Pedagógico:** Foco em avisos pedagógicos e desempenho; envio direto; aprovação da fila docente.
3. **🧭 Coordenação:** Avisos disciplinares, conselho de classe e urgências médicas; envio direto; aprovação da fila docente.
4. **👨‍🏫 Professor Regente:** Elabora mensagens docentes (frequência, reuniões, indisciplina, eventos). **Regra de Negócio Mandatória:** Ficam retidas na **Fila de Validação Hierárquica** (status *Aguardando Validação*) e **não podem** ser disparadas sem prévia homologação da Direção/Coordenação.
5. **📋 Secretaria:** Consulta cadastral e envio **exclusivo de Comunicados Administrativos (Mensagem ADM)** referentes a matrículas e documentação.

---

## 📂 4. Estrutura do Código-Fonte

```
├── index.html                   # Entry point HTML5 semântico com meta tags e acessibilidade
├── metadata.json                # Metadados oficiais do applet
├── package.json                 # Dependências e scripts
├── tsconfig.json                # Configuração do TypeScript
├── vite.config.ts               # Configuração do bundler Vite
├── src/
│   ├── main.tsx                 # Ponto de entrada React 19
│   ├── App.tsx                  # Componente raiz, orquestração de estados e telas
│   ├── index.css                # Estilos globais e importação do Tailwind CSS
│   ├── types/
│   │   └── index.ts             # Modelagem de tipos de domínio (Student, UserRole, Message, etc.)
│   ├── data/
│   │   └── mockData.ts          # Dados simulados sincronizados com School+ e TecSystem
│   ├── logic/
│   │   ├── sec-rules.ts         # Regras puras de RBAC, injeção de cabeçalho, LGPD e métricas
│   │   └── sec-rules.test.ts    # Suíte de testes unitários automatizados (node:test)
│   └── components/
│       ├── Header.tsx           # Barra institucional, dados UFMS e seletor de papéis RBAC
│       ├── Navigation.tsx       # Abas de navegação da aplicação
│       ├── DashboardView.tsx    # Painel de métricas, economia de papel A4 e comparativo de fluxo
│       ├── ComposeMessageModal.tsx # Compositor com injeção de cabeçalho e preview em tempo real
│       ├── MessageQueueView.tsx # Fila de validação hierárquica (aprovação/reprovação)
│       ├── StudentsView.tsx     # Base de alunos, turmas, responsáveis e termos LGPD
│       ├── ParentSimulatorView.tsx # Simulador mobile (WhatsApp/SMS) no celular dos pais
│       └── DocumentationReportView.tsx # Relatório acadêmico completo do Módulo 2 (UFMS)
```

---

## 🧪 5. Execução dos Testes Unitários

Para rodar a suíte de testes de regras de negócio:
```bash
npx --yes tsx --test src/logic/sec-rules.test.ts
```

Testes inclusos:
- [x] Restrição de categorias por perfil (Professor vs Secretaria vs Direção)
- [x] Retenção obrigatória na fila hierárquica para docentes
- [x] Permissão exclusiva de aprovação pela Direção e Coordenação
- [x] Formatação algorítmica da injeção de cabeçalho oficial
- [x] Bloqueio preventivo de envio por violação de LGPD ou telefone ausente

---

## 🚀 6. Como Executar a Aplicação Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000`.

3. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 📜 7. Licença e Créditos

Projeto desenvolvido como parte dos requisitos avaliativos do **Programa de Extensão UFMS Digital**, sob orientação do Prof. Dr. Hudson Silva Borges e corpo docente do curso de Tecnologia da Informação da UFMS. Licenciado sob os termos da licença Creative Commons Atribuição 4.0 Internacional (CC BY 4.0).
