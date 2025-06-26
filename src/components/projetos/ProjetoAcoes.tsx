
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, History } from 'lucide-react';
import { Projeto } from '@/types/pmo';

interface ProjetoAcoesProps {
  projeto: Projeto;
  onRefresh: () => void;
}

export function ProjetoAcoes({ projeto, onRefresh }: ProjetoAcoesProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-pmo-primary mb-4">Ações</h2>
      <div className="space-y-3">
        <Button className="w-full" onClick={() => navigate(`/novo-status?projeto=${projeto.id}`)}>
          Novo Status
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate(`/editar-projeto/${projeto.id}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Projeto
        </Button>
      </div>
    </div>
  );
}
