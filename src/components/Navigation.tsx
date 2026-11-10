import React from 'react';
import { 
  LayoutDashboard, 
  Send, 
  Clock, 
  Users, 
  Smartphone, 
  FileText,
  BadgeAlert
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'compose' | 'queue' | 'students' | 'simulator' | 'report';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Painel & Impacto',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Métricas e economia sustentável',
    },
    {
      id: 'compose' as ActiveTab,
      label: 'Redigir Comunicado',
      icon: Send,
      badge: null,
      desc: 'Injeção de cabeçalho padronizado',
    },
    {
      id: 'queue' as ActiveTab,
      label: 'Fila de Validação',
      icon: Clock,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Retenção hierárquica docente',
    },
    {
      id: 'students' as ActiveTab,
      label: 'Alunos & Responsáveis',
      icon: Users,
      badge: null,
      desc: 'School+ & TecSystem espelhados',
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'Simulador WhatsApp Pais',
      icon: Smartphone,
      badge: 'Unidirecional',
      badgeColor: 'bg-emerald-600 text-white text-[10px]',
      desc: 'Recepção mobile dos responsáveis',
    },
    {
      id: 'report' as ActiveTab,
      label: 'Relatório Módulo 2 (UFMS)',
      icon: FileText,
      badge: 'ABNT',
      badgeColor: 'bg-indigo-600 text-white text-[10px]',
      desc: 'Documentação acadêmica oficial',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200" aria-label="Navegação Principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto space-x-1 sm:space-x-2 py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-800 shadow-xs border border-blue-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.badgeColor || 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
