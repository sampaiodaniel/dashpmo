
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { useStatusOperations } from '@/hooks/useStatusOperations';

interface StatusAcoesProps {
  status: StatusProjeto;
}

export function StatusAcoes({ status }: StatusAcoesProps) {
  const { revisar, rejeitarStatus, isLoading } = useStatusOperations();

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
    </div>
  );
}
