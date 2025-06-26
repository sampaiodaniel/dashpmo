
import { useState } from 'react';
import { HtmlGenerator } from '@/utils/htmlGenerator';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export function useHtmlGenerator(dados: DadosRelatorioVisual | null) {
  const [isGeneratingHtml, setIsGeneratingHtml] = useState(false);

  const handleGenerateHtml = async () => {
    if (isGeneratingHtml || !dados) return;
    
    setIsGeneratingHtml(true);
    
    try {
      const generator = new HtmlGenerator(dados);
      await generator.generate();
    } finally {
      setIsGeneratingHtml(false);
    }
  };

  return {
    isGeneratingHtml,
    handleGenerateHtml
  };
}
