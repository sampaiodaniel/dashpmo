import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRelatorioConsolidado, DadosRelatorioConsolidado } from '@/hooks/useRelatorioConsolidado';
import { RelatorioConsolidadoContent } from '@/components/relatorios/consolidado/RelatorioConsolidadoContent';

export default function RelatorioConsolidado() {
  const [searchParams] = useSearchParams();
  const [dados, setDados] = useState<DadosRelatorioConsolidado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { gerarRelatorioCarteira, gerarRelatorioResponsavel } = useRelatorioConsolidado();

  const gerarRelatorio = useCallback(async () => {
    const tipo = searchParams.get('tipo');
    const valor = searchParams.get('valor');

    if (!tipo || !valor) {
      setError('Parâmetros de relatório não encontrados');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      let dadosRelatorio = null;
      
      if (tipo === 'carteira') {
        dadosRelatorio = await gerarRelatorioCarteira(valor);
      } else if (tipo === 'responsavel') {
        dadosRelatorio = await gerarRelatorioResponsavel(valor);
      }

      if (!dadosRelatorio) {
        setError('Nenhum dado encontrado para o relatório');
      } else {
        setDados(dadosRelatorio);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório consolidado:', error);
      setError('Erro ao gerar relatório consolidado');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, gerarRelatorioCarteira, gerarRelatorioResponsavel]);

  // Gerar relatório apenas uma vez ao montar o componente
  useEffect(() => {
    gerarRelatorio();
  }, []); // Array de dependências vazio para executar apenas uma vez

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/DashPMO_Icon_recortado.png" 
              alt="DashPMO Logo" 
              className="w-16 h-16"
            />
          </div>
          <div className="text-[#6B7280]">Gerando relatório consolidado...</div>
        </div>
      </div>
    );
  }

  if (error || !dados) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/DashPMO_Icon_recortado.png" 
              alt="DashPMO Logo" 
              className="w-16 h-16"
            />
          </div>
          <div className="text-[#6B7280]">{error || 'Nenhum dado encontrado para o relatório'}</div>
        </div>
      </div>
    );
  }

  return <RelatorioConsolidadoContent dados={dados} />;
}
