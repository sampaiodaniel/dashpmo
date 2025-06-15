
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, History } from 'lucide-react';
import { Projeto } from '@/types/pmo';

interface ProjetoAcoesProps {
  projeto: Projeto;
  onEditarClick: () => void;
  onHistoricoClick: () => void;
}

export function ProjetoAcoes({ projeto, onEditarClick, onHistoricoClick }: ProjetoAcoesProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-pmo-primary mb-4">Ações</h2>
      <div className="space-y-3">
        <Button className="w-full" onClick={() => navigate(`/status/novo?projeto=${projeto.id}`)}>
          Novo Status
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onEditarClick}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Projeto
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onHistoricoClick}
        >
          <History className="h-4 w-4 mr-2" />
          Ver Histórico
        </Button>
      </div>
    </div>
  );
}
