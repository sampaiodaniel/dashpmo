
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjetosOverviewProps {
  projetos: any[];
}

export function ProjetosOverview({ projetos }: ProjetosOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-[#10B981]';
      case 'Amarelo': return 'bg-[#F59E0B]';
      case 'Vermelho': return 'bg-[#EF4444]';
      default: return 'bg-[#6B7280]';
    }
  };

  // Filtrar apenas projetos com último status aprovado
  const projetosAtivos = projetos.filter(projeto => projeto.ultimoStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#1B365D] rounded"></div>
          Overview - Projetos Ativos ({projetosAtivos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projetosAtivos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#1B365D] font-semibold">Projeto</TableHead>
                <TableHead className="text-[#1B365D] font-semibold">Equipe/GP</TableHead>
                <TableHead className="text-[#1B365D] font-semibold text-center">Status</TableHead>
                <TableHead className="text-[#1B365D] font-semibold">Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projetosAtivos.map((projeto) => (
                <TableRow key={projeto.id}>
                  <TableCell className="font-medium text-[#1B365D]">
                    {projeto.nome_projeto}
                  </TableCell>
                  <TableCell className="text-[#6B7280]">
                    {projeto.gp_responsavel || projeto.equipe || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div className={`w-6 h-6 rounded-full ${getStatusColor(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}`}></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#1B365D] h-2 rounded-full" 
                          style={{ width: `${projeto.ultimoStatus?.progresso_estimado || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-[#6B7280]">{projeto.ultimoStatus?.progresso_estimado || 0}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-[#6B7280]">
            <p>Nenhum projeto ativo com status reportado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
