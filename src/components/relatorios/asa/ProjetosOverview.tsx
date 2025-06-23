import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { formatarData } from '@/utils/dateFormatting';

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

  const handleRowClick = (projetoId: number) => {
    const element = document.getElementById(`projeto-${projetoId}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtrar apenas projetos com último status aprovado
  const projetosAtivos = projetos.filter(projeto => projeto.ultimoStatus);

  // Agrupar projetos por Responsável ASA
  const projetosPorResponsavel = projetosAtivos.reduce((grupos, projeto) => {
    const responsavel = projeto.responsavel_asa || 'Não informado';
    if (!grupos[responsavel]) {
      grupos[responsavel] = [];
    }
    grupos[responsavel].push(projeto);
    return grupos;
  }, {} as Record<string, any[]>);

  // Ordenar projetos dentro de cada grupo alfabeticamente
  Object.keys(projetosPorResponsavel).forEach(responsavel => {
    projetosPorResponsavel[responsavel].sort((a, b) => {
      const nomeA = a.nome_projeto || '';
      const nomeB = b.nome_projeto || '';
      return nomeA.localeCompare(nomeB, 'pt-BR', { sensitivity: 'base' });
    });
  });

  // Ordenar responsáveis alfabeticamente
  const responsaveisOrdenados = Object.keys(projetosPorResponsavel).sort();

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
          <div className="space-y-8">
            {responsaveisOrdenados.map((responsavel) => (
              <div key={responsavel} className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E5E7EB]">
                  <h3 className="text-lg font-semibold text-[#1B365D]">
                    {responsavel} ({projetosPorResponsavel[responsavel].length} projetos)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F8FAFC]">
                        <TableHead className="text-[#1B365D] font-semibold w-[30%]">Projeto</TableHead>
                        <TableHead className="text-[#1B365D] font-semibold w-[25%]">Chefe do Projeto</TableHead>
                        <TableHead className="text-[#1B365D] font-semibold w-[20%]">Data Finalização</TableHead>
                        <TableHead className="text-[#1B365D] font-semibold text-center w-[10%]">Status</TableHead>
                        <TableHead className="text-[#1B365D] font-semibold w-[15%]">Progresso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projetosPorResponsavel[responsavel].map((projeto) => (
                        <TableRow 
                          key={projeto.id} 
                          className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                          onClick={() => handleRowClick(projeto.id)}
                        >
                          <TableCell className="font-medium text-[#1B365D] py-4">
                            {projeto.nome_projeto}
                          </TableCell>
                          <TableCell className="text-[#6B7280] py-4">
                            {projeto.gp_responsavel || projeto.equipe || 'Não informado'}
                          </TableCell>
                          <TableCell className="text-[#6B7280] py-4">
                            {formatarData(projeto.ultimoStatus?.finalizacao_prevista || projeto.finalizacao_prevista)}
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <div className="flex items-center justify-center">
                              <div className={`w-8 h-8 rounded-full ${getStatusColor(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}`}></div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-[#1B365D] h-3 rounded-full transition-all duration-300" 
                                  style={{ width: `${projeto.ultimoStatus?.progresso_estimado || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-[#1B365D] min-w-[45px]">
                                {projeto.ultimoStatus?.progresso_estimado || 0}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#6B7280]">
            <p>Nenhum projeto ativo com status reportado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
