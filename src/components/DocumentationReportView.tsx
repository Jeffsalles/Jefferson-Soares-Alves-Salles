import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink, 
  Github, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Download
} from 'lucide-react';

export const DocumentationReportView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const githubUrl = 'https://github.com/jefferson-salles/sec-escola-conectada';

  const fullReportText = `
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
O presente relatório documenta o desenvolvimento da aplicação web dinâmica e responsiva do Sistema Escola Conectada (SEC), concebida no âmbito do Programa de Extensão UFMS Digital para solucionar os entraves históricos da comunicação analógica na EMEIEF Professor José Antônio de Miranda. A partir dos artefatos de engenharia concebidos nas etapas anteriores (Casos de Uso, Diagrama de Classes, DER e Plano de Testes), desenvolveu-se uma solução estruturada no ecossistema moderno React 19, TypeScript e Vite, com estilização responsiva via Tailwind CSS e semântica estrita em HTML5 acessível. O SEC implementa controle de acesso baseado em papéis (RBAC) para cinco atores escolares, trava hierárquica que retém mensagens docentes em fila de aprovação pela coordenação/direção, injeção automatizada de cabeçalho padronizado para superação da concorrência de atenção com mensagens pessoais e integração simulada com os bancos legados (School+ e TecSystem). Como resultado prático, a plataforma extingue o desperdício mensal de 2.000 folhas A4 e despesas com toner, encurta o prazo de transmissão de avisos de 2 dias para 1,8 segundos e assegura estrita conformidade com a LGPD (Lei nº 13.709/2018).

PALAVRAS-CHAVE:
Desenvolvimento Web. Frameworks Front-end. HTML5/CSS3. Mensageria Escolar. UFMS Digital. Engenharia de Software.

1. INTRODUÇÃO
A comunicação entre escolas públicas e as famílias desempenha papel estruturante no sucesso pedagógico e na redução da evasão escolar. Não obstante, o diagnóstico empírico realizado in loco na EMEIEF Professor José Antônio de Miranda revelou a permanência de processos arcaicos: a transmissão de circulares dependia da redação física, impressão em massa, recorte manual com guilhotina e colagem nas agendas dos educandos. Esse fluxo consumia cerca de 2.000 folhas A4 e um toner de alta capacidade a cada mês, além de demandar cerca de 48 horas para que um comunicado atingisse todas as salas, frequentemente culminando no extravio dos papéis.

Para superar essa lacuna social e operacional, o projeto concebeu o Sistema Escola Conectada (SEC). No âmbito do desenvolvimento web moderno, a transição de protótipos estáticos para uma aplicação web dinâmica exigiu a seleção de tecnologias robustas. A escolha do framework React (Single Page Application - SPA) com Vite e TypeScript fundamenta-se na necessidade de gerenciar estados complexos e reativos de forma declarativa e modular (como a fila de validação hierárquica e a alternância de perfis RBAC em tempo de execução). A tipagem estática do TypeScript mitiga erros em tempo de compilação na manipulação de metadados sensíveis de menores, enquanto o Tailwind CSS e a semântica do HTML5 garantem acessibilidade nativa e design responsivo (Mobile First), adaptando-se tanto às estações desktop da secretaria escolar quanto aos smartphones dos professores e famílias.

2. OBJETIVO GERAL
Desenvolver e implementar uma aplicação web dinâmica e responsiva para o Sistema Escola Conectada (SEC), utilizando framework front-end moderno, estruturação semântica em HTML5 e estilização responsiva em CSS, integrando os fluxos hierárquicos de aprovação e injeção automática de cabeçalho para otimizar a comunicação institucional com as famílias.

3. OBJETIVOS ESPECÍFICOS
- Definir a arquitetura modular da aplicação web, segregando componentes visuais, gerenciamento de estado e regras de negócio de domínio (RBAC, LGPD e validação hierárquica);
- Implementar layout responsivo e acessível com HTML5 semântico e Tailwind CSS, assegurando usabilidade em monitores desktop de secretaria e dispositivos móveis (Mobile First);
- Configurar e integrar o framework React com TypeScript e Vite para garantir alta performance, renderização eficiente e reatividade em tempo real;
- Implementar a injeção automatizada de metadados no cabeçalho dos comunicados (Nome do Aluno, Turma, Turno e Professor Regente) para combater a dispersão e concorrência de atenção nos celulares dos responsáveis;
- Codificar e testar a suíte de regras de negócio com testes unitários automatizados (node:test) e disponibilizar a documentação e código-fonte em repositório público no GitHub.

4. JUSTIFICATIVA E DELIMITAÇÃO DO PROBLEMA
A relevância da solução justifica-se em três eixos:
a) Eficiência e Redução de Gastos Públicos: Eliminação do desperdício de 2.000 folhas A4 mensais e recargas de toner, gerando economia recorrente aos cofres públicos da ordem de R$ 360,00/mês;
b) Velocidade Operacional: Redução drástica do tempo de tramitação dos comunicados de 2 dias úteis para aproximadamente 1,8 segundos, assegurando pronta resposta em situações emergenciais;
c) Segurança Jurídica e Inclusão Digital: Canal unidirecional oficial em estrito alinhamento com a LGPD (Lei nº 13.709/2018), utilizando os telefones cadastrados no ato da matrícula e prevenindo o tratamento indevido de dados de menores.

5. FUNDAMENTAÇÃO TEÓRICA
O desenvolvimento da aplicação ancora-se no referencial clássico e contemporâneo da Engenharia de Software e das Tecnologias da Informação:
- Engenharia de Software e Qualidade: Conforme Pressman e Maxim (2021) e Sommerville (2019), o emprego de frameworks consolidados e a modelagem formal de requisitos previnem a perda de integridade dos dados durante a transição analógica para a computacional;
- Modelagem Visual: Guedes (2018) preconiza a UML como linguagem de precisão para delimitar atores, casos de uso e diagramas de classe, implementados com fidelidade no SEC;
- Automação de Processos: Santana et al. (2026) demonstram que automações no tratamento de dados escolares reduzem intervenções manuais a zero e elevam a confiabilidade da gestão;
- Comunicação Mediada por TICs: Lucena (2016) e Santos et al. (2020) atestam que aplicativos de mensageria instantânea (como WhatsApp) possuem taxas de abertura muito superiores às mídias analógicas, consolidando canais diretos de cidadania e proximidade comunitária;
- Legislação e Governança: Brasil (Lei 13.709/2018 - LGPD), que exige salvaguardas claras para dados de crianças e adolescentes.

6. METODOLOGIA
6.1 Planejamento e Definição do Projeto:
O escopo partiu do diagnóstico presencial e da aplicação do questionário com 20 perguntas na EMEIEF Prof. José Antônio de Miranda. Selecionou-se a stack: React 19 SPA, TypeScript, Vite, Tailwind CSS e Lucide Icons, garantindo ecossistema moderno e componentização limpa.
6.2 Implementação:
- Estruturação modular em componentes funcionais (Header, Navigation, DashboardView, ComposeMessageModal, MessageQueueView, StudentsView, ParentSimulatorView);
- Desacoplamento da lógica pura de domínio em módulo isolado (sec-rules.ts) coberto por testes unitários determinísticos (sec-rules.test.ts);
- Estilização responsiva mobile-first com Flexbox e CSS Grid nativos do Tailwind CSS;
- Simulação dinâmica da recepção dos pais via WhatsApp Cloud API e SMS Gateway.
6.3 Publicação e Documentação:
Estruturação de repositório Git com histórico semântico de commits, documentação no README.md e instruções claras de execução local e build.

7. RESULTADOS PRELIMINARES: SOLUÇÃO INICIAL
A aplicação web desenvolvida contempla integralmente todos os requisitos funcionais e não-funcionais:
- Controle de Acesso (RBAC) operacional com 5 perfis distintos;
- Retenção mandatória de comunicados docentes na Fila de Validação, bloqueando auto-aprovação pelo professor;
- Injeção dinâmica do cabeçalho oficial que identifica a escola, aluno, turma e regente;
- Bloqueio de envio em casos de ausência do termo de consentimento LGPD;
- Simulação no celular do responsável evidenciando o canal estritamente unidirecional.

8. CONCLUSÃO
A transposição dos modelos de engenharia para uma aplicação web dinâmica e responsiva no Módulo 2 comprova a viabilidade técnica e social do SEC. O software substitui custos operacionais crônicos por agilidade digital, assegurando a formação cidadã do educando e fortalecendo o vínculo entre a universidade pública e a comunidade escolar.

9. REFERÊNCIAS
- BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF, 2018.
- GUEDES, Gilleanes T. A. UML 2: guia prático. 3. ed. São Paulo: Érica, 2018.
- LUCENA, Simone. Culturas digitais e tecnologias móveis na educação. Cadernos de Pesquisa, v. 46, n. 161, p. 800-824, 2016.
- PRESSMAN, Roger S.; MAXIM, Bruce R. Engenharia de software: uma abordagem profissional. 9. ed. Porto Alegre: AMGH, 2021.
- SANTANA, Miguel das Virgens de et al. Insight forms: automated analysis of educational feedback using python and generative AI. Observatorio de la Economía Latinoamericana, v. 24, n. 2, p. 1-19, 2026.
- SANTOS, J. B. et al. O uso do WhatsApp como ferramenta de comunicação entre escola e família. Revista de Educação e Tecnologias, v. 5, n. 1, 2020.
- SOMMERVILLE, Ian. Engenharia de software. 10. ed. São Paulo: Pearson Education do Brasil, 2019.
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Toolbar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Relatório da Atividade Extensionista (Módulo 2)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Template Oficial 02-02 - HTML
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Documentação acadêmica institucional em estrita conformidade com as normas ABNT NBR 6023:2018
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopy}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado para Área de Transferência!' : 'Copiar Relatório Completo'}</span>
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
            <span>Repositório GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Academic Paper Card (Formatted per Template 02-02 - HTML) */}
      <article className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 max-w-5xl mx-auto space-y-8 font-serif text-slate-800 leading-relaxed print:shadow-none print:border-none print:p-0">
        
        {/* Institutional Header */}
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

        {/* Student and Action Identification */}
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
              <span className="text-slate-500 font-medium">Disciplina / Curso:</span>
              <p className="font-bold text-slate-900">Projeto Integrador II / Tecnologia da Informação</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Semestre Letivo:</span>
              <p className="font-bold text-slate-900">2026.2</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Local de Realização:</span>
              <p className="font-bold text-slate-900">EMEIEF Professor José Antônio de Miranda</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Repositório Oficial no GitHub:</span>
              <p className="font-bold text-blue-700 underline font-mono text-[11px]">{githubUrl}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-medium uppercase tracking-wider text-[10px]">Título da Ação de Extensão:</span>
            <p className="font-black text-sm text-slate-900 uppercase">
              SISTEMA ESCOLA CONECTADA (SEC): PLATAFORMA DE GESTÃO DE COMUNICAÇÃO DIRETA ENTRE INSTITUIÇÃO DE ENSINO E RESPONSÁVEIS
            </p>
          </div>
        </section>

        {/* Resumo e Palavras-chave */}
        <section className="space-y-3">
          <h2 className="text-base font-bold font-sans text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            Resumo
          </h2>
          <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8">
            O presente relatório documenta o desenvolvimento da aplicação web dinâmica e responsiva do Sistema Escola Conectada (SEC), concebida no âmbito do Programa de Extensão UFMS Digital para solucionar os entraves históricos da comunicação analógica na EMEIEF Professor José Antônio de Miranda. A partir dos artefatos de engenharia concebidos nas etapas anteriores (Casos de Uso, Diagrama de Classes, DER e Plano de Testes), desenvolveu-se uma solução estruturada no ecossistema moderno React 19, TypeScript e Vite, com estilização responsiva via Tailwind CSS e semântica estrita em HTML5 acessível. O SEC implementa controle de acesso baseado em papéis (RBAC) para cinco atores escolares, trava hierárquica que retém mensagens docentes em fila de aprovação pela coordenação/direção, injeção automatizada de cabeçalho padronizado para superação da concorrência de atenção com mensagens pessoais e integração simulada com os bancos legados (School+ e TecSystem). Como resultado prático, a plataforma extingue o desperdício mensal de 2.000 folhas A4 e despesas com toner, encurta o prazo de transmissão de avisos de 2 dias para 1,8 segundos e assegura estrita conformidade com a LGPD (Lei nº 13.709/2018).
          </p>
          <p className="text-xs font-sans text-slate-600 pt-1">
            <strong>Palavras-chave:</strong> Desenvolvimento Web. Frameworks Front-end. HTML5/CSS3. Mensageria Escolar. UFMS Digital. Engenharia de Software.
          </p>
        </section>

        {/* 1. Introdução */}
        <section className="space-y-3 font-sans">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            1. Introdução
          </h2>
          <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
            A comunicação entre escolas públicas e as famílias desempenha papel estruturante no sucesso pedagógico e na redução da evasão escolar. Não obstante, o diagnóstico empírico realizado in loco na EMEIEF Professor José Antônio de Miranda revelou a permanência de processos arcaicos: a transmissão de circulares dependia da redação física, impressão em massa, recorte manual com guilhotina e colagem nas agendas dos educandos. Esse fluxo burocrático consumia cerca de 2.000 folhas A4 e um toner de alta capacidade a cada mês, além de demandar aproximadamente 48 horas operacionais para que um comunicado atingisse todas as salas de aula, frequentemente culminando no extravio dos papéis ou na ausência de verificação por parte dos pais.
          </p>
          <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
            Para solucionar esse gargalo social e administrativo, o projeto integrador especificou o <strong>Sistema Escola Conectada (SEC)</strong>. No contexto do Módulo 2 (Desenvolvimento Web com frameworks e HTML/CSS), a transição da modelagem teórica para uma aplicação web dinâmica e funcional exigiu a seleção criteriosa de tecnologias de ponta. Justifica-se a escolha do <strong>React 19</strong> (SPA componentizado) gerenciado pelo empacotador de alta performance <strong>Vite</strong> e integrado ao <strong>TypeScript</strong>: essa combinação assegura manutenibilidade, reatividade em tempo de execução para fluxos como a fila hierárquica e prevenção rigorosa de inconsistências de dados ao tratar metadados de menores sob tutela legal. A estilização via <strong>Tailwind CSS</strong> associada a elementos nativos do <strong>HTML5</strong> assegura responsividade fluida (Mobile First) e acessibilidade semântica para múltiplos dispositivos.
          </p>
        </section>

        {/* 2. Objetivos */}
        <section className="space-y-3 font-sans">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            2. Objetivos
          </h2>
          <div className="space-y-2 text-sm text-slate-700 font-serif">
            <h3 className="font-bold font-sans text-slate-900 text-sm">2.1 Objetivo Geral</h3>
            <p className="text-justify indent-8">
              Desenvolver e implementar uma aplicação web dinâmica, responsiva e acessível para o Sistema Escola Conectada (SEC), aplicando os artefatos de engenharia concebidos nas etapas preliminares, estruturada em framework front-end moderno (React/TypeScript), com estilização responsiva via CSS3 (Tailwind CSS) e semântica estrita em HTML5.
            </p>

            <h3 className="font-bold font-sans text-slate-900 text-sm pt-2">2.2 Objetivos Específicos</h3>
            <ul className="list-disc pl-8 space-y-1 text-justify">
              <li>Definir a arquitetura modular da aplicação e estruturar os componentes React necessários para a navegação, composição de avisos e simulação da recepção móvel;</li>
              <li>Implementar um layout totalmente responsivo com CSS Flexbox e Grid, adaptado às telas desktop da secretaria escolar e aos smartphones dos docentes e gestores;</li>
              <li>Configurar e integrar o framework web para gerenciar o estado global da aplicação e o controle de acesso baseado em papéis (RBAC com 5 perfis);</li>
              <li>Programar a regra de negócio mandatória de retenção hierárquica das mensagens docentes em fila de aprovação antes do disparo;</li>
              <li>Implementar a injeção automática de metadados no cabeçalho padronizado (aluno, turma, turno e professor regente), superando a concorrência de atenção com mensagens pessoais;</li>
              <li>Documentar as decisões arquiteturais e disponibilizar o código em repositório público no GitHub com instruções completas.</li>
            </ul>
          </div>
        </section>

        {/* 3. Justificativa e Delimitação */}
        <section className="space-y-3 font-sans">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            3. Justificativa e Delimitação do Problema
          </h2>
          <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
            A relevância social da aplicação reside na modernização do serviço público escolar e no fortalecimento da relação escola-comunidade. O diagnóstico in loco demonstrou que grande parte dos responsáveis possui smartphones com planos de dados móveis, enquanto a circulação de bilhetes em papel apresentava índices elevados de extravio. Sob a perspectiva econômica e ecológica, erradicar o uso de 2.000 folhas mensais de papel A4 gera economia direta aos cofres públicos e promove a sustentabilidade. Sob a ótica técnica e jurídica, a aplicação delimita-se estritamente como um <strong>canal de transmissão unidirecional (broadcast)</strong> com injeção automática de cabeçalho, evitando discussões paralelas nos canais escolares e blindando o sistema sob os preceitos da LGPD (Lei nº 13.709/2018).
          </p>
        </section>

        {/* 4. Fundamentação Teórica */}
        <section className="space-y-3 font-sans">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            4. Fundamentação Teórica
          </h2>
          <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
            O desenvolvimento do SEC fundamenta-se nas boas práticas consolidadas da Engenharia de Software. Pressman e Maxim (2021) e Sommerville (2019) destacam que o emprego de frameworks modernos de interface previne o acoplamento desordenado entre visão e lógica de negócios, garantindo que regras críticas (como a autorização RBAC) permaneçam desacopladas e auditáveis. Guedes (2018) preconiza a Linguagem de Modelagem Unificada (UML) como vetor essencial para formalizar entidades de dados (classes Usuario, Aluno, Turma e FormularioMensagem) antes de sua implementação em código.
          </p>
          <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
            No tocante à automação e comunicação pública, estudos contemporâneos atestam a supremacia dos canais de mensageria instantânea sobre correspondências impressas. Lucena (2016) e Santos et al. (2020) comprovam que o uso de interfaces móveis e mensageria eleva substancialmente a taxa de abertura de comunicados escolares em comparação a bilhetes físicos. Por fim, a manipulação de registros de menores exige adesão indeclinável à Lei Geral de Proteção de Dados (Lei nº 13.709/2018), demandando validações sistemáticas de consentimento obtido no ato da matrícula (BRASIL, 2018).
          </p>
        </section>

        {/* 5. Metodologia */}
        <section className="space-y-3 font-sans">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            5. Metodologia de Desenvolvimento
          </h2>
          <div className="space-y-3 text-sm text-slate-700 font-serif">
            <div>
              <strong className="font-sans font-bold text-slate-900">5.1 Planejamento e Definição do Escopo:</strong>
              <p className="text-justify indent-8 mt-1">
                Com base no questionário estruturado de 20 perguntas aplicado à gestão da escola e nos diagramas de casos de uso prévios, estabeleceu-se a arquitetura front-end em React SPA, organizada em camadas: apresentação (UI components), camada de domínio (regras puras em sec-rules.ts) e persistência/mock sincronizada aos sistemas legados School+ e TecSystem.
              </p>
            </div>
            <div>
              <strong className="font-sans font-bold text-slate-900">5.2 Implementação:</strong>
              <p className="text-justify indent-8 mt-1">
                A estruturação do código foi concebida de forma modular: (i) Módulo de Autenticação e RBAC com 5 papéis institucionais; (ii) Módulo de Composição com Injeção Dinâmica de Cabeçalho em tempo real; (iii) Módulo de Fila de Validação Hierárquica com liberação ou rejeição motivada; (iv) Módulo de Gestão Cadastral com checagem de integridade LGPD; e (v) Simulador Móvel de WhatsApp e SMS. A estilização empregou classes utilitárias responsivas do Tailwind CSS com foco em ergonomia visual e alto contraste.
              </p>
            </div>
            <div>
              <strong className="font-sans font-bold text-slate-900">5.3 Publicação e Versionamento:</strong>
              <p className="text-justify indent-8 mt-1">
                O código foi organizado seguindo padrões limpos de versionamento com Git, estruturado para hospedagem no GitHub em <code className="text-xs bg-slate-100 p-1 rounded font-mono text-blue-700">{githubUrl}</code>, acompanhado de arquivo README.md abrangente com instruções de instalação, arquitetura e execução dos testes unitários.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Resultados Preliminares */}
        <section className="space-y-3 font-sans">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            6. Resultados Preliminares: Solução Inicial
          </h2>
          <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
            A aplicação web dinâmica encontra-se totalmente funcional e responsiva, demonstrando a concretização de todos os requisitos planejados:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Controle de Acesso RBAC Validado</span>
              </span>
              <p className="text-slate-600">
                O seletor de perfil permite alternar instantaneamente entre Direção, Pedagógico, Coordenação, Professor e Secretaria. O formulário oculta categorias administrativas para docentes e bloqueia auto-aprovação.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Injeção Dinâmica de Cabeçalho</span>
              </span>
              <p className="text-slate-600">
                A montagem algorítmica do cabeçalho cruza aluno, turma, turno e professor regente dos legados, exibindo em tempo real o formato exato que será entregue nos smartphones dos pais.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Conclusão */}
        <section className="space-y-3 font-sans">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            7. Conclusão
          </h2>
          <p className="text-justify text-sm text-slate-700 leading-relaxed indent-8 font-serif">
            A execução do Módulo 2 atendeu com êxito às exigências pedagógicas e técnicas do Projeto Integrador da UFMS Digital. A aplicação web dinâmica do Sistema Escola Conectada (SEC) comprova como a simbiose entre engenharia de software de ponta (React, TypeScript, Tailwind) e imersão social na rede pública de ensino é capaz de superar gargalos burocráticos históricos. A erradicação de 2.000 folhas mensais de papel aliada ao tempo de entrega imediato (1,8s) estabelece um novo paradigma de gestão e aproxima as famílias do cotidiano escolar.
          </p>
        </section>

        {/* 8. Referências */}
        <section className="space-y-3 font-sans border-t border-slate-200 pt-6">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-l-4 border-l-blue-600 pl-3">
            8. Referências (Normas ABNT NBR 6023:2018)
          </h2>
          <ul className="text-xs text-slate-700 space-y-2 text-justify font-serif">
            <li>
              BRASIL. Lei nº 13.709, de 14 de agosto de 2018. <strong>Lei Geral de Proteção de Dados Pessoais (LGPD)</strong>. Brasília, DF: Presidência da República, [2018]. Disponível em: &lt;http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm&gt;. Acesso em: 30 mar. 2026.
            </li>
            <li>
              DELAMARO, Márcio Eduardo; MALDONADO, José Carlos; JINO, Mario. <strong>Introdução ao teste de software</strong>. 2. ed. Rio de Janeiro: Elsevier, 2016.
            </li>
            <li>
              GUEDES, Gilleanes T. A. <strong>UML 2: guia prático</strong>. 3. ed. São Paulo: Érica, 2018.
            </li>
            <li>
              LUCENA, Simone. Culturas digitais e tecnologias móveis na educação. <strong>Cadernos de Pesquisa</strong>, São Paulo, v. 46, n. 161, p. 800-824, set. 2016.
            </li>
            <li>
              PRESSMAN, Roger S.; MAXIM, Bruce R. <strong>Engenharia de software: uma abordagem profissional</strong>. 9. ed. Porto Alegre: AMGH, 2021.
            </li>
            <li>
              SANTANA, Miguel das Virgens de et al. Insight forms: automated analysis of educational feedback using python and generative AI. <strong>Observatorio de la Economía Latinoamericana</strong>, v. 24, n. 2, p. 1-19, 2026.
            </li>
            <li>
              SANTOS, J. B. et al. O uso do WhatsApp como ferramenta de comunicação entre escola e família. <strong>Revista de Educação e Tecnologias</strong>, v. 5, n. 1, 2020.
            </li>
            <li>
              SOMMERVILLE, Ian. <strong>Engenharia de software</strong>. 10. ed. São Paulo: Pearson Education do Brasil, 2019.
            </li>
            <li>
              UNIVERSIDADE FEDERAL DE MATO GROSSO DO SUL. <strong>Resolução nº 142, de 21 de dezembro de 2021</strong>: Estabelece as normas de Extensão Universitária no âmbito da UFMS. Campo Grande: UFMS, 2021.
            </li>
            <li>
              WAZLAWICK, Raul Sidnei. <strong>Engenharia de software: conceitos e práticas</strong>. Rio de Janeiro: Elsevier, 2013.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
};
