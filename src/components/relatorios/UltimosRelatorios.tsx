import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, TrendingUp, Eye, Trash2, History, Share, Copy, ExternalLink, Calendar, Shield, Clock } from 'lucide-react';
import { useHistoricoRelatorios, RelatorioHistorico } from '@/hooks/useHistoricoRelatorios';
import { useReportWebhook, RelatorioCompartilhavel } from '@/hooks/useReportWebhook';
import { formatarData } from '@/utils/dateFormatting';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export function UltimosRelatorios() {
  const { historico, removerRelatorio, limparHistorico } = useHistoricoRelatorios();
  const { 
    relatoriosCompartilhados, 
    listarRelatoriosCompartilhados, 
    excluirRelatorioCompartilhado, 
    copiarLink 
  } = useReportWebhook();
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState<'gerados' | 'compartilhados'>('gerados');

  useEffect(() => {
    if (usuario?.uuid) {
      listarRelatoriosCompartilhados(usuario.uuid);
    }
  }, [usuario?.uuid, listarRelatoriosCompartilhados]);

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case 'asa':
        return <FileText className="h-4 w-4" />;
      case 'visual':
        return <BarChart3 className="h-4 w-4" />;
      case 'consolidado':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'asa':
        return 'bg-blue-100 text-blue-800';
      case 'visual':
        return 'bg-green-100 text-green-800';
      case 'consolidado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calcularStatusExpiracao = (relatorio: RelatorioCompartilhavel) => {
    const agora = new Date();
    const expiraEm = new Date(relatorio.criadoEm);
    expiraEm.setDate(expiraEm.getDate() + relatorio.configuracao.expiraEm);
    
    if (agora > expiraEm) {
      return { status: 'expirado', texto: 'Expirado', cor: 'bg-red-100 text-red-700' };
    }
    
    const diasRestantes = Math.ceil((expiraEm.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes <= 3) {
      return { status: 'expirando', texto: `${diasRestantes}d restantes`, cor: 'bg-orange-100 text-orange-700' };
    }
    
    return { status: 'ativo', texto: `${diasRestantes} dias`, cor: 'bg-green-100 text-green-700' };
  };

  const handleVisualizarRelatorio = (relatorio: RelatorioHistorico) => {
    console.log('Visualizar relatório:', relatorio);
  };

  const handleExcluirRelatorioCompartilhado = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório compartilhado?') && usuario?.uuid) {
      await excluirRelatorioCompartilhado(id, usuario.uuid);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-pmo-primary">
            <History className="h-5 w-5" />
            Relatórios Recentes
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab('gerados')}
              size="sm"
              variant={activeTab === 'gerados' ? 'default' : 'outline'}
            >
              Gerados
            </Button>
            <Button
              onClick={() => setActiveTab('compartilhados')}
              size="sm"
              variant={activeTab === 'compartilhados' ? 'default' : 'outline'}
            >
              <Share className="h-4 w-4 mr-1" />
              Compartilhados
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeTab === 'gerados' ? (
          // Aba de relatórios gerados
          <>
            {historico.length === 0 ? (
              <div className="text-center py-6 text-pmo-gray">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum relatório gerado ainda</p>
                <p className="text-sm">Os relatórios gerados aparecerão aqui</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
          <Button
            onClick={limparHistorico}
            size="sm"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
        <div className="space-y-3">
          {historico.map((relatorio) => (
            <div
              key={relatorio.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-white rounded-lg">
                  {getIconePorTipo(relatorio.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getCorPorTipo(relatorio.tipo)}>
                      {relatorio.tipo.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">
                      {relatorio.filtro}: {relatorio.valor}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Gerado em {formatarData(relatorio.dataGeracao)} às{' '}
                    {relatorio.dataGeracao.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleVisualizarRelatorio(relatorio)}
                  size="sm"
                  variant="outline"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => removerRelatorio(relatorio.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
              </>
            )}
          </>
        ) : (
          // Aba de relatórios compartilhados
          <>
            {relatoriosCompartilhados.length === 0 ? (
              <div className="text-center py-6 text-pmo-gray">
                <Share className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum relatório compartilhado</p>
                <p className="text-sm">Crie links de compartilhamento usando os botões "Gerar Link"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {relatoriosCompartilhados.slice(0, 5).map((relatorio) => {
                  const statusExpiracao = calcularStatusExpiracao(relatorio);
                  
                  return (
                    <div
                      key={relatorio.id}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1 rounded ${getCorPorTipo(relatorio.tipo)}`}>
                              {getIconePorTipo(relatorio.tipo)}
                            </div>
                            <span className="font-medium text-sm">{relatorio.titulo}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {relatorio.tipo.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${statusExpiracao.cor}`}>
                              <Clock className="h-3 w-3 mr-1" />
                              {statusExpiracao.texto}
                            </Badge>
                            {relatorio.configuracao.protegidoPorSenha && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                <Shield className="h-3 w-3 mr-1" />
                                Protegido
                              </Badge>
                            )}
                          </div>

                          <div className="text-xs text-gray-500 mb-3">
                            {relatorio.metadados.carteira && `Carteira: ${relatorio.metadados.carteira} • `}
                            Criado {formatDistanceToNow(new Date(relatorio.criadoEm), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })} • {relatorio.acessos || 0} acessos
                          </div>

                          <div className="flex items-center gap-2">
                            <Input
                              value={relatorio.url}
                              readOnly
                              className="font-mono text-xs h-8 bg-gray-50"
                            />
                            <Button
                              onClick={() => copiarLink(relatorio)}
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-1 ml-4">
                          <Button
                            onClick={() => window.open(relatorio.url, '_blank')}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={statusExpiracao.status === 'expirado'}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => handleExcluirRelatorioCompartilhado(relatorio.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {relatoriosCompartilhados.length > 5 && (
                  <div className="text-center pt-4">
                    <Button
                      onClick={() => window.location.href = '/relatorios-compartilhados'}
                      variant="outline"
                      size="sm"
                    >
                      Ver todos ({relatoriosCompartilhados.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
