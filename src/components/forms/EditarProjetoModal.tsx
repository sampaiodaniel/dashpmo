
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Projeto } from '@/types/pmo';
import { EditarProjetoForm } from './EditarProjetoForm';

interface EditarProjetoModalProps {
  projeto: Projeto;
  aberto: boolean;
  onFechar: () => void;
}

export function EditarProjetoModal({ projeto, aberto, onFechar }: EditarProjetoModalProps) {
  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        
        <EditarProjetoForm projeto={projeto} onSuccess={onFechar} />
        
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onFechar}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
