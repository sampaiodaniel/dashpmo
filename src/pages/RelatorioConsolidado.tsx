
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRelatorioConsolidado, DadosRelatorioConsolidado } from '@/hooks/useRelatorioConsolidado';
import { RelatorioConsolidadoContent } from '@/components/relatorios/consolidado/RelatorioConsolidadoContent';

export default function RelatorioConsolidado() {
  const [searchParams] = useSearchParams();
  const [dados, setDados] = useState<DadosRelatorioConsolidado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { gerarRelatorioCarteira, gerarRelatorioResponsavel } = useRelatorioConsolidado();

  useEffect(() => {
    const gerarRelatorio = async () => {
      const tipo = searchParams.get('tipo');
      const valor = searchParams.get('valor');

      if (!tipo || !valor) {
        setIsLoading(false);
        return;
      }

      try {
        let dadosRelatorio = null;
        
        if (tipo === 'carteira') {
          dadosRelatorio = await gerarRelatorioCarteira(valor);
        } else if (tipo === 'responsavel') {
          dadosRelatorio = await gerarRelatorioResponsavel(valor);
        }

        setDados(dadosRelatorio);
      } catch (error) {
        console.error('Erro ao gerar relatório consolidado:', error);
      } finally {
        setIsLoading(false);
      }
    };

    gerarRelatorio();
  }, [searchParams, gerarRelatorioCarteira, gerarRelatorioResponsavel]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#1B365D] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div className="text-[#6B7280]">Gerando relatório consolidado...</div>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#1B365D] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div className="text-[#6B7280]">Nenhum dado encontrado para o relatório</div>
        </div>
      </div>
    );
  }

  return <RelatorioConsolidadoContent dados={dados} />;
}
