
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-pmo-background">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className={cn(
          "flex-1 transition-all duration-200 ease-in-out",
          "lg:ml-64" // Sempre com margem no desktop
        )}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
