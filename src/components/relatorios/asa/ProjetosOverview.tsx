
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjetosOverviewProps {
  projetos: any[];
}

export function ProjetosOverview({ projetos }: ProjetosOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-green-500';
      case 'Amarelo': return 'bg-yellow-500';
      case 'Vermelho': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Verde': return 'default';
      case 'Amarelo': return 'secondary';
      case 'Vermelho': return 'destructive';
      default: return 'outline';
    }
  };

  // Filtrar apenas projetos com último status aprovado
  const projetosAtivos = projetos.filter(projeto => projeto.ultimoStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pmo-primary rounded"></div>
          Overview - Projetos Ativos ({projetosAtivos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projetosAtivos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Equipe/GP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projetosAtivos.map((projeto) => (
                <TableRow key={projeto.id}>
                  <TableCell className="font-medium">
                    {projeto.nome_projeto}
                  </TableCell>
                  <TableCell>
                    {projeto.gp_responsavel || projeto.equipe || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}`}></div>
                      <Badge variant={getStatusBadgeVariant(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}>
                        {projeto.ultimoStatus?.status_visao_gp || 'Sem status'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pmo-primary h-2 rounded-full" 
                          style={{ width: `${projeto.ultimoStatus?.progresso_estimado || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{projeto.ultimoStatus?.progresso_estimado || 0}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum projeto ativo com status reportado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
