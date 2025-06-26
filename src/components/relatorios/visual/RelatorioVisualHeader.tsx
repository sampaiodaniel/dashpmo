
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface RelatorioVisualHeaderProps {
  carteira?: string;
  responsavel?: string;
  onGenerateHtml: () => void;
  isGeneratingHtml: boolean;
}

export function RelatorioVisualHeader({ 
  carteira, 
  responsavel, 
  onGenerateHtml, 
  isGeneratingHtml 
}: RelatorioVisualHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Relatório Visual - {carteira || responsavel}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateHtml}
              disabled={isGeneratingHtml}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isGeneratingHtml ? 'Gerando HTML...' : 'Gerar HTML'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
