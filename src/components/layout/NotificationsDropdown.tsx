
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useStatusPendentes } from '@/hooks/useStatusPendentes';
import { useAuth } from '@/hooks/useAuth';
import { useNotificacoesLidas } from '@/hooks/useNotificacoesLidas';
import { useResponsavelEHierarquia } from '@/hooks/useResponsavelEHierarquia';

export function NotificationsDropdown() {
  const { usuario } = useAuth();
  const { data: statusPendentes } = useStatusPendentes();
  const { notificacoesLidas, marcarComoLida } = useNotificacoesLidas();

  // Para cada responsável ASA, verificar se o usuário atual está na hierarquia
  const statusParaUsuario = statusPendentes?.filter(status => {
    if (!status.projeto?.responsavel_asa || !usuario?.nome) return false;
    
    // Usar o hook para verificar hierarquia
    const { data: hierarquia } = useResponsavelEHierarquia(status.projeto.responsavel_asa);
    
    return hierarquia?.includes(usuario.nome);
  }) || [];

  const statusNaoLidos = statusParaUsuario.filter(status => 
    !notificacoesLidas.includes(status.id)
  );

  const handleNotificationClick = (statusId: number) => {
    marcarComoLida(statusId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {statusNaoLidos.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
              {statusNaoLidos.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {statusNaoLidos.length === 0 ? (
          <DropdownMenuItem disabled>
            Nenhuma notificação pendente
          </DropdownMenuItem>
        ) : (
          statusNaoLidos.map((status) => (
            <DropdownMenuItem 
              key={status.id}
              onClick={() => handleNotificationClick(status.id)}
              className="flex flex-col items-start p-3"
            >
              <div className="font-medium text-sm">Status pendente de revisão</div>
              <div className="text-xs text-gray-500 mt-1">
                Projeto: {status.projeto?.nome_projeto}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(status.data_atualizacao).toLocaleDateString('pt-BR')}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
