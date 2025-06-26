
import { useState, useEffect } from 'react';
import { useReportWebhook } from '@/hooks/useReportWebhook';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Share, Copy, ExternalLink, Trash2, Clock, Shield, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function RelatoriosCompartilhados() {
  const { usuario } = useAuth();
  const { 
    relatoriosCompartilhados, 
    listarRelatoriosCompartilhados, 
    excluirRelatorioCompartilhado, 
    copiarLink,
    loading 
  } = useReportWebhook();

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

  const calcularStatusExpiracao = (relatorio: any) => {
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

  const handleExcluirRelatorio = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório compartilhado?') && usuario?.uuid) {
      await excluirRelatorioCompartilhado(id, usuario.uuid);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando relatórios...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B365D] mb-2">
          Relatórios Compartilhados
        </h1>
        <p className="text-gray-600">
          Gerencie seus relatórios compartilhados e links de acesso
        </p>
      </div>

      {relatoriosCompartilhados.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Share className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum relatório compartilhado
            </h3>
            <p className="text-gray-500 mb-6">
              Você ainda não criou nenhum link de compartilhamento de relatórios.
            </p>
            <Button onClick={() => window.history.back()}>
              Voltar aos Relatórios
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {relatoriosCompartilhados.map((relatorio) => {
            const statusExpiracao = calcularStatusExpiracao(relatorio);
            
            return (
              <Card key={relatorio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded ${getCorPorTipo(relatorio.tipo)}`}>
                          {getIconePorTipo(relatorio.tipo)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{relatorio.titulo}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-1">
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
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.open(relatorio.url, '_blank')}
                        variant="outline"
                        size="sm"
                        disabled={statusExpiracao.status === 'expirado'}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir
                      </Button>
                      <Button
                        onClick={() => handleExcluirRelatorio(relatorio.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Informações</div>
                      <div className="space-y-1 text-sm">
                        {relatorio.metadados.carteira && (
                          <div>
                            <span className="font-medium">Carteira:</span> {relatorio.metadados.carteira}
                          </div>
                        )}
                        {relatorio.metadados.responsavel && (
                          <div>
                            <span className="font-medium">Responsável:</span> {relatorio.metadados.responsavel}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Tamanho:</span> {relatorio.metadados.tamanhoMB} MB
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Estatísticas</div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium">Criado:</span>{' '}
                          {formatDistanceToNow(new Date(relatorio.criadoEm), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                        <div>
                          <span className="font-medium">Acessos:</span> {relatorio.acessos || 0}
                        </div>
                        {relatorio.ultimoAcesso && (
                          <div>
                            <span className="font-medium">Último acesso:</span>{' '}
                            {formatDistanceToNow(new Date(relatorio.ultimoAcesso), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Link de compartilhamento</div>
                    <div className="flex gap-2">
                      <Input
                        value={relatorio.url}
                        readOnly
                        className="font-mono text-sm bg-gray-50"
                      />
                      <Button
                        onClick={() => copiarLink(relatorio)}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
