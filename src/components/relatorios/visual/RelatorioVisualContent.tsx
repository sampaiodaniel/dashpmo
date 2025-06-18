
import { MetricasVisuais } from './MetricasVisuais';
import { GraficosIndicadores } from './GraficosIndicadores';
import { TimelineEntregas } from './TimelineEntregas';

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
  // Filtrar projetos com último status aprovado
  const projetosComStatus = dados.projetos.map(projeto => {
    const statusAprovados = dados.statusProjetos.filter(status => 
      status.projeto_id === projeto.id && status.aprovado
    );
    
    const ultimoStatus = statusAprovados.sort((a, b) => 
      new Date(b.data_aprovacao || b.data_criacao).getTime() - 
      new Date(a.data_aprovacao || a.data_criacao).getTime()
    )[0];

    return {
      ...projeto,
      ultimoStatus
    };
  }).filter(projeto => projeto.ultimoStatus);

  return (
    <div className="space-y-8 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-6">
      {/* Header do Relatório */}
      <div className="text-center border-b border-[#E5E7EB] pb-6">
        <h1 className="text-3xl font-bold text-[#1B365D] mb-2">
          Relatório Visual Executivo
        </h1>
        <p className="text-[#6B7280]">
          {dados.carteira ? `Carteira: ${dados.carteira}` : `Responsável: ${dados.responsavel}`}
        </p>
        <p className="text-sm text-[#6B7280]">
          Gerado em: {dados.dataGeracao.toLocaleDateString('pt-BR')} às {dados.dataGeracao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Métricas Visuais */}
      <MetricasVisuais projetos={projetosComStatus} />

      {/* Gráficos de Indicadores */}
      <GraficosIndicadores projetos={projetosComStatus} incidentes={dados.incidentes} />

      {/* Detalhamento por Projeto */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#1B365D] border-b border-[#E5E7EB] pb-2">
          Detalhamento por Projeto
        </h2>
        
        {projetosComStatus.map((projeto) => (
          <div key={projeto.id} className="space-y-4">
            {/* Informações básicas do projeto */}
            <div className="bg-white p-6 rounded-xl border-l-4 border-[#1B365D]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1B365D] mb-2">{projeto.nome_projeto}</h3>
                  {projeto.descricao_projeto && (
                    <p className="text-[#6B7280] mb-4">{projeto.descricao_projeto}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-[#6B7280]">Responsável ASA:</span>
                      <div className="font-medium text-[#1B365D]">{projeto.responsavel_asa || 'Não informado'}</div>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Chefe do Projeto:</span>
                      <div className="font-medium text-[#1B365D]">{projeto.gp_responsavel}</div>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Status Geral:</span>
                      <div className="font-medium text-[#1B365D]">{projeto.ultimoStatus?.status_geral}</div>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Situação:</span>
                      <div className={`inline-flex w-6 h-6 rounded-full ${
                        projeto.ultimoStatus?.status_visao_gp === 'Verde' ? 'bg-green-500' :
                        projeto.ultimoStatus?.status_visao_gp === 'Amarelo' ? 'bg-yellow-500' :
                        projeto.ultimoStatus?.status_visao_gp === 'Vermelho' ? 'bg-red-500' : 'bg-gray-400'
                      }`} title={`Status: ${projeto.ultimoStatus?.status_visao_gp}`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Realizado na semana com quebra de linhas e bullets */}
              {projeto.ultimoStatus?.realizado_semana_atual && (
                <div className="mb-4">
                  <h4 className="font-semibold text-[#1B365D] mb-2">Realizado na Semana</h4>
                  <div className="space-y-1">
                    {projeto.ultimoStatus.realizado_semana_atual.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                      <div key={i} className="text-sm text-[#6B7280] leading-tight flex items-start">
                        <span className="font-medium text-[#1B365D] mr-2 mt-1 flex-shrink-0">•</span>
                        <span className="flex-1">{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pontos de atenção e backlog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projeto.ultimoStatus?.observacoes_pontos_atencao && (
                  <div>
                    <h4 className="font-semibold text-[#1B365D] mb-2">Pontos de Atenção</h4>
                    <div className="space-y-1">
                      {projeto.ultimoStatus.observacoes_pontos_atencao.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                        <div key={i} className="text-sm text-[#6B7280] leading-tight flex items-start">
                          <span className="font-medium text-[#F59E0B] mr-2 mt-1 flex-shrink-0">⚠️</span>
                          <span className="flex-1">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {projeto.ultimoStatus?.backlog && (
                  <div>
                    <h4 className="font-semibold text-[#1B365D] mb-2">Backlog</h4>
                    <div className="space-y-1">
                      {projeto.ultimoStatus.backlog.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                        <div key={i} className="text-sm text-[#6B7280] leading-tight flex items-start">
                          <span className="font-medium text-[#6B7280] mr-2 mt-1 flex-shrink-0">→</span>
                          <span className="flex-1">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline de entregas do projeto específico */}
            <TimelineEntregas projetos={[projeto]} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center border-t border-[#E5E7EB] pt-6 text-sm text-[#6B7280]">
        <p>PMO - Sistema de Gestão de Projetos</p>
        <p>Relatório gerado automaticamente em {dados.dataGeracao.toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
}
