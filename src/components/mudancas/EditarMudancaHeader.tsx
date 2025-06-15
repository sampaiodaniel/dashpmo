
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';

interface EditarMudancaHeaderProps {
  mudanca: MudancaReplanejamento;
  onVoltar: () => void;
}

export function EditarMudancaHeader({ mudanca, onVoltar }: EditarMudancaHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="outline" 
        onClick={onVoltar}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      <h1 className="text-2xl font-bold text-pmo-primary">
        Editar Mudança - {mudanca.projeto?.nome_projeto}
      </h1>
    </div>
  );
}
