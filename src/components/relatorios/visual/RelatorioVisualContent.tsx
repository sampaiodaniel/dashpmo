import { MetricasVisuais } from './MetricasVisuais';
import { GraficosIndicadores } from './GraficosIndicadores';
import { TimelineEntregas } from './TimelineEntregas';
import { RelatorioFooter } from '../asa/RelatorioFooter';
import { RelatorioHeader } from '../asa/RelatorioHeader';
import { ProjetosOverview } from '../asa/ProjetosOverview';
import { TabelaIncidentes } from '../asa/TabelaIncidentes';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { formatarData } from '@/utils/dateFormatting';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date | string;
}

interface RelatorioVisualContentProps {
  dados: DadosRelatorioVisual;
}

export function RelatorioVisualContent({ dados }: RelatorioVisualContentProps) {
  // Garantir que dataGeracao seja um objeto Date válido
  const dataGeracao = dados.dataGeracao instanceof Date ? dados.dataGeracao : new Date(dados.dataGeracao);
  
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

  // Criar objeto compatível com header ASA
  const dadosASAFormat: DadosRelatorioASA = {
    carteira: dados.carteira || 'Visual',
    dataRelatorio: dataGeracao.toLocaleDateString('pt-BR'),
    projetos: projetosComStatus,
    incidentes: dados.incidentes,
    resumoCarteira: `Relatório visual executivo contendo ${projetosComStatus.length} projetos ativos`
  };

  return (
    <div className="space-y-8 bg-white w-full" id="relatorio-content" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header do Relatório ASA */}
      <div>
        <RelatorioHeader dados={dadosASAFormat} />
      </div>

      {/* Gráficos de Indicadores */}
      <div className="bg-white p-8 rounded-lg border-l-4 border-[#A6926B] w-full shadow-sm">
        <GraficosIndicadores projetos={projetosComStatus} incidentes={dados.incidentes} />
      </div>

      {/* Overview de Projetos por Responsável */}
      <div className="bg-white p-8 rounded-lg border-l-4 border-[#2E5984] w-full shadow-sm" data-overview>
        <ProjetosOverview projetos={projetosComStatus} />
      </div>

      {/* Detalhamento por Projeto */}
      <div className="space-y-6 w-full">
        <div className="bg-white p-8 rounded-lg border-l-4 border-[#1B365D] w-full shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B365D] border-b border-[#E5E7EB] pb-3 mb-6">
            Detalhamento por Projeto
          </h2>
        
          {(() => {
            // Agrupar projetos por Responsável ASA
            const projetosPorResponsavel = projetosComStatus.reduce((grupos, projeto) => {
              const responsavel = projeto.responsavel_asa || 'Não informado';
              if (!grupos[responsavel]) {
                grupos[responsavel] = [];
              }
              grupos[responsavel].push(projeto);
              return grupos;
            }, {} as Record<string, any[]>);

            // Ordenar projetos dentro de cada grupo por progresso decrescente
            Object.keys(projetosPorResponsavel).forEach(responsavel => {
              projetosPorResponsavel[responsavel].sort((a, b) => {
                const progressoA = a.ultimoStatus?.progresso_estimado || 0;
                const progressoB = b.ultimoStatus?.progresso_estimado || 0;
                return progressoB - progressoA;
              });
            });

            // Ordenar responsáveis alfabeticamente
            const responsaveisOrdenados = Object.keys(projetosPorResponsavel).sort();

            // Criar array linear mantendo a ordem do overview
            const projetosOrdenados = responsaveisOrdenados.flatMap(responsavel => 
              projetosPorResponsavel[responsavel]
            );

            return projetosOrdenados.map((projeto, index) => (
              <div key={projeto.id} id={`projeto-${projeto.id}`} className="space-y-4 mb-12 last:mb-0 border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                {/* Link para voltar ao overview */}
                <div className="flex justify-start mb-3 no-print">
                  <button
                    onClick={() => {
                      const element = document.querySelector('[data-overview]');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm text-[#1B365D] hover:text-[#2E5984] flex items-center gap-1"
                  >
                    ← Voltar ao Overview
                  </button>
                </div>
                
                {/* Título e informações do projeto */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-bold text-[#1B365D]">{projeto.nome_projeto || projeto.nome}</h3>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg ${
                        projeto.ultimoStatus?.status_visao_gp === 'Verde' ? 'bg-green-500' :
                        projeto.ultimoStatus?.status_visao_gp === 'Amarelo' ? 'bg-yellow-500' :
                        projeto.ultimoStatus?.status_visao_gp === 'Vermelho' ? 'bg-red-500' : 'bg-gray-400'
                      }`} title={`Status Visão GP: ${projeto.ultimoStatus?.status_visao_gp || 'Não informado'}`}></div>
                    </div>
                  </div>
                  
                  {(projeto.descricao_projeto || projeto.descricao) && (
                    <p className="text-base text-[#6B7280] leading-relaxed mb-4 text-left">{projeto.descricao_projeto || projeto.descricao}</p>
                  )}
                  
                  {/* Informações básicas */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-[#6B7280]">Responsável ASA:</span>
                        <div className="font-medium text-[#1B365D]">{projeto.responsavel_asa || 'Não informado'}</div>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Chefe do Projeto:</span>
                        <div className="font-medium text-[#1B365D]">{projeto.gp_responsavel || 'Não informado'}</div>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Status Geral:</span>
                        <div className="font-medium text-[#1B365D]">{projeto.ultimoStatus?.status_geral || 'Não informado'}</div>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Progresso:</span>
                        <div className="font-medium text-[#1B365D]">
                          {projeto.ultimoStatus?.progresso_estimado ? `${projeto.ultimoStatus.progresso_estimado}%` : 'Não informado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Realizado na semana */}
                {projeto.ultimoStatus?.realizado_semana_atual && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#1B365D] mb-3 text-base text-center">Realizado na Semana</h4>
                    <div className="space-y-2 text-left">
                      {projeto.ultimoStatus.realizado_semana_atual.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                        <div key={i} className="text-sm text-[#6B7280] leading-relaxed flex items-start">
                          <span className="font-medium text-[#1B365D] mr-2 mt-0.5 flex-shrink-0">•</span>
                          <span className="flex-1">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pontos de atenção, backlog e bloqueios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Pontos de Atenção */}
                  <div>
                    <h4 className="font-semibold text-[#1B365D] mb-3 text-base text-center">Pontos de Atenção</h4>
                    {projeto.ultimoStatus?.observacoes_pontos_atencao ? (
                      <div className="space-y-2 text-left">
                        {projeto.ultimoStatus.observacoes_pontos_atencao.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                          <div key={i} className="text-sm text-[#6B7280] leading-relaxed flex items-start">
                            <span className="font-medium text-[#F59E0B] mr-2 mt-0.5 flex-shrink-0">⚠️</span>
                            <span className="flex-1">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-[#6B7280] italic text-left">Nada reportado</div>
                    )}
                  </div>
                  
                  {/* Backlog */}
                  <div>
                    <h4 className="font-semibold text-[#1B365D] mb-3 text-base text-center">Backlog</h4>
                    {projeto.ultimoStatus?.backlog ? (
                      <div className="space-y-2 text-left">
                        {projeto.ultimoStatus.backlog.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                          <div key={i} className="text-sm text-[#6B7280] leading-relaxed flex items-start">
                            <span className="font-medium text-[#6B7280] mr-2 mt-0.5 flex-shrink-0">→</span>
                            <span className="flex-1">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-[#6B7280] italic text-left">Nada reportado</div>
                    )}
                  </div>

                  {/* Bloqueios */}
                  <div>
                    <h4 className="font-semibold text-[#1B365D] mb-3 text-base text-center">Bloqueios</h4>
                    {projeto.ultimoStatus?.bloqueios ? (
                      <div className="space-y-2 text-left">
                        {projeto.ultimoStatus.bloqueios.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                          <div key={i} className="text-sm text-[#6B7280] leading-relaxed flex items-start">
                            <span className="font-medium text-[#EF4444] mr-2 mt-0.5 flex-shrink-0">🚫</span>
                            <span className="flex-1">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-[#6B7280] italic text-left">Nada reportado</div>
                    )}
                  </div>
                </div>

                {/* Timeline de entregas do projeto específico */}
                <div className="mb-8">
                  <TimelineEntregas projetos={[projeto]} />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Tabela de Incidentes */}
      {dados.incidentes.length > 0 && (
        <div className="bg-white p-8 rounded-lg border-l-4 border-[#EF4444] w-full shadow-sm">
          <TabelaIncidentes incidentes={dados.incidentes} carteira={dados.carteira || 'Visual'} />
        </div>
      )}

      {/* Footer */}
      <div className="w-full">
        <RelatorioFooter dados={{
          dataGeracao: dataGeracao,
          carteira: dados.carteira,
          responsavel: dados.responsavel
        }} />
      </div>
    </div>
  );
}
