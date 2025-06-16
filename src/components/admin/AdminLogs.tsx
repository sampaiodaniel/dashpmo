
import { useState } from 'react';
import { useLogsAlteracoes } from '@/hooks/useLogsAlteracoes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, FileText, User, Calendar, Monitor } from 'lucide-react';
import { LogAlteracao } from '@/types/admin';

export function AdminLogs() {
  const [filtroModulo, setFiltroModulo] = useState<string>('todos');
  const [filtroAcao, setFiltroAcao] = useState<string>('todas');
  const [busca, setBusca] = useState('');
  
  const { data: logs, isLoading, error } = useLogsAlteracoes();

  // Filtrar logs
  const logsFiltrados = logs?.filter(log => {
    const passaModulo = filtroModulo === 'todos' || log.modulo === filtroModulo;
    const passaAcao = filtroAcao === 'todas' || log.acao === filtroAcao;
    const passaBusca = !busca || 
      log.usuario_nome.toLowerCase().includes(busca.toLowerCase()) ||
      log.entidade_nome?.toLowerCase().includes(busca.toLowerCase());
    
    return passaModulo && passaAcao && passaBusca;
  }) || [];

  const getBadgeVariant = (acao: string) => {
    switch (acao) {
      case 'criacao':
        return 'default';
      case 'edicao':
        return 'secondary';
      case 'exclusao':
        return 'destructive';
      case 'aprovacao':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getModuloBadgeColor = (modulo: string) => {
    const colors: Record<string, string> = {
      'projetos': 'bg-blue-100 text-blue-700',
      'status': 'bg-green-100 text-green-700',
      'mudancas': 'bg-yellow-100 text-yellow-700',
      'licoes': 'bg-purple-100 text-purple-700',
      'incidentes': 'bg-red-100 text-red-700',
      'usuarios': 'bg-gray-100 text-gray-700',
      'configuracoes': 'bg-orange-100 text-orange-700'
    };
    return colors[modulo] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando logs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erro ao carregar logs: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Logs de Alterações</h2>
        <p className="text-sm text-gray-600 mt-1">
          Registro de todas as alterações realizadas no sistema para auditoria de segurança
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Usuário ou entidade..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Módulo</label>
              <Select value={filtroModulo} onValueChange={setFiltroModulo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Módulos</SelectItem>
                  <SelectItem value="projetos">Projetos</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="mudancas">Mudanças</SelectItem>
                  <SelectItem value="licoes">Lições</SelectItem>
                  <SelectItem value="incidentes">Incidentes</SelectItem>
                  <SelectItem value="usuarios">Usuários</SelectItem>
                  <SelectItem value="configuracoes">Configurações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ação</label>
              <Select value={filtroAcao} onValueChange={setFiltroAcao}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Ações</SelectItem>
                  <SelectItem value="criacao">Criação</SelectItem>
                  <SelectItem value="edicao">Edição</SelectItem>
                  <SelectItem value="exclusao">Exclusão</SelectItem>
                  <SelectItem value="aprovacao">Aprovação</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <strong>{logsFiltrados.length}</strong> registros encontrados
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Logs */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsFiltrados.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div>{log.data_criacao.toLocaleDateString('pt-BR')}</div>
                          <div className="text-xs text-gray-500">
                            {log.data_criacao.toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{log.usuario_nome}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getModuloBadgeColor(log.modulo)}>
                        {log.modulo}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={getBadgeVariant(log.acao)}>
                        {log.acao}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-48">
                        <div className="font-medium text-sm">{log.entidade_tipo}</div>
                        {log.entidade_nome && (
                          <div className="text-xs text-gray-500 truncate">
                            {log.entidade_nome}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {log.detalhes_alteracao && (
                          <FileText className="h-4 w-4 text-gray-400" />
                        )}
                        {log.user_agent && (
                          <Monitor className="h-4 w-4 text-gray-400" />
                        )}
                        {log.entidade_id && (
                          <span className="text-xs text-gray-500">ID: {log.entidade_id}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {logsFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum log encontrado para os filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
