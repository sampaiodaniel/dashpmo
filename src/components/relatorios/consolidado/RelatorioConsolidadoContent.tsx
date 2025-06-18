
import { MetricasVisuais } from '../visual/MetricasVisuais';
import { GraficosIndicadores } from '../visual/GraficosIndicadores';
import { ProjetosOverview } from '../asa/ProjetosOverview';
import { ProjetoDetalhes } from '../asa/ProjetoDetalhes';

interface DadosRelatorioConsolidado {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

interface RelatorioConsolidadoContentProps {
  dados: DadosRelatorioConsolidado;
}

export function RelatorioConsolidadoContent({ dados }: RelatorioConsolidadoContentProps) {
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
    <div className="space-y-8 bg-white p-8 min-h-screen">
      {/* Header do Relatório */}
      <div className="text-center border-b-2 border-[#1B365D] pb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[#1B365D] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1B365D]">
              Relatório Consolidado
            </h1>
            <p className="text-[#6B7280]">
              {dados.carteira ? `Carteira: ${dados.carteira}` : `Responsável: ${dados.responsavel}`}
            </p>
          </div>
        </div>
        <p className="text-sm text-[#6B7280]">
          Gerado em: {dados.dataGeracao.toLocaleDateString('pt-BR')} às {dados.dataGeracao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Overview dos Projetos */}
      <ProjetosOverview projetos={projetosComStatus} />

      {/* Detalhes por Projeto */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#1B365D] border-b border-[#E5E7EB] pb-2">
          Detalhamento por Projeto
        </h2>
        
        {projetosComStatus.map((projeto) => (
          <ProjetoDetalhes key={projeto.id} projeto={projeto} />
        ))}
      </div>

      {/* Footer */}
      <div className="text-center border-t border-[#E5E7EB] pt-6 text-sm text-[#6B7280]">
        <p>PMO - Sistema de Gestão de Projetos</p>
        <p>Relatório consolidado gerado automaticamente em {dados.dataGeracao.toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
}
