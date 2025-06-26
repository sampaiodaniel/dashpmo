
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Projeto } from '@/types/pmo';

interface ProjetoAcoesProps {
  projeto: Projeto;
  onRefresh: () => void;
}

export function ProjetoAcoes({ projeto, onRefresh }: ProjetoAcoesProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button onClick={() => navigate(`/novo-status?projeto=${projeto.id}`)}>
        Novo Status
      </Button>
      <Button 
        variant="outline" 
        onClick={() => navigate(`/editar-projeto/${projeto.id}`)}
      >
        <Edit className="h-4 w-4 mr-2" />
        Editar Projeto
      </Button>
    </div>
  );
}
