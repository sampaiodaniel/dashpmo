
import { MetricCard } from "@/components/dashboard/MetricCard";
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
    <div className="grid grid-cols-2 gap-3">
      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'total' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('total')}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pmo-gray">Total de Projetos</p>
              <p className="text-2xl font-bold text-pmo-primary">{metricas.total}</p>
            </div>
            <div className="p-2 bg-pmo-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-pmo-primary" />
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'ativos' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('ativos')}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pmo-gray">Projetos Ativos</p>
              <p className="text-2xl font-bold text-pmo-success">{metricas.ativos}</p>
            </div>
            <div className="p-2 bg-pmo-success/10 rounded-lg">
              <Play className="h-5 w-5 text-pmo-success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
