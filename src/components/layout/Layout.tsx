
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
    <div className="min-h-screen bg-pmo-background flex">
      {/* Sidebar fixo */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      
      {/* Content area com margem para compensar sidebar fixo e alinhamento à esquerda */}
      <div className="flex-1 flex flex-col ml-64">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1">
          <div className={cn(
            location.pathname === "/projetos" ? "p-3 pl-6" : "p-6 pl-8",
            "text-left" // Garantir alinhamento à esquerda
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
