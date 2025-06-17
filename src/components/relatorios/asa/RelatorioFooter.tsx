
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';

interface RelatorioFooterProps {
  dados: DadosRelatorioASA;
}

export function RelatorioFooter({ dados }: RelatorioFooterProps) {
  return (
    <div className="text-center text-sm text-[#6B7280] border-t-4 border-[#A6926B] pt-8 bg-white p-8 rounded-xl break-inside-avoid relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#A6926B]/10 to-transparent rounded-full transform -translate-x-10 -translate-y-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <p className="font-bold text-lg text-[#1B365D] mb-2">ASA Investments</p>
            <p className="font-medium text-[#A6926B] mb-1">Gestão de Projetos de TI</p>
            <p className="text-[#6B7280]">Relatório gerado em {dados.dataRelatorio}</p>
          </div>
          <div className="text-right">
            <img 
              src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
              alt="ASA Logo" 
              className="h-20 w-auto mb-2"
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
