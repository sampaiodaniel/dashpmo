
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Target, AlertTriangle, TrendingUp } from 'lucide-react';

interface MetricasVisuaisProps {
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
}

export function MetricasVisuais({ projetos, statusProjetos, incidentes }: MetricasVisuaisProps) {
  const totalProjetos = projetos.length;
  const projetosVerde = statusProjetos.filter(s => s.status_geral === 'Verde').length;
  const projetosAmarelo = statusProjetos.filter(s => s.status_geral === 'Amarelo').length;
  const projetosVermelho = statusProjetos.filter(s => s.status_geral === 'Vermelho').length;
  
  const progressoMedio = statusProjetos.length > 0 
    ? Math.round(statusProjetos.reduce((acc, s) => acc + (s.progresso_estimado || 0), 0) / statusProjetos.length)
    : 0;

  const incidentesAtivos = incidentes.reduce((acc, inc) => acc + (inc.atual || 0), 0);

  const metricas = [
    {
      title: 'Total de Projetos',
      value: totalProjetos,
      icon: BarChart3,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Progresso Médio',
      value: `${progressoMedio}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Status Verde',
      value: projetosVerde,
      icon: Target,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Incidentes Ativos',
      value: incidentesAtivos,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metricas.map((metrica, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metrica.title}
              </CardTitle>
              <metrica.icon className={`h-4 w-4 ${metrica.textColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrica.value}</div>
          </CardContent>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${metrica.color}`}></div>
        </Card>
      ))}
    </div>
  );
}
