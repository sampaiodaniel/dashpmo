import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, TrendingUp, Eye, Trash2, History } from 'lucide-react';
import { useHistoricoRelatorios, RelatorioHistorico } from '@/hooks/useHistoricoRelatorios';
import { formatarData } from '@/utils/dateFormatting';

export function UltimosRelatorios() {
  const { historico, removerRelatorio, limparHistorico } = useHistoricoRelatorios();

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

  const handleVisualizarRelatorio = (relatorio: RelatorioHistorico) => {
    // Aqui você pode implementar a lógica para reabrir o relatório
    console.log('Visualizar relatório:', relatorio);
  };

  if (historico.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-pmo-primary">
            <History className="h-5 w-5" />
            Últimos Relatórios Gerados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-pmo-gray">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum relatório gerado ainda</p>
            <p className="text-sm">Os relatórios gerados aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-pmo-primary">
            <History className="h-5 w-5" />
            Últimos Relatórios Gerados
          </CardTitle>
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
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
} 