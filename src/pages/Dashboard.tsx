
import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { ProximosMarcos } from '@/components/dashboard/ProximosMarcos';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderOpen, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';
import { generateDashboardMetricas } from '@/data/mockData';
import { DashboardMetricas } from '@/types/pmo';

export default function Dashboard() {
  const [metricas, setMetricas] = useState<DashboardMetricas | null>(null);
  const [filtroArea, setFiltroArea] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setMetricas(generateDashboardMetricas());
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [filtroArea]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMetricas(generateDashboardMetricas());
      setIsLoading(false);
    }, 500);
  };

  if (isLoading || !metricas) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">Dashboard</h1>
            <p className="text-pmo-gray">Visão geral dos projetos corporativos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Dashboard</h1>
          <p className="text-pmo-gray">Visão geral dos projetos corporativos</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-pmo-gray" />
            <Select value={filtroArea} onValueChange={setFiltroArea}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="area1">Área 1</SelectItem>
                <SelectItem value="area2">Área 2</SelectItem>
                <SelectItem value="area3">Área 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Projetos"
          value={metricas.totalProjetos}
          description="Projetos ativos"
          icon={<FolderOpen className="h-5 w-5 text-pmo-primary" />}
          trend={{ value: 8, isPositive: true }}
        />
        
        <MetricCard
          title="Projetos Críticos"
          value={metricas.projetosCriticos}
          description="Status vermelho"
          icon={<AlertTriangle className="h-5 w-5 text-pmo-danger" />}
          className="border-pmo-danger/20"
        />
        
        <MetricCard
          title="Próximos Marcos"
          value={metricas.proximosMarcos.length}
          description="Próximos 15 dias"
          icon={<Clock className="h-5 w-5 text-pmo-warning" />}
        />
        
        <MetricCard
          title="Change Requests"
          value={metricas.mudancasAtivas}
          description="Pendentes análise"
          icon={<TrendingUp className="h-5 w-5 text-pmo-secondary" />}
        />
      </div>

      {/* Gráficos e próximos marcos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusChart 
          data={metricas.projetosPorStatus}
          title="Projetos por Status"
        />
        
        <StatusChart 
          data={metricas.projetosPorSaude}
          title="Saúde dos Projetos"
        />
        
        <ProximosMarcos marcos={metricas.proximosMarcos} />
      </div>

      {/* Distribuição por área */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-pmo-primary">
              Projetos por Área
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metricas.projetosPorArea).map(([area, quantidade]) => (
                <div key={area} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-pmo-primary">{area}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pmo-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(quantidade / metricas.totalProjetos) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-pmo-primary min-w-[2rem] text-right">
                      {quantidade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-pmo-primary flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Resumo Executivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-pmo-success/10 rounded-lg border border-pmo-success/20">
                <h4 className="font-medium text-pmo-success mb-2">✅ Pontos Positivos</h4>
                <ul className="text-sm text-pmo-gray space-y-1">
                  <li>• {metricas.totalProjetos - metricas.projetosCriticos} projetos com saúde boa</li>
                  <li>• {metricas.projetosPorSaude['Verde'] || 0} projetos no verde</li>
                  <li>• Cronogramas dentro do prazo</li>
                </ul>
              </div>
              
              <div className="p-4 bg-pmo-warning/10 rounded-lg border border-pmo-warning/20">
                <h4 className="font-medium text-pmo-warning mb-2">⚠️ Pontos de Atenção</h4>
                <ul className="text-sm text-pmo-gray space-y-1">
                  <li>• {metricas.projetosCriticos} projeto(s) crítico(s)</li>
                  <li>• {metricas.mudancasAtivas} mudança(s) pendente(s)</li>
                  <li>• {metricas.proximosMarcos.length} marco(s) próximo(s)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
