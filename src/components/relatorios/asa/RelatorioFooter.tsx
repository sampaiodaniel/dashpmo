import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { useState, useEffect } from 'react';
import { prepareImageForReport } from '@/utils/imageUtils';

interface RelatorioFooterProps {
  dados: {
    dataRelatorio?: string;
    carteira?: string;
    responsavel?: string;
    dataGeracao?: Date | string;
  };
}

export function RelatorioFooter({ dados }: RelatorioFooterProps) {
  const [logoSrc, setLogoSrc] = useState<string>("/lovable-uploads/Logo_Asa_recortado.png");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await prepareImageForReport("/lovable-uploads/Logo_Asa_recortado.png");
        setLogoSrc(logoUrl);
      } catch (error) {
        console.error('Erro ao carregar logo no footer:', error);
        // Mantém o src padrão como fallback
      }
    };

    loadLogo();
  }, []);

  // Normalizar data de geração
  let dataFormatada: string;
  if (dados.dataRelatorio) {
    dataFormatada = dados.dataRelatorio;
  } else if (dados.dataGeracao) {
    const data = dados.dataGeracao instanceof Date ? dados.dataGeracao : new Date(dados.dataGeracao);
    dataFormatada = data.toLocaleDateString('pt-BR');
  } else {
    dataFormatada = new Date().toLocaleDateString('pt-BR');
  }

  return (
    <div className="text-center text-sm text-[#6B7280] border-t-4 border-[#A6926B] pt-8 bg-white p-8 rounded-xl break-inside-avoid relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#A6926B]/10 to-transparent rounded-full transform -translate-x-10 -translate-y-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <p className="font-bold text-lg text-[#1B365D] mb-2">ASA Investments</p>
            <p className="font-medium text-[#A6926B] mb-1">Relatório gerado em {dataFormatada} por DashPMO</p>
            <p className="text-xs text-[#9CA3AF]">Desenvolvido por Daniel Sampaio de Almeida - PMO/CWI</p>
          </div>
          <div className="text-right">
            <img 
              src={logoSrc}
              alt="ASA Logo" 
              className="w-auto mb-2"
              onError={(e) => {
                console.error('Erro ao carregar logo no footer:', e);
                // Fallback para URL relativa
                (e.target as HTMLImageElement).src = "/lovable-uploads/Logo_Asa_recortado.png";
              }}
              loading="eager"
              style={{ maxWidth: '100%', height: '56px', width: 'auto' }}
            />
          </div>
        </div>
        
        <div className="border-t border-[#E5E7EB] pt-4 text-xs text-[#9CA3AF] leading-relaxed">
          <p className="mb-2">© 2024 ASA. Todos os direitos reservados. Material confidencial e de propriedade da ASA, protegido por sigilo profissional.</p>
          <p>O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.</p>
        </div>
      </div>
    </div>
  );
}
