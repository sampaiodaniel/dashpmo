
import { Badge } from '@/components/ui/badge';
import { getStatusColor, getStatusGeralColor, Projeto } from '@/types/pmo';

interface ProjetoStatusProps {
  projeto: Projeto;
}

export function ProjetoStatus({ projeto }: ProjetoStatusProps) {
  if (!projeto.ultimoStatus) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-pmo-primary mb-4">Último Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-pmo-gray mb-2">Status Geral</h3>
          <Badge className={getStatusGeralColor(projeto.ultimoStatus.status_geral)}>
            {projeto.ultimoStatus.status_geral}
          </Badge>
        </div>
        
        <div>
          <h3 className="font-medium text-pmo-gray mb-2">Visão GP</h3>
          <Badge className={getStatusColor(projeto.ultimoStatus.status_visao_gp)}>
            {projeto.ultimoStatus.status_visao_gp}
          </Badge>
        </div>
        
        <div>
          <h3 className="font-medium text-pmo-gray mb-2">Atualizado em</h3>
          <p className="text-gray-700">
            {projeto.ultimoStatus.data_atualizacao.toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-pmo-gray mb-2">Aprovado</h3>
          <Badge variant={projeto.ultimoStatus.aprovado ? "default" : "destructive"}>
            {projeto.ultimoStatus.aprovado ? "Sim" : "Não"}
          </Badge>
        </div>
      </div>

      {projeto.ultimoStatus.realizado_semana_atual && (
        <div className="mt-6">
          <h3 className="font-medium text-pmo-gray mb-2">Realizado na Semana</h3>
          <p className="text-gray-700">{projeto.ultimoStatus.realizado_semana_atual}</p>
        </div>
      )}
    </div>
  );
}
