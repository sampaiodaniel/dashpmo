
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStatusPendentes } from '@/hooks/useStatusPendentes';
import { useNavigate } from 'react-router-dom';

export function NotificationsDropdown() {
  const { usuario, canApprove } = useAuth();
  const { data: statusPendentes } = useStatusPendentes();
  const [notificacoesLidas, setNotificacoesLidas] = useState<number[]>([]);
  const navigate = useNavigate();

  // Calcular número de notificações não lidas
  const notificacoesNaoLidas = canApprove() ? 
    statusPendentes?.filter(status => !notificacoesLidas.includes(status.id)).length || 0 : 0;

  const handleOpenDropdown = () => {
    // Marcar todas as notificações como lidas quando abrir o dropdown
    if (statusPendentes) {
      setNotificacoesLidas(statusPendentes.map(status => status.id));
    }
  };

  const handleVerAprovacoes = () => {
    navigate('/aprovacoes');
  };

  const handleVerStatus = (statusId: number) => {
    navigate(`/status/${statusId}`);
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && handleOpenDropdown()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-pmo-gray" />
          {notificacoesNaoLidas > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-pmo-danger rounded-full text-xs text-white flex items-center justify-center">
              {notificacoesNaoLidas}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-3 py-2">
          <h3 className="font-medium text-pmo-primary">Notificações</h3>
        </div>
        <DropdownMenuSeparator />
        
        {!canApprove() ? (
          <div className="px-3 py-4 text-center text-gray-500">
            <p className="text-sm">Você não tem permissão para ver notificações</p>
          </div>
        ) : statusPendentes && statusPendentes.length > 0 ? (
          <>
            {statusPendentes.slice(0, 5).map((status) => (
              <DropdownMenuItem 
                key={status.id}
                onClick={() => handleVerStatus(status.id)}
                className="px-3 py-3 cursor-pointer"
              >
                <div className="flex items-start gap-3 w-full">
                  <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pmo-primary truncate">
                      Status pendente de aprovação
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      Projeto: {status.projeto?.nome_projeto}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(status.data_atualizacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            
            {statusPendentes.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleVerAprovacoes} className="px-3 py-2 text-center">
                  <span className="text-sm text-pmo-primary font-medium">
                    Ver todas as aprovações ({statusPendentes.length})
                  </span>
                </DropdownMenuItem>
              </>
            )}
          </>
        ) : (
          <div className="px-3 py-4 text-center text-gray-500">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">Nenhuma notificação pendente</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
