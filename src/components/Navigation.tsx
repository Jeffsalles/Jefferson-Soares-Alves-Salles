import React from 'react';
import { 
  LayoutDashboard, 
  Database,
  Clock, 
  Users, 
  Smartphone, 
  FolderGit2,
  FileText,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'database' | 'queue' | 'students' | 'simulator' | 'git' | 'report';

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
    },
    {
      id: 'database' as ActiveTab,
      label: 'Banco de Dados & SQL',
      icon: Database,
      badge: 'SQLite',
      badgeColor: 'bg-blue-600 text-white text-[10px]',
    },
    {
      id: 'queue' as ActiveTab,
      label: 'Fila de Validação',
      icon: Clock,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'students' as ActiveTab,
      label: 'Alunos & CRUD',
      icon: Users,
      badge: null,
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'WhatsApp Pais',
      icon: Smartphone,
      badge: '1-Via',
      badgeColor: 'bg-emerald-600 text-white text-[10px]',
    },
    {
      id: 'git' as ActiveTab,
      label: 'Controle Git',
      icon: FolderGit2,
      badge: 'Git',
      badgeColor: 'bg-slate-800 text-white text-[10px]',
    },
    {
      id: 'report' as ActiveTab,
      label: 'Relatório Módulo 3',
      icon: FileText,
      badge: 'ABNT',
      badgeColor: 'bg-indigo-600 text-white text-[10px]',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 print:hidden" aria-label="Navegação Principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto space-x-1 py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-800 shadow-xs border border-blue-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
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
