// Versão para Impressão do Relatório Visual
// Copiada de RelatorioVisualContent.tsx mas utilizando TimelineEntregasImpressao para empilhar timelines

import { MetricasVisuais } from './MetricasVisuais';
import { GraficosIndicadores } from './GraficosIndicadores';
import { TimelineEntregasImpressao as TimelineEntregas } from './TimelineEntregasImpressao';
import { RelatorioFooter } from '../asa/RelatorioFooter';
import { RelatorioHeader } from '../asa/RelatorioHeader';
import { ProjetosOverview } from '../asa/ProjetosOverview';
import { TabelaIncidentes } from '../asa/TabelaIncidentes';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { formatarData } from '@/utils/dateFormatting';
import { Badge } from '@/components/ui/badge';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';

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

export function RelatorioVisualContentImpressao({ dados }: RelatorioVisualContentProps) {
  const dataGeracao = dados.dataGeracao instanceof Date ? dados.dataGeracao : new Date(dados.dataGeracao);

  const projetosComStatus = dados.projetos.map(projeto => {
    const statusAprovados = dados.statusProjetos.filter(status => status.projeto_id === projeto.id && status.aprovado);
    const ultimoStatus = statusAprovados.sort((a, b) => new Date(b.data_aprovacao || b.data_criacao).getTime() - new Date(a.data_aprovacao || a.data_criacao).getTime())[0];
    return { ...projeto, ultimoStatus };
  }).filter(p => p.ultimoStatus);

  const { data: tiposProjeto = [] } = useTiposProjeto();

  const dadosASAFormat: DadosRelatorioASA = {
    carteira: dados.carteira || 'Visual',
    dataRelatorio: dataGeracao.toLocaleDateString('pt-BR'),
    projetos: projetosComStatus,
    incidentes: dados.incidentes,
    resumoCarteira: `Relatório visual executivo contendo ${projetosComStatus.length} projetos ativos`
  };

  const getRiscoColor = (nivel: string) => {
    switch (nivel) {
      case 'Baixo': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Alto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 bg-white w-full" id="relatorio-content" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="bg-white p-6 rounded-lg shadow-md border-none" id="relatorio-header">
        <RelatorioHeader dados={dadosASAFormat} />
      </div>

      <div className="bg-white p-8 rounded-lg w-full shadow-md" id="indicadores-graficos">
        <div className="pb-4 mb-6">
          <h2 className="text-2xl font-bold text-[#1B365D]">Indicadores e Gráficos</h2>
        </div>
        <GraficosIndicadores projetos={projetosComStatus} incidentes={dados.incidentes} />
      </div>

      <div className="bg-white p-8 rounded-lg w-full shadow-md" data-overview id="overview-projetos">
        <div className="pb-4 mb-6">
          <h2 className="text-2xl font-bold text-[#1B365D]">Overview de Projetos</h2>
        </div>
        <ProjetosOverview projetos={projetosComStatus} />
      </div>

      <div className="space-y-6 w-full" id="detalhamento-projetos">
        <div className="bg-white p-8 rounded-lg w-full shadow-md">
          <div className="pb-4 mb-6">
            <h2 className="text-2xl font-bold text-[#1B365D]">Detalhamento por Projeto</h2>
          </div>
          {(() => {
            const projetosPorResp = projetosComStatus.reduce((acc: Record<string, any[]>, p) => {
              const resp = p.responsavel_asa || 'Não informado';
              if (!acc[resp]) acc[resp] = [];
              acc[resp].push(p);
              return acc;
            }, {});
            Object.keys(projetosPorResp).forEach(r => {
              projetosPorResp[r].sort((a, b) => (b.ultimoStatus?.progresso_estimado || 0) - (a.ultimoStatus?.progresso_estimado || 0));
            });
            const ordenados = Object.keys(projetosPorResp).sort().flatMap(r => projetosPorResp[r]);
            return ordenados.map((projeto) => (
              <div key={projeto.id} id={`projeto-${projeto.id}`} className="space-y-4 mb-12 last:mb-0 border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                <div className="flex justify-start mb-3 no-print">
                  <button onClick={() => { document.querySelector('[data-overview]')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm text-[#A6926B] hover:text-[#8B7355] flex items-center gap-1 font-medium">← Voltar ao Overview</button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-4">
                      <h3 className="text-3xl font-bold text-[#1B365D]">{projeto.nome_projeto || projeto.nome}</h3>
                      {(projeto.ultimoStatus?.finalizacao_prevista || projeto.data_fim || projeto.finalizacao_prevista) && (
                        <span className="text-sm text-[#6B7280] font-normal opacity-75 whitespace-nowrap">(Previsão de Finalização: {formatarData(projeto.ultimoStatus?.finalizacao_prevista || projeto.data_fim || projeto.finalizacao_prevista)})</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg ${
                        projeto.ultimoStatus?.status_visao_gp === 'Verde' ? 'bg-green-500' :
                        projeto.ultimoStatus?.status_visao_gp === 'Amarelo' ? 'bg-yellow-500' :
                        projeto.ultimoStatus?.status_visao_gp === 'Vermelho' ? 'bg-red-500' : 'bg-gray-400'
                      }`} title={`Status Visão GP: ${projeto.ultimoStatus?.status_visao_gp || 'Não informado'}`}></div>
                    </div>
                  </div>
                  {(projeto.descricao_projeto || projeto.descricao) && <p className="text-base text-[#6B7280] leading-relaxed mb-4 text-left">{projeto.descricao_projeto || projeto.descricao}</p>}
                  <div className="bg-gray-50 p-4 rounded-lg border border-[#A6926B] border-opacity-30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-[#6B7280] font-medium">Responsável ASA:</span><div className="font-semibold text-[#1B365D]">{projeto.responsavel_asa || 'Não informado'}</div></div>
                      <div><span className="text-[#6B7280] font-medium">Chefe do Projeto:</span><div className="font-semibold text-[#1B365D]">{projeto.gp_responsavel || 'Não informado'}</div></div>
                      <div><span className="text-[#6B7280] font-medium">Status Geral:</span><div className="font-semibold text-[#1B365D]">{projeto.ultimoStatus?.status_geral || 'Não informado'}</div></div>
                      <div><span className="text-[#6B7280] font-medium">Progresso:</span><div className="font-semibold text-[#1B365D]">{projeto.ultimoStatus?.progresso_estimado ? `${projeto.ultimoStatus.progresso_estimado}%` : 'Não informado'}</div></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                      <div className="md:col-span-2 col-span-2"><span className="text-[#6B7280] font-medium">Equipe:</span><div className="font-semibold text-[#1B365D]">{projeto.equipe || 'Não informado'}</div></div>
                      <div><span className="text-[#6B7280] font-medium">Matriz de Risco:</span><div className="mt-0.5"><Badge className={`text-xs ${getRiscoColor(projeto.ultimoStatus?.prob_x_impact)}`}>{projeto.ultimoStatus?.prob_x_impact || '-'}</Badge></div></div>
                      <div><span className="text-[#6B7280] font-medium">Tipo:</span><div className="font-semibold text-[#1B365D]">{(() => {
                        const tipo = tiposProjeto.find(t => t.id === projeto.tipo_projeto_id);
                        return tipo?.nome || 'Não informado';
                      })()}</div></div>
                    </div>
                  </div>
                </div>

                <div className="mb-8" id={`timeline-${projeto.id}`} data-projeto-id={projeto.id}>
                  <TimelineEntregas projetos={[projeto]} />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {dados.incidentes.length > 0 && (
        <div className="bg-white p-8 rounded-lg w-full shadow-md" id="controle-incidentes">
          <div className="pb-4 mb-6">
            <h2 className="text-2xl font-bold text-[#1B365D]">Controle de Incidentes</h2>
          </div>
          <TabelaIncidentes incidentes={dados.incidentes} carteira={dados.carteira || 'Visual'} />
        </div>
      )}

      <div className="w-full" id="relatorio-footer">
        <RelatorioFooter dados={{ dataGeracao, carteira: dados.carteira, responsavel: dados.responsavel }} />
      </div>
    </div>
  );
} 