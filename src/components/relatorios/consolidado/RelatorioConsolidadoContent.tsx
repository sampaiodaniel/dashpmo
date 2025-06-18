
import { RelatorioHeader } from '../asa/RelatorioHeader';
import { ProjetosOverview } from '../asa/ProjetosOverview';
import { ProjetoDetalhes } from '../asa/ProjetoDetalhes';
import { RelatorioFooter } from '../asa/RelatorioFooter';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';

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

  // Criar objeto compatível com os componentes ASA
  const dadosASAFormat: DadosRelatorioASA = {
    carteira: dados.carteira || 'Consolidado',
    dataRelatorio: dados.dataGeracao.toLocaleDateString('pt-BR'),
    projetos: projetosComStatus,
    incidentes: dados.incidentes,
    resumoCarteira: `Relatório consolidado contendo ${projetosComStatus.length} projetos ativos`
  };

  return (
    <div className="space-y-8 bg-white p-8 min-h-screen">
      {/* Header do Relatório */}
      <RelatorioHeader dados={dadosASAFormat} />

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
      <RelatorioFooter dados={dadosASAFormat} />
    </div>
  );
}
