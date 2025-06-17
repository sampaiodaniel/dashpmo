
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { RelatorioHeader } from './RelatorioHeader';
import { RelatorioFooter } from './RelatorioFooter';
import { GraficoStatusProjeto } from './GraficoStatusProjeto';
import { ProjetosOverview } from './ProjetosOverview';
import { ProjetoDetalhes } from './ProjetoDetalhes';
import { TabelaIncidentes } from './TabelaIncidentes';

interface RelatorioContentProps {
  dados: DadosRelatorioASA;
}

export function RelatorioContent({ dados }: RelatorioContentProps) {
  // Filtrar apenas projetos com último status aprovado
  const projetosAtivos = dados.projetos.filter(projeto => projeto.ultimoStatus);

  return (
    <div className="space-y-8 print:space-y-6 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]" id="relatorio-content" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header do Relatório */}
      <RelatorioHeader dados={dados} />

      {/* Gráficos de Status dos Projetos */}
      <div className="bg-white p-8 rounded-xl border-l-4 border-[#1B365D] break-inside-avoid">
        <GraficoStatusProjeto projetos={dados.projetos} />
      </div>

      {/* Overview de Projetos Ativos */}
      <div className="bg-white p-8 rounded-xl border-l-4 border-[#A6926B] break-inside-avoid">
        <ProjetosOverview projetos={dados.projetos} />
      </div>

      {/* Detalhes dos Projetos */}
      {projetosAtivos.map((projeto, index) => (
        <div key={`detail-${projeto.id}`} className={`bg-white p-8 rounded-xl border-l-4 border-[#2E5984] break-inside-avoid ${index > 0 ? 'page-break-after' : ''}`}>
          <ProjetoDetalhes projeto={projeto} />
        </div>
      ))}

      {/* Tabela de Incidentes */}
      <div className="bg-white p-8 rounded-xl border-l-4 border-[#EF4444] break-inside-avoid page-break-after">
        <TabelaIncidentes incidentes={dados.incidentes} carteira={dados.carteira} />
      </div>

      {/* Footer */}
      <RelatorioFooter dados={dados} />
    </div>
  );
}
