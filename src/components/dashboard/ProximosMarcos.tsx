
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Marco {
  projeto: string;
  marco: string;
  data: Date;
  diasRestantes: number;
}

interface ProximosMarcosProps {
  marcos: Marco[];
}

export function ProximosMarcos({ marcos }: ProximosMarcosProps) {
  const getUrgencyColor = (dias: number) => {
    if (dias <= 3) return 'bg-pmo-danger text-white';
    if (dias <= 7) return 'bg-pmo-warning text-white';
    return 'bg-pmo-success text-white';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-pmo-primary flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximos Marcos (15 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {marcos.length === 0 ? (
          <div className="text-center py-8 text-pmo-gray">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum marco nos próximos 15 dias</p>
          </div>
        ) : (
          <div className="space-y-4">
            {marcos.map((marco, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-pmo-background rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-pmo-primary truncate">
                    {marco.projeto}
                  </h4>
                  <p className="text-sm text-pmo-gray">{marco.marco}</p>
                  <p className="text-xs text-pmo-gray">
                    {format(marco.data, "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <Badge className={getUrgencyColor(marco.diasRestantes)}>
                  {marco.diasRestantes === 1 ? '1 dia' : `${marco.diasRestantes} dias`}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
