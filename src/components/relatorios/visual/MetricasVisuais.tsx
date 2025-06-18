
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

interface MetricasVisuaisProps {
  projetos: any[];
}

export function MetricasVisuais({ projetos }: MetricasVisuaisProps) {
  // Calcular métricas reais
  const totalProjetos = projetos.length;
  const projetosVerdes = projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Verde').length;
  const projetosAmarelos = projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Amarelo').length;
  const projetosVermelhos = projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Vermelho').length;
  
  // Projetos com entregas próximas (próximos 30 dias)
  const hoje = new Date();
  const proximas30Dias = new Date();
  proximas30Dias.setDate(hoje.getDate() + 30);
  
  const entregasProximas = projetos.reduce((acc, projeto) => {
    const status = projeto.ultimoStatus;
    if (!status) return acc;
    
    const datas = [status.data_marco1, status.data_marco2, status.data_marco3]
      .filter(data => data)
      .map(data => new Date(data))
      .filter(data => data >= hoje && data <= proximas30Dias);
    
    return acc + datas.length;
  }, 0);

  // Projetos concluídos ou em fase final
  const projetosConcluidos = projetos.filter(p => 
    p.ultimoStatus?.status_geral === 'Concluído' || 
    p.ultimoStatus?.status_geral === 'Aguardando Homologação'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white border-l-4 border-[#1B365D]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#6B7280]">
            Total de Projetos
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-[#1B365D]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1B365D]">{totalProjetos}</div>
          <p className="text-xs text-[#6B7280]">
            Projetos ativos monitorados
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-l-4 border-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#6B7280]">
            Status Saudável
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{projetosVerdes}</div>
          <p className="text-xs text-[#6B7280]">
            {totalProjetos > 0 ? Math.round((projetosVerdes / totalProjetos) * 100) : 0}% dos projetos
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-l-4 border-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#6B7280]">
            Entregas Próximas
          </CardTitle>
          <Calendar className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{entregasProximas}</div>
          <p className="text-xs text-[#6B7280]">
            Próximos 30 dias
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-l-4 border-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#6B7280]">
            Finalizações
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{projetosConcluidos}</div>
          <p className="text-xs text-[#6B7280]">
            Concluídos ou em homologação
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
