
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { useIncidentes } from '@/hooks/useIncidentes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TabelaIncidentesRecentes() {
  const { data: incidentes, isLoading, error } = useIncidentes();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros Mais Recentes por Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-pmo-gray">
            Carregando...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros Mais Recentes por Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-pmo-gray">
            <p className="text-lg mb-2">Erro ao carregar dados</p>
            <p className="text-sm">Tente recarregar a página</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!incidentes || incidentes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros Mais Recentes por Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-pmo-gray">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nenhum registro encontrado</p>
            <p className="text-sm">Crie o primeiro registro de incidentes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Registros Mais Recentes por Carteira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carteira</TableHead>
                <TableHead>Data Registro</TableHead>
                <TableHead className="text-center">Anterior</TableHead>
                <TableHead className="text-center">Entrada</TableHead>
                <TableHead className="text-center">Saída</TableHead>
                <TableHead className="text-center">Atual</TableHead>
                <TableHead className="text-center">+ 15 dias</TableHead>
                <TableHead className="text-center">Críticos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidentes.map((incidente) => (
                <TableRow key={`${incidente.carteira}-${incidente.id}`}>
                  <TableCell className="font-medium">{incidente.carteira}</TableCell>
                  <TableCell>
                    {incidente.data_registro 
                      ? format(new Date(incidente.data_registro), 'dd/MM/yyyy', { locale: ptBR })
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="text-center">{incidente.anterior || 0}</TableCell>
                  <TableCell className="text-center">{incidente.entrada || 0}</TableCell>
                  <TableCell className="text-center">{incidente.saida || 0}</TableCell>
                  <TableCell className="text-center">{incidente.atual || 0}</TableCell>
                  <TableCell className="text-center">{incidente.mais_15_dias || 0}</TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${
                      (incidente.criticos || 0) > 0 ? 'text-pmo-danger' : 'text-pmo-gray'
                    }`}>
                      {incidente.criticos || 0}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
