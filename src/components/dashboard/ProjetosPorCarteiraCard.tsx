
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { DashboardMetricas } from '@/types/pmo';

interface ProjetosPorCarteiraCardProps {
  metricas: DashboardMetricas;
}

export function ProjetosPorCarteiraCard({ metricas }: ProjetosPorCarteiraCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Projetos por Carteira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(metricas.projetosPorArea).map(([area, quantidade]) => (
            <div key={area} className="flex justify-between items-center">
              <span className="text-sm font-medium">{area}</span>
              <span className="text-2xl font-bold text-pmo-primary">{quantidade}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
