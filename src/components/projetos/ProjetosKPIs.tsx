import { BarChart3, Play } from "lucide-react";
import { KpiBox } from '@/components/common/KpiBox';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'total' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('total')}
      >
        <KpiBox
          title="Total de Projetos"
          value={metricas.total}
          icon={<BarChart3 className="h-5 w-5" />}
          color="blue"
        />
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'ativos' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('ativos')}
      >
        <KpiBox
          title="Projetos Ativos"
          value={metricas.ativos}
          icon={<Play className="h-5 w-5" />}
          color="green"
        />
      </div>
    </div>
  );
}
