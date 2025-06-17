import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface StatusAcoesProps {
  status: StatusProjeto;
  isAdmin?: boolean;
}

export function StatusAcoes({ status, isAdmin }: StatusAcoesProps) {
  const { revisar, rejeitarStatus, isLoading } = useStatusOperations();
  const queryClient = useQueryClient();

  const handleExcluirStatus = async () => {
    if (!confirm('Tem certeza que deseja excluir este status? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('status_projeto')
        .delete()
        .eq('id', status.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status excluído com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['status-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['status-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['status-list'] });
    } catch (error) {
      console.error('Erro ao excluir status:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir status. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      {!status.aprovado && (
        <>
          <Button
            onClick={() => revisar({ statusId: status.id, revisadoPor: 'Admin' })}
            disabled={isLoading}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Aprovar
          </Button>
          
          <Button
            onClick={() => rejeitarStatus({ statusId: status.id })}
            disabled={isLoading}
            size="sm"
            variant="destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Rejeitar
          </Button>
        </>
      )}

      {isAdmin && (
        <Button
          onClick={handleExcluirStatus}
          size="sm"
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      )}
    </div>
  );
}
