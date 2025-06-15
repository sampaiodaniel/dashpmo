
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FolderOpen, 
  Plus, 
  CheckSquare, 
  BarChart3, 
  AlertTriangle,
  BookOpen,
  FileText,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Visão geral dos projetos'
  },
  {
    title: 'Projetos',
    href: '/projetos',
    icon: FolderOpen,
    description: 'Gestão de projetos'
  },
  {
    title: 'Novo Status',
    href: '/status/novo',
    icon: Plus,
    description: 'Cadastrar atualização'
  },
  {
    title: 'Aprovações',
    href: '/aprovacoes',
    icon: CheckSquare,
    description: 'Pendências de aprovação'
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
    description: 'Consultas e relatórios'
  },
  {
    title: 'Mudanças',
    href: '/mudancas',
    icon: AlertTriangle,
    description: 'Change requests'
  },
  {
    title: 'Lições Aprendidas',
    href: '/licoes',
    icon: BookOpen,
    description: 'Base de conhecimento'
  },
  {
    title: 'Incidentes',
    href: '/incidentes',
    icon: FileText,
    description: 'Controle de incidentes'
  }
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-48 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-auto"
      )}>
        <div className="flex flex-col h-full">
          {/* Header do sidebar com botão fechar (mobile) */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold text-pmo-primary">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive 
                    ? "bg-pmo-primary text-white" 
                    : "text-pmo-gray hover:bg-pmo-background hover:text-pmo-primary"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-75 truncate">{item.description}</div>
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Footer do sidebar */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-pmo-gray text-center">
              <div className="font-medium">Sistema PMO v1.0</div>
              <div>Gestão de Projetos Corporativo</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
