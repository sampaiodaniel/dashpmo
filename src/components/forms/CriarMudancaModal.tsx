
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CriarMudancaForm } from './CriarMudancaForm';

interface CriarMudancaModalProps {
  onMudancaCriada: () => void;
}

export function CriarMudancaModal({ onMudancaCriada }: CriarMudancaModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onMudancaCriada();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Mudança
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Mudança</DialogTitle>
        </DialogHeader>
        
        <CriarMudancaForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}
