import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraficoEvolutivoIncidentesRelatorio } from './GraficoEvolutivoIncidentesRelatorio';

interface TabelaIncidentesProps {
  incidentes: any[];
  carteira: string;
}

export function TabelaIncidentes({ incidentes, carteira }: TabelaIncidentesProps) {
  // Filtrar apenas o registro mais recente da carteira específica
  const incidenteAtual = incidentes.filter(inc => inc.carteira === carteira)
    .sort((a, b) => new Date(b.data_registro || '').getTime() - new Date(a.data_registro || '').getTime())[0];
  
  const incidentesParaExibir = incidenteAtual ? [incidenteAtual] : [];

  if (!incidentesParaExibir || incidentesParaExibir.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#EF4444] rounded"></div>
              Controle de Incidentes - {carteira}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-[#6B7280]">Nenhum incidente registrado</p>
          </CardContent>
        </Card>
        
        <GraficoEvolutivoIncidentesRelatorio carteira={carteira} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#EF4444] rounded"></div>
            Controle de Incidentes - {carteira}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#1B365D] font-semibold">Carteira</TableHead>
                <TableHead className="text-[#1B365D] font-semibold">Estoque Anterior</TableHead>
                <TableHead className="text-[#1B365D] font-semibold">Entrada</TableHead>
                <TableHead className="text-[#1B365D] font-semibold">Saída</TableHead>
                <TableHead className="text-[#1B365D] font-semibold">Estoque Atual</TableHead>
                <TableHead className="text-[#1B365D] font-semibold">&gt; 15 dias</TableHead>
                <TableHead className="text-[#1B365D] font-semibold">Críticos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidentesParaExibir.map((incidente, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-[#1B365D]">{incidente.carteira}</TableCell>
                  <TableCell className="text-center text-[#6B7280]">{incidente.anterior}</TableCell>
                  <TableCell className="text-center text-[#10B981] font-medium">+{incidente.entrada}</TableCell>
                  <TableCell className="text-center text-[#2E5984] font-medium">-{incidente.saida}</TableCell>
                  <TableCell className="text-center font-bold text-[#1B365D]">{incidente.atual}</TableCell>
                  <TableCell className="text-center text-[#F59E0B] font-medium">{incidente.mais_15_dias}</TableCell>
                  <TableCell className="text-center text-[#EF4444] font-bold">{incidente.criticos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <GraficoEvolutivoIncidentesRelatorio carteira={carteira} />
    </div>
  );
}
