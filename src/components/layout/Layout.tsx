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
    <div className="min-h-screen bg-white flex">
      {/* Sidebar fixo */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      
      {/* Content area com margem para compensar sidebar fixo */}
      <div className="flex-1 flex flex-col ml-64 bg-white">
        <Header onToggleSidebar={toggleSidebar} />
        
        {/* Main content com fundo cinza apenas para a área de conteúdo */}
        <main className="flex-1 bg-pmo-background">
          <div className={cn(
            "min-h-[calc(100vh-4rem)] p-6", // Altura mínima para preencher tela - altura do header
            location.pathname === "/projetos" && "p-3 pl-6",
            // Container responsivo para monitores grandes
            "max-w-none", // Remove limitação de largura
            "2xl:px-8", // Mais padding em telas muito grandes
            "3xl:px-12" // Ainda mais padding em telas ultra grandes
          )}>
            <div className="w-full mx-auto">
              {children}
            </div>
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
