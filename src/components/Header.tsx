import React from 'react';
import { UserProfile, UserRole } from '../types';
import { PROFILES } from '../data/mockData';
import { 
  School, 
  ShieldCheck, 
  Bell, 
  Send, 
  UserCheck, 
  Sparkles,
  Info
} from 'lucide-react';

interface HeaderProps {
  currentProfile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  pendingCount: number;
  onOpenCompose: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  onProfileChange,
  pendingCount,
  onOpenCompose,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'direcao':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">👑 Direção (Acesso Total)</span>;
      case 'pedagogico':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">🌱 Pedagógico</span>;
      case 'coordenacao':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">🧭 Coordenação</span>;
      case 'professor':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">👨‍🏫 Professor (Fila Obrigatória)</span>;
      case 'secretaria':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">📋 Secretaria (Apenas ADM)</span>;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top institution bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide">UFMS Digital</span>
            <span className="text-slate-500">•</span>
            <span>Programa de Extensão Universitária (95DX7.200525)</span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-amber-400 font-mono">EMEIEF Prof. José Antônio de Miranda</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Acadêmico: <strong className="text-slate-200">Jefferson Soares Alves Salles</strong></span>
            <span className="hidden sm:inline bg-slate-800 px-2 py-0.5 rounded text-[11px] text-emerald-400 border border-slate-700">Módulo 2: HTML/CSS & Framework</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-900/20 shrink-0">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-black text-slate-900 tracking-tight">SEC</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-slate-600">Sistema Escola Conectada</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                v2.0 Web
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span>Mensageria Unidirecional Oficial</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> LGPD 13.709/18
              </span>
            </div>
          </div>
        </div>

        {/* User Role Switcher & Primary Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role selector dropdown */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <label htmlFor="role-select" className="px-2 font-medium text-slate-600 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Simular Perfil:</span>
            </label>
            <select
              id="role-select"
              value={currentProfile.id}
              onChange={(e) => {
                const found = PROFILES.find((p) => p.id === e.target.value);
                if (found) onProfileChange(found);
              }}
              className="bg-white border border-slate-200 text-slate-800 font-semibold py-1.5 px-3 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.cargo} — {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Role status pill */}
          <div className="hidden lg:block">
            {getRoleBadge(currentProfile.papel)}
          </div>

          {/* Compose message button */}
          <button
            onClick={onOpenCompose}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-500/25 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Redigir Comunicado</span>
          </button>
        </div>
      </div>
    </header>
  );
};
