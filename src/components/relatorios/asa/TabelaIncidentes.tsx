
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TabelaIncidentesProps {
  incidentes: any[];
  carteira: string;
}

export function TabelaIncidentes({ incidentes, carteira }: TabelaIncidentesProps) {
  if (!incidentes || incidentes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          Controle de Incidentes - {carteira}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Carteira</TableHead>
              <TableHead>Estoque Anterior</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Saída</TableHead>
              <TableHead>Estoque Atual</TableHead>
              <TableHead>&gt; 15 dias</TableHead>
              <TableHead>Críticos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidentes.map((incidente, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{incidente.carteira}</TableCell>
                <TableCell className="text-center">{incidente.anterior}</TableCell>
                <TableCell className="text-center text-green-600">+{incidente.entrada}</TableCell>
                <TableCell className="text-center text-blue-600">-{incidente.saida}</TableCell>
                <TableCell className="text-center font-bold">{incidente.atual}</TableCell>
                <TableCell className="text-center text-orange-600">{incidente.mais_15_dias}</TableCell>
                <TableCell className="text-center text-red-600 font-bold">{incidente.criticos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
