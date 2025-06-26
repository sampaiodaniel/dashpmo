
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusProjeto } from '@/types/pmo';
import { useEntregasStatus } from '@/hooks/useEntregasStatus';
import { EntregaCard } from './EntregaCard';
import { EntregasEmptyState } from './EntregasEmptyState';

interface ProximasEntregasSectionProps {
  status: StatusProjeto;
}

export function ProximasEntregasSection({ status }: ProximasEntregasSectionProps) {
  const { data: entregas = [] } = useEntregasStatus(status);

  if (entregas.length === 0) {
    return <EntregasEmptyState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Próximas Entregas ({entregas.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-left">
        {entregas.map((entrega) => (
          <EntregaCard key={entrega.id} entrega={entrega} />
        ))}
      </CardContent>
    </Card>
  );
}
