

import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { DashboardMetricas } from '@/types/pmo';

interface DashboardMetricsGridProps {
  metricas: DashboardMetricas;
}

export function DashboardMetricsGrid({ metricas }: DashboardMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-pmo-gray">Total de Projetos</p>
            <p className="text-3xl font-bold text-pmo-primary">{metricas.totalProjetos}</p>
          </div>
          <div className="p-3 bg-pmo-primary/10 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-pmo-primary" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-pmo-gray">Matriz de Risco Alta</p>
            <p className="text-3xl font-bold text-red-600">{metricas.projetosCriticos}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-pmo-gray">Próximos Marcos</p>
            <p className="text-3xl font-bold text-green-600">{metricas.proximosMarcos.length}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

