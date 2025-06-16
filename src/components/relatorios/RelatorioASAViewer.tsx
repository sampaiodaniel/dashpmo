
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Printer } from 'lucide-react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RelatorioASAViewerProps {
  isOpen: boolean;
  onClose: () => void;
  dados: DadosRelatorioASA | null;
}

export function RelatorioASAViewer({ isOpen, onClose, dados }: RelatorioASAViewerProps) {
  if (!dados) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    handlePrint();
  };

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
  const projetosAtivos = dados.projetos.filter(projeto => projeto.ultimoStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-pmo-primary">
              Relatório ASA - {dados.carteira}
            </DialogTitle>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 print:space-y-6" id="relatorio-content">
          {/* Header do Relatório */}
          <div className="text-center border-b pb-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img 
                src="/lovable-uploads/48bf655c-460e-490c-9118-e222b43f0c9d.png" 
                alt="DashPMO" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-pmo-primary">Status Report Gerencial</h1>
                <p className="text-pmo-gray">Carteira: {dados.carteira}</p>
                <p className="text-sm text-pmo-gray">Data: {dados.dataRelatorio}</p>
              </div>
            </div>
          </div>

          {/* Overview de Projetos Ativos */}
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

          {/* Detalhes dos Projetos */}
          {projetosAtivos.map((projeto) => (
            <Card key={`detail-${projeto.id}`} className="break-inside-avoid">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{projeto.nome_projeto}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}`}></div>
                    <Badge variant={getStatusBadgeVariant(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}>
                      {projeto.ultimoStatus?.status_visao_gp}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Descrição e Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-pmo-primary mb-2">Descrição do Projeto</h4>
                    <p className="text-sm text-gray-700">
                      {projeto.descricao_projeto || projeto.descricao || 'Descrição não informada'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pmo-primary mb-2">Informações</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>GP Responsável:</strong> {projeto.gp_responsavel}</p>
                      <p><strong>Responsável Interno:</strong> {projeto.responsavel_interno}</p>
                      <p><strong>Status Geral:</strong> {projeto.ultimoStatus?.status_geral}</p>
                      <p><strong>Progresso:</strong> {projeto.ultimoStatus?.progresso_estimado || 0}%</p>
                    </div>
                  </div>
                </div>

                {/* Marcos e Entregas */}
                {(projeto.ultimoStatus?.data_marco1 || projeto.ultimoStatus?.data_marco2 || projeto.ultimoStatus?.data_marco3) && (
                  <div>
                    <h4 className="font-semibold text-pmo-primary mb-3">Próximas Entregas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {projeto.ultimoStatus?.data_marco1 && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-1">
                            {projeto.ultimoStatus.entrega1 || 'Entrega 1'}
                          </h5>
                          <p className="text-sm text-blue-600 mb-2">
                            {new Date(projeto.ultimoStatus.data_marco1).toLocaleDateString('pt-BR')}
                          </p>
                          {projeto.ultimoStatus.entregaveis1 && (
                            <div className="text-xs text-blue-700">
                              {projeto.ultimoStatus.entregaveis1.split('\n').map((item, i) => (
                                <div key={i}>• {item}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {projeto.ultimoStatus?.data_marco2 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-1">
                            {projeto.ultimoStatus.entrega2 || 'Entrega 2'}
                          </h5>
                          <p className="text-sm text-green-600 mb-2">
                            {new Date(projeto.ultimoStatus.data_marco2).toLocaleDateString('pt-BR')}
                          </p>
                          {projeto.ultimoStatus.entregaveis2 && (
                            <div className="text-xs text-green-700">
                              {projeto.ultimoStatus.entregaveis2.split('\n').map((item, i) => (
                                <div key={i}>• {item}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {projeto.ultimoStatus?.data_marco3 && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <h5 className="font-medium text-purple-800 mb-1">
                            {projeto.ultimoStatus.entrega3 || 'Entrega 3'}
                          </h5>
                          <p className="text-sm text-purple-600 mb-2">
                            {new Date(projeto.ultimoStatus.data_marco3).toLocaleDateString('pt-BR')}
                          </p>
                          {projeto.ultimoStatus.entregaveis3 && (
                            <div className="text-xs text-purple-700">
                              {projeto.ultimoStatus.entregaveis3.split('\n').map((item, i) => (
                                <div key={i}>• {item}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Atividades e Atenções */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-pmo-primary mb-2">Itens Trabalhados na Semana</h4>
                    <div className="bg-gray-50 p-3 rounded-lg min-h-[100px]">
                      {projeto.ultimoStatus?.realizado_semana_atual ? (
                        projeto.ultimoStatus.realizado_semana_atual.split('\n').map((item, i) => (
                          <div key={i} className="text-sm mb-1">• {item}</div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Nenhum item informado</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pmo-primary mb-2">Pontos de Atenção</h4>
                    <div className="bg-yellow-50 p-3 rounded-lg min-h-[100px]">
                      {projeto.ultimoStatus?.observacoes_pontos_atencao ? (
                        projeto.ultimoStatus.observacoes_pontos_atencao.split('\n').map((item, i) => (
                          <div key={i} className="text-sm mb-1">• {item}</div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Nenhum ponto de atenção</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pmo-primary mb-2">Backlog</h4>
                    <div className="bg-blue-50 p-3 rounded-lg min-h-[100px]">
                      {projeto.ultimoStatus?.backlog ? (
                        projeto.ultimoStatus.backlog.split('\n').map((item, i) => (
                          <div key={i} className="text-sm mb-1">• {item}</div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Nenhum item no backlog</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bloqueios */}
                {projeto.ultimoStatus?.bloqueios_atuais && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Bloqueios Atuais</h4>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      {projeto.ultimoStatus.bloqueios_atuais.split('\n').map((item, i) => (
                        <div key={i} className="text-sm mb-1 text-red-700">⚠️ {item}</div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Tabela de Incidentes */}
          {dados.incidentes && dados.incidentes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  Controle de Incidentes - {dados.carteira}
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
                    {dados.incidentes.map((incidente, index) => (
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
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p>ASA Investments - Gestão de Projetos de TI</p>
                <p>Relatório gerado em {dados.dataRelatorio}</p>
              </div>
              <img 
                src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
                alt="ASA Logo" 
                className="h-8 w-auto opacity-50"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
