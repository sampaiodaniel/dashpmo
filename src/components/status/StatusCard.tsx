import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { useNavigate } from 'react-router-dom';
import { StatusAcoes } from './StatusAcoes';
import { useAuth } from '@/hooks/useAuth';

interface StatusCardProps {
  status: StatusProjeto;
}

export function StatusCard({ status }: StatusCardProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleCardClick = () => {
    navigate(`/projetos/${status.projeto_id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            Status do Projeto
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="text-xs font-medium text-gray-500">Projeto:</span>
              <div className="font-medium">{status.projeto?.nome_projeto}</div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Data:</span>
              <div className="font-medium">{status.data_atualizacao.toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Status Geral:</span>
              <div className="font-medium">{status.status_geral}</div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Visão do GP:</span>
              <div className="font-medium">{status.status_visao_gp}</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <StatusAcoes status={status} isAdmin={isAdmin} />
        </div>
      </CardContent>
    </Card>
  );
}
