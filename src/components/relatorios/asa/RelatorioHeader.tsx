import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { useState, useEffect } from 'react';
import { prepareImageForReport } from '@/utils/imageUtils';

interface RelatorioHeaderProps {
  dados: DadosRelatorioASA;
}

export function RelatorioHeader({ dados }: RelatorioHeaderProps) {
  const [logoSrc, setLogoSrc] = useState<string>("/lovable-uploads/Logo_Asa_recortado.png");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await prepareImageForReport("/lovable-uploads/Logo_Asa_recortado.png");
        setLogoSrc(logoUrl);
      } catch (error) {
        console.error('Erro ao carregar logo no header:', error);
        // Mantém o src padrão como fallback
      }
    };

    loadLogo();
  }, []);

  return (
    <div className="text-center border-b-4 border-[#A6926B] pb-8 bg-white p-8 rounded-xl break-inside-avoid relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A6926B]/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#1B365D]/10 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-8 mb-8">
          <img 
            src={logoSrc}
            alt="ASA Logo" 
            className="h-24 w-auto"
            onError={(e) => {
              console.error('Erro ao carregar logo:', e);
              // Fallback para URL relativa
              (e.target as HTMLImageElement).src = "/lovable-uploads/Logo_Asa_recortado.png";
            }}
            loading="eager"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="text-left">
            <h1 className="text-5xl font-bold text-[#1B365D] mb-3 tracking-tight">Status Report</h1>
            <h2 className="text-3xl font-semibold text-[#A6926B] mb-4">Gerencial</h2>
            <div className="bg-gradient-to-r from-[#1B365D] to-[#2E5984] text-white px-6 py-3 rounded-lg">
              <p className="text-xl font-medium">Carteira: {dados.carteira}</p>
              <p className="text-sm opacity-90">Referência: {dados.dataRelatorio}</p>
            </div>
          </div>
        </div>
        
        {/* Linha decorativa */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#A6926B] to-transparent"></div>
          <div className="w-3 h-3 bg-[#A6926B] rounded-full"></div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#A6926B] to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
