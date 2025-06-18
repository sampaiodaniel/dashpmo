
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useIncidenteOperations } from '@/hooks/useIncidentes';
import { IncidenteHistorico } from '@/hooks/useIncidentesHistorico';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExcluirIncidenteModalProps {
  incidente: IncidenteHistorico;
  isOpen: boolean;
  onClose: () => void;
}

export function ExcluirIncidenteModal({ incidente, isOpen, onClose }: ExcluirIncidenteModalProps) {
  const { excluirIncidente } = useIncidenteOperations();

  const handleExcluir = async () => {
    try {
      await excluirIncidente.mutateAsync(incidente.id);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir incidente:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-pmo-gray">
            Tem certeza que deseja excluir este registro de incidente?
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-red-800">Carteira:</span>
              <span className="text-red-700">{incidente.carteira}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-red-800">Data:</span>
              <span className="text-red-700">
                {format(new Date(incidente.data_registro), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-red-800">Atual:</span>
              <span className="text-red-700">{incidente.atual} incidentes</span>
            </div>
          </div>
          
          <p className="text-sm text-red-600 font-medium">
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleExcluir}
              disabled={excluirIncidente.isPending}
              className="flex-1"
            >
              {excluirIncidente.isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
