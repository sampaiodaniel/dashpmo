import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { RelatorioVisualHeader } from '@/components/relatorios/visual/RelatorioVisualHeader';
import { useRelatorioVisualData } from '@/hooks/useRelatorioVisualData';
import { useHtmlGenerator } from '@/hooks/useHtmlGenerator';
import { RelatorioVisualContentImpressao } from '@/components/relatorios/visual/RelatorioVisualContentImpressao';

export default function RelatorioVisualImpressao() {
  const navigate = useNavigate();
  const { dados, loading } = useRelatorioVisualData();
  const { isGeneratingHtml, handleGenerateHtml } = useHtmlGenerator(dados);

  useEffect(() => {
    const globalStyles = document.createElement('style');
    globalStyles.innerHTML = `
      * { color-adjust: exact !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      @page { margin: 0.5in; size: A4 landscape; }
    `;
    document.head.appendChild(globalStyles);
    return () => { document.head.contains(globalStyles) && document.head.removeChild(globalStyles); };
  }, []);

  const handleVoltar = () => {
    sessionStorage.removeItem('relatorio-visual-dados');
    navigate('/relatorios');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-gray-600">Carregando relatório...</p></div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Download className="h-8 w-8 text-red-600" /></div><div className="text-red-600 mb-4">Erro ao carregar dados do relatório</div><Button onClick={handleVoltar} variant="outline">Voltar aos Relatórios</Button></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RelatorioVisualHeader carteira={dados.carteira} responsavel={dados.responsavel} onGenerateHtml={handleGenerateHtml} isGeneratingHtml={isGeneratingHtml} />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ minWidth: '1200px' }}>
        <RelatorioVisualContentImpressao dados={dados} />
      </div>
    </div>
  );
} 