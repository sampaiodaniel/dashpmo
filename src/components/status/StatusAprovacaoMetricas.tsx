

import { useStatusList } from '@/hooks/useStatusList';
import { useStatusFiltroMetricas } from '@/hooks/useStatusFiltroMetricas';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function StatusAprovacaoMetricas() {
  const { data: statusList, isLoading } = useStatusList();
  const { metricas } = useStatusFiltroMetricas(statusList);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-pmo-gray">Total de Status</p>
            <p className="text-3xl font-bold text-pmo-primary">{metricas.totalStatus}</p>
          </div>
          <div className="p-3 bg-pmo-primary/10 rounded-lg">
            <AlertCircle className="h-6 w-6 text-pmo-primary" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-pmo-gray">Não Revisados</p>
            <p className="text-3xl font-bold text-yellow-600">{metricas.statusPendentes}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-pmo-gray">Revisados</p>
            <p className="text-3xl font-bold text-green-600">{metricas.statusRevisados}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

