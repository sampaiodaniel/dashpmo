
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EntregasEmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-gray-500">Nenhuma entrega cadastrada para este status.</p>
      </CardContent>
    </Card>
  );
}
