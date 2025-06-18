
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, RefreshCw, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  module: string;
  message: string;
  details?: any;
}

export function LogsViewer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data para demonstração
  const mockLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: new Date(),
      level: 'info',
      module: 'auth',
      message: 'Usuário logado com sucesso',
      details: { userId: 1, email: 'admin@exemplo.com' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000),
      level: 'warning',
      module: 'projects',
      message: 'Projeto sem status há mais de 7 dias',
      details: { projectId: 123 }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000),
      level: 'error',
      module: 'database',
      message: 'Erro ao conectar com banco de dados',
      details: { error: 'Connection timeout' }
    }
  ];

  const getLevelBadge = (level: string) => {
    const variants = {
      info: 'default',
      warning: 'secondary',
      error: 'destructive',
      debug: 'outline'
    } as const;

    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      debug: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'outline'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Logs atualizados",
        description: "Os logs foram recarregados com sucesso",
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: "Exportando logs",
      description: "O arquivo de logs será baixado em breve",
    });
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Visualizador de Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-pmo-gray" />
              <Input
                placeholder="Buscar nos logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>

        <ScrollArea className="h-96 border rounded-md p-4">
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border-b pb-2 last:border-b-0">
                <div className="flex items-center gap-2 mb-1">
                  {getLevelBadge(log.level)}
                  <span className="text-sm text-pmo-gray">
                    {log.timestamp.toLocaleString('pt-BR')}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {log.module}
                  </Badge>
                </div>
                <p className="text-sm">{log.message}</p>
                {log.details && (
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-pmo-gray">
                Nenhum log encontrado
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
