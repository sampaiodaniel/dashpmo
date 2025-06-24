import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Share, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Eye, 
  Shield, 
  Clock,
  FileText,
  BarChart3,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { useReportWebhook, RelatorioCompartilhavel } from '@/hooks/useReportWebhook';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function RelatoriosCompartilhados() {
  const { usuario, isLoading } = useAuth();
  const { 
    relatoriosCompartilhados, 
    listarRelatoriosCompartilhados, 
    excluirRelatorioCompartilhado, 
    copiarLink 
  } = useReportWebhook();

  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (usuario) {
      listarRelatoriosCompartilhados();
    }
  }, [usuario, listarRelatoriosCompartilhados]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img 
              src="/lovable-uploads/DashPMO_Icon_recortado.png" 
              alt="DashPMO" 
              className="w-12 h-12" 
            />
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  // Filtrar relatórios
  const relatoriosFiltrados = relatoriosCompartilhados.filter(relatorio => {
    const matchTipo = filtroTipo === 'todos' || relatorio.tipo === filtroTipo;
    const matchBusca = busca === '' || 
      relatorio.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      relatorio.metadados.carteira?.toLowerCase().includes(busca.toLowerCase()) ||
      relatorio.metadados.responsavel?.toLowerCase().includes(busca.toLowerCase());

    const agora = new Date();
    const expiraEm = new Date(relatorio.criadoEm);
    expiraEm.setDate(expiraEm.getDate() + relatorio.configuracao.expiraEm);
    const expirado = agora > expiraEm;

    const matchStatus = filtroStatus === 'todos' || 
      (filtroStatus === 'ativo' && !expirado) ||
      (filtroStatus === 'expirado' && expirado) ||
      (filtroStatus === 'protegido' && relatorio.configuracao.protegidoPorSenha);

    return matchTipo && matchBusca && matchStatus;
  });

  const handleExcluirRelatorio = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório compartilhado?')) {
      await excluirRelatorioCompartilhado(id);
    }
  };

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case 'asa': return FileText;
      case 'visual': return BarChart3;
      case 'consolidado': return TrendingUp;
      default: return FileText;
    }
  };

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'asa': return 'bg-blue-100 text-blue-700';
      case 'visual': return 'bg-green-100 text-green-700';
      case 'consolidado': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-pmo-primary">Relatórios Compartilhados</h1>
          <p className="text-pmo-gray mt-2">Gerencie seus links de compartilhamento de relatórios</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-pmo-gray mb-2 block">
                <Search className="h-4 w-4 inline mr-1" />
                Buscar
              </label>
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Título, carteira ou responsável..."
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-pmo-gray mb-2 block">
                <Filter className="h-4 w-4 inline mr-1" />
                Tipo
              </label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="asa">ASA</SelectItem>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="consolidado">Consolidado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-pmo-gray mb-2 block">
                <Clock className="h-4 w-4 inline mr-1" />
                Status
              </label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="expirado">Expirados</SelectItem>
                  <SelectItem value="protegido">Protegidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setBusca('');
                  setFiltroTipo('todos');
                  setFiltroStatus('todos');
                }}
                variant="outline"
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{relatoriosCompartilhados.length}</p>
                </div>
                <Share className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {relatoriosCompartilhados.filter(r => {
                      const agora = new Date();
                      const expiraEm = new Date(r.criadoEm);
                      expiraEm.setDate(expiraEm.getDate() + r.configuracao.expiraEm);
                      return agora <= expiraEm;
                    }).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Protegidos</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {relatoriosCompartilhados.filter(r => r.configuracao.protegidoPorSenha).length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Acessos</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {relatoriosCompartilhados.reduce((total, r) => total + (r.acessos || 0), 0)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de relatórios */}
        <div className="space-y-4">
          {relatoriosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Share className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {relatoriosCompartilhados.length === 0 
                    ? 'Nenhum relatório compartilhado'
                    : 'Nenhum relatório encontrado'
                  }
                </h3>
                <p className="text-gray-500 mb-4">
                  {relatoriosCompartilhados.length === 0 
                    ? 'Crie seus primeiros links de compartilhamento na página de relatórios.'
                    : 'Tente ajustar os filtros para encontrar o que está procurando.'
                  }
                </p>
                <Button 
                  onClick={() => window.location.href = '/relatorios'}
                  className="bg-pmo-primary hover:bg-pmo-secondary"
                >
                  Ir para Relatórios
                </Button>
              </CardContent>
            </Card>
          ) : (
            relatoriosFiltrados.map((relatorio) => {
              const IconeTipo = getIconePorTipo(relatorio.tipo);
              const statusExpiracao = calcularStatusExpiracao(relatorio);
              
              return (
                <Card key={relatorio.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${getCorPorTipo(relatorio.tipo)}`}>
                            <IconeTipo className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {relatorio.titulo}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize">
                                {relatorio.tipo === 'asa' ? 'ASA' : relatorio.tipo}
                              </Badge>
                              <Badge variant="outline" className={statusExpiracao.cor}>
                                <Calendar className="h-3 w-3 mr-1" />
                                {statusExpiracao.texto}
                              </Badge>
                              {relatorio.configuracao.protegidoPorSenha && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Protegido
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Informações do relatório */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          {relatorio.metadados.carteira && (
                            <div>
                              <span className="font-medium">Carteira:</span>
                              <div>{relatorio.metadados.carteira}</div>
                            </div>
                          )}
                          {relatorio.metadados.responsavel && (
                            <div>
                              <span className="font-medium">Responsável:</span>
                              <div>{relatorio.metadados.responsavel}</div>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Criado:</span>
                            <div>{formatDistanceToNow(new Date(relatorio.criadoEm), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}</div>
                          </div>
                          <div>
                            <span className="font-medium">Acessos:</span>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {relatorio.acessos || 0}
                            </div>
                          </div>
                        </div>

                        {/* Descrição */}
                        {relatorio.configuracao?.descricao && (
                          <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded border-l-4 border-blue-200">
                            {relatorio.configuracao.descricao}
                          </p>
                        )}

                        {/* URL */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Input
                              value={relatorio.url}
                              readOnly
                              className="font-mono text-sm bg-white"
                            />
                            <Button
                              onClick={() => copiarLink(relatorio)}
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => window.open(relatorio.url, '_blank')}
                          variant="outline"
                          size="sm"
                          disabled={statusExpiracao.status === 'expirado'}
                        >
                          <ExternalLink className="h-4 w-4" />
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
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
} 