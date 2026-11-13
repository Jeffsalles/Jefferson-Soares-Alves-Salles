import React from 'react';
import {
  GitBranch,
  GitCommit,
  GitMerge,
  Github,
  ExternalLink,
  CheckCircle2,
  FolderGit2,
  Terminal,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import type { GitInfoResponse } from '../types';

interface GitVersionControlViewProps {
  gitInfo: GitInfoResponse | null;
  onRefresh: () => void;
}

export const GitVersionControlView: React.FC<GitVersionControlViewProps> = ({
  gitInfo,
  onRefresh,
}) => {
  const getCommitBadgeColor = (type: string) => {
    switch (type) {
      case 'feat':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'fix':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'docs':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'test':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'refactor':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const githubUrl = 'https://github.com/jefferson-salles/sec-escola-conectada';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-slate-800" />
              <span>Controle de Versão (Git & GitHub)</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
              Branch ativa: {gitInfo?.currentBranch || 'main'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoramento em tempo real do repositório Git local, histórico de commits semânticos (Conventional Commits) e estratégia de branches para publicação no GitHub.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Git Log</span>
          </button>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Abrir Repositório GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Commits Registrados
            </span>
            <GitCommit className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {gitInfo?.totalCommits ?? 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Padronizados com Conventional Commits
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Branches Organizadas
            </span>
            <GitBranch className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(gitInfo?.branches || ['main']).map((branch) => (
              <span
                key={branch}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                  branch === gitInfo?.currentBranch
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {branch}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Fluxo isolado por feature + merge controlado
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Boas Práticas (.gitignore)
            </span>
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900">
            Segredos e binários protegidos
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Arquivos <code className="bg-slate-100 px-1 rounded">.env</code>, <code className="bg-slate-100 px-1 rounded">node_modules/</code> e <code className="bg-slate-100 px-1 rounded">*.db</code> ignorados corretamente.
          </p>
        </div>
      </div>

      {/* Main Content: Commit History + GitHub Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Real Git Log (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-blue-600" />
              <span>Histórico Real de Commits (<code className="font-mono text-xs">git log</code>)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Repositório Local Sincronizado
            </span>
          </div>

          {!gitInfo || gitInfo.commits.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Nenhum commit registrado ainda no repositório local.
            </div>
          ) : (
            <div className="space-y-3">
              {gitInfo.commits.map((commit, index) => (
                <div
                  key={commit.hash || index}
                  className="relative pl-6 pb-3 border-l-2 border-slate-200 last:border-l-transparent"
                >
                  <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getCommitBadgeColor(
                            commit.type
                          )}`}
                        >
                          {commit.type}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {commit.shortHash}
                        </span>
                        {commit.refs && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                            {commit.refs}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{commit.date}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-900">{commit.subject}</p>
                    <div className="text-[11px] text-slate-500">
                      Autor: <strong className="text-slate-700">{commit.author}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Branching Strategy & GitHub Publish Commands (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Estratégia de Versionamento & Publicação GitHub</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O projeto adota o fluxo baseado em ramificações temáticas (<code className="text-emerald-300">feature/*</code>) integradas via merge semântico à branch principal (<code className="text-emerald-300">main</code>):
            </p>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
{`# 1. Criação de branch para modelagem SQL
git checkout -b feature/modelagem-bd
git add sql/01_schema.sql sql/02_seed.sql
git commit -m "feat(db): modelagem 3FN e script DDL/seed"

# 2. Integração na branch principal
git checkout main
git merge --no-ff feature/modelagem-bd

# 3. Publicação no GitHub
git remote add origin ${githubUrl}.git
git push -u origin main`}
            </pre>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Checklist de Boas Práticas Atendidas</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Commits frequentes e atômicos separados por responsabilidade (banco, lógica, testes, interface, relatório).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Mensagens explicativas seguindo o padrão internacional <strong>Conventional Commits</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Arquivo <code className="bg-slate-100 px-1 rounded">README.md</code> atualizado com diagrama, instruções SQL e guia de execução.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Privacidade e LGPD: dados fictícios/anonimizados no seed e exclusão de arquivos sensíveis no <code className="bg-slate-100 px-1 rounded">.gitignore</code>.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
