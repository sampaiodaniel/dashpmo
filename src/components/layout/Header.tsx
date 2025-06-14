
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { usuario, logout } = useAuth();
  const [notificacoes] = useState(3); // Mock de notificações

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pmo-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PMO</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-pmo-primary">Sistema PMO</h1>
            <p className="text-xs text-pmo-gray">Gestão de Projetos Corporativo</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notificações */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-pmo-gray" />
          {notificacoes > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-pmo-danger rounded-full text-xs text-white flex items-center justify-center">
              {notificacoes}
            </span>
          )}
        </Button>

        {/* Menu do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-pmo-background">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-pmo-secondary text-white text-sm">
                  {usuario?.nome.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-pmo-primary">{usuario?.nome}</p>
                <p className="text-xs text-pmo-gray">{usuario?.tipo_usuario}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{usuario?.nome}</p>
              <p className="text-xs text-pmo-gray">{usuario?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-pmo-danger">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
