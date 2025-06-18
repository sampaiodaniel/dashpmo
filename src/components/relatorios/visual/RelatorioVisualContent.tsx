
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricasVisuais } from './MetricasVisuais';
import { TimelineEntregas } from './TimelineEntregas';
import { GraficosIndicadores } from './GraficosIndicadores';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

interface RelatorioVisualContentProps {
  dados: DadosRelatorioVisual;
}

export function RelatorioVisualContent({ dados }: RelatorioVisualContentProps) {
  const { carteira, responsavel, projetos, statusProjetos, incidentes, dataGeracao } = dados;

  return (
    <div className="space-y-6 p-6 bg-white">
      {/* Header do Relatório */}
      <div className="text-center space-y-4 border-b pb-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">
            Relatório Executivo Visual
          </h1>
          <h2 className="text-xl text-gray-600 mt-2">
            {carteira ? `Carteira: ${carteira}` : `Responsável: ${responsavel}`}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gerado em {dataGeracao.toLocaleDateString('pt-BR')} às {dataGeracao.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Métricas Visuais */}
      <MetricasVisuais 
        projetos={projetos}
        statusProjetos={statusProjetos}
        incidentes={incidentes}
      />

      {/* Gráficos de Indicadores */}
      <GraficosIndicadores 
        statusProjetos={statusProjetos}
        incidentes={incidentes}
      />

      {/* Timeline das Entregas */}
      <TimelineEntregas statusProjetos={statusProjetos} />

      {/* Detalhes dos Projetos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes dos Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projetos.map((projeto, index) => {
              const ultimoStatus = statusProjetos.find(s => s.projeto_id === projeto.id);
              
              return (
                <div key={projeto.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{projeto.nome_projeto}</h4>
                      <p className="text-sm text-gray-600">{projeto.descricao}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {ultimoStatus && (
                        <>
                          <Badge variant={
                            ultimoStatus.status_geral === 'Verde' ? 'default' :
                            ultimoStatus.status_geral === 'Amarelo' ? 'secondary' : 'destructive'
                          }>
                            {ultimoStatus.status_geral}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {ultimoStatus.progresso_estimado}% concluído
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Responsável ASA:</span>
                      <p>{projeto.responsavel_asa}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Responsável CWI:</span>
                      <p>{projeto.responsavel_cwi}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">GP Responsável:</span>
                      <p>{projeto.gp_responsavel_cwi}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Finalização:</span>
                      <p>{projeto.finalizacao_prevista ? 
                        new Date(projeto.finalizacao_prevista).toLocaleDateString('pt-BR') : 
                        'Não definida'
                      }</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t">
        <p>Relatório gerado automaticamente pelo Sistema PMO</p>
        <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
      </div>
    </div>
  );
}
