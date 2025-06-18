
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-pmo-background flex flex-col">
      {/* Sidebar fixo */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      
      {/* Content area com margem para compensar sidebar fixo */}
      <div className="flex-1 flex flex-col ml-64">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1">
          <div className={cn(
            "p-6",
            location.pathname === "/projetos" && "p-3 pl-6"
          )}>
            {children}
          </div>
        </main>

        {/* Footer discreto */}
        <footer className="py-3 px-6 border-t border-gray-200 bg-white">
          <div className="text-right">
            <p className="text-xs text-gray-300">
              © 2025 ASA. Todos os direitos reservados. | DashPMO - Sistema desenvolvido por Daniel Sampaio de Almeida - daniel.almeida@cwi.com.br
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
