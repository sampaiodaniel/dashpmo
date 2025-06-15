
import { Edit } from 'lucide-react';

interface MudancasEmptyStateProps {
  filtrosAplicados: boolean;
}

export function MudancasEmptyState({ filtrosAplicados }: MudancasEmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="text-center py-12 text-pmo-gray">
        <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">
          {filtrosAplicados ? 'Nenhuma mudança encontrada para os filtros aplicados' : 'Nenhuma mudança encontrada'}
        </p>
        <p className="text-sm">
          {filtrosAplicados ? 'Tente alterar os filtros aplicados' : 'Comece criando sua primeira solicitação de mudança'}
        </p>
      </div>
    </div>
  );
}
