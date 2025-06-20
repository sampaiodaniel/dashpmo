
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useIncidentesHistorico } from '@/hooks/useIncidentesHistorico';
import { formatarData } from '@/utils/dateFormatting';
import { EditarIncidenteModal } from './EditarIncidenteModal';
import { ExcluirIncidenteModal } from './ExcluirIncidenteModal';
import { IncidenteHistorico } from '@/hooks/useIncidentesHistorico';

export function IncidentesRegistrosList() {
  const { data: registros, isLoading } = useIncidentesHistorico();
  const [incidenteParaEditar, setIncidenteParaEditar] = useState<IncidenteHistorico | null>(null);
  const [incidenteParaExcluir, setIncidenteParaExcluir] = useState<IncidenteHistorico | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-pmo-gray">Carregando registros...</div>
        </CardContent>
      </Card>
    );
  }

  if (!registros || registros.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-pmo-gray">Nenhum registro encontrado</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Todos os Registros de Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Carteira</TableHead>
                <TableHead className="text-center">Anterior</TableHead>
                <TableHead className="text-center">Entrada</TableHead>
                <TableHead className="text-center">Saída</TableHead>
                <TableHead className="text-center">Atual</TableHead>
                <TableHead className="text-center">&gt; 15 dias</TableHead>
                <TableHead className="text-center">Críticos</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell className="font-medium">
                    {formatarData(registro.data_registro)}
                  </TableCell>
                  <TableCell className="font-medium text-pmo-primary">
                    {registro.carteira}
                  </TableCell>
                  <TableCell className="text-center text-pmo-gray">
                    {registro.anterior}
                  </TableCell>
                  <TableCell className="text-center text-green-600 font-medium">
                    +{registro.entrada}
                  </TableCell>
                  <TableCell className="text-center text-blue-600 font-medium">
                    -{registro.saida}
                  </TableCell>
                  <TableCell className="text-center font-bold text-pmo-primary">
                    {registro.atual}
                  </TableCell>
                  <TableCell className="text-center text-yellow-600 font-medium">
                    {registro.mais_15_dias}
                  </TableCell>
                  <TableCell className="text-center text-red-600 font-bold">
                    {registro.criticos}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIncidenteParaEditar(registro)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setIncidenteParaExcluir(registro)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {incidenteParaEditar && (
        <EditarIncidenteModal
          incidente={incidenteParaEditar}
          isOpen={!!incidenteParaEditar}
          onClose={() => setIncidenteParaEditar(null)}
        />
      )}

      {incidenteParaExcluir && (
        <ExcluirIncidenteModal
          incidente={incidenteParaExcluir}
          isOpen={!!incidenteParaExcluir}
          onClose={() => setIncidenteParaExcluir(null)}
        />
      )}
    </>
  );
}
