
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePerfilUsuario } from '@/hooks/usePerfilUsuario';
import { useNavigate } from 'react-router-dom';
import { NotificationsDropdown } from './NotificationsDropdown';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { usuario, logout, refreshUsuario } = useAuth();
  const { data: perfil, refetch: refetchPerfil } = usePerfilUsuario(usuario?.id || 0);
  const navigate = useNavigate();

  // Atualizar dados quando necessário
  useEffect(() => {
    const interval = setInterval(() => {
      if (usuario?.id) {
        refreshUsuario();
        refetchPerfil();
      }
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, [usuario?.id, refreshUsuario, refetchPerfil]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleConfiguracoes = () => {
    navigate('/configuracoes');
  };

  const getInitials = () => {
    if (perfil?.nome && perfil?.sobrenome) {
      return `${perfil.nome[0]}${perfil.sobrenome[0]}`.toUpperCase();
    }
    return usuario?.nome.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (perfil?.nome && perfil?.sobrenome) {
      return `${perfil.nome} ${perfil.sobrenome}`;
    }
    return usuario?.nome || 'Usuário';
  };

  const getFirstName = () => {
    if (perfil?.nome) {
      return perfil.nome;
    }
    return usuario?.nome.split(' ')[0] || 'Usuário';
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
          <img 
            src="/lovable-uploads/f0e94f5b-d465-4cff-932b-0a29b68665fa.png" 
            alt="ASA" 
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-pmo-primary">DashPMO</h1>
            <p className="text-xs text-pmo-gray">Gestão de Projetos de TI</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notificações */}
        <NotificationsDropdown />

        {/* Menu do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-pmo-background">
              <Avatar className="h-8 w-8">
                <AvatarImage src={perfil?.foto_url} />
                <AvatarFallback className="bg-pmo-secondary text-white text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-pmo-primary">{getFirstName()}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{getDisplayName()}</p>
              <p className="text-xs text-pmo-gray">{usuario?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleConfiguracoes}>
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
