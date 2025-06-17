
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChart3, Play, Square, Clock, AlertTriangle, BookOpen } from "lucide-react";

interface ProjetosKPIsProps {
  metricas: {
    total: number;
    ativos: number;
    fechados: number;
    statusPendentes: number;
    statusVencidos: number;
    licoesDisponiveis: number;
  };
  filtroAtivo: string | null;
  onFiltroClick: (tipo: string) => void;
}

export function ProjetosKPIs({ metricas, filtroAtivo, onFiltroClick }: ProjetosKPIsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'statusPendentes' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('statusPendentes')}
      >
        <MetricCard
          title="Status"
          value={metricas.statusPendentes}
          icon={<Clock className="h-5 w-5" />}
          className="border-l-4 border-l-pmo-warning hover:shadow-md"
        />
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'statusVencidos' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('statusVencidos')}
      >
        <MetricCard
          title="Replanejamento"
          value={metricas.statusVencidos}
          icon={<AlertTriangle className="h-5 w-5" />}
          className="border-l-4 border-l-pmo-danger hover:shadow-md"
        />
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'licoesDisponiveis' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('licoesDisponiveis')}
      >
        <MetricCard
          title="Lições"
          value={metricas.licoesDisponiveis}
          icon={<BookOpen className="h-5 w-5" />}
          className="border-l-4 border-l-blue-500 hover:shadow-md"
        />
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'fechados' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('fechados')}
      >
        <MetricCard
          title="Fechados"
          value={metricas.fechados}
          icon={<Square className="h-5 w-5" />}
          className="border-l-4 border-l-gray-400 hover:shadow-md"
        />
      </div>
    </div>
  );
}
