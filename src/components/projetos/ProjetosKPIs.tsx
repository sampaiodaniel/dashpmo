
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
    <div className="grid grid-cols-2 gap-4">
      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'total' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('total')}
      >
        <MetricCard
          title="Total de Projetos"
          value={metricas.total}
          icon={<BarChart3 className="h-5 w-5" />}
          className="border-l-4 border-l-pmo-primary hover:shadow-md"
        />
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'ativos' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('ativos')}
      >
        <MetricCard
          title="Projetos Ativos"
          value={metricas.ativos}
          icon={<Play className="h-5 w-5" />}
          className="border-l-4 border-l-pmo-success hover:shadow-md"
        />
      </div>
    </div>
  );
}
