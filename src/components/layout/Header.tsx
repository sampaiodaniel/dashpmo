
import { Bell, LogOut, User, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { NotificationsDropdown } from './NotificationsDropdown';
import { usePerfilUsuario } from '@/hooks/usePerfilUsuario';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { data: perfil } = usePerfilUsuario(usuario?.id || 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePerfil = () => {
    navigate('/configuracoes');
  };

  // Garantir que sempre temos um nome para exibir
  const displayName = perfil?.nome || usuario?.nome || 'Usuário';
  const displayInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/fdc350e6-9710-407a-8086-69dd3e7945bb.png" 
            alt="DashPMO" 
            className="h-8 w-8"
          />
          <span className="text-lg font-bold text-pmo-primary">DashPMO</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
            alt="ASA Logo" 
            className="h-12 w-auto"
          />
          <div className="text-right">
            <div className="text-lg font-bold text-pmo-primary">ASA Investments</div>
            <div className="text-xs text-pmo-gray">Gestão de Projetos de TI</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsDropdown />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={perfil?.foto_url || "/placeholder.svg"} alt="@usuario" />
                <AvatarFallback>
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {usuario?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handlePerfil}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
