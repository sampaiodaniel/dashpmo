

import { BarChart3, Play } from "lucide-react";

interface ProjetosKPIsProps {
  metricas: {
    total: number;
    ativos: number;
  };
  filtroAtivo: string | null;
  onFiltroClick: (tipo: string) => void;
}

export function ProjetosKPIs({ metricas, filtroAtivo, onFiltroClick }: ProjetosKPIsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'total' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('total')}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-pmo-gray">Total de Projetos</p>
              <p className="text-3xl font-bold text-pmo-primary">{metricas.total}</p>
            </div>
            <div className="p-3 bg-pmo-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-pmo-primary" />
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'ativos' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('ativos')}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-pmo-gray">Projetos Ativos</p>
              <p className="text-3xl font-bold text-green-600">{metricas.ativos}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

