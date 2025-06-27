
import { Badge } from '@/components/ui/badge';
import { Projeto } from '@/types/pmo';

interface ProjetoStatusProps {
  projeto: Projeto;
}

export function ProjetoStatus({ projeto }: ProjetoStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={projeto.status_ativo ? "default" : "secondary"}
        className={projeto.status_ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
      >
        {projeto.status_ativo ? "Ativo" : "Inativo"}
      </Badge>
    </div>
  );
}
