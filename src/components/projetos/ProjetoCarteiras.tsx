
import { Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Projeto } from '@/types/pmo';

interface ProjetoCarteirasProps {
  projeto: Projeto;
}

export function ProjetoCarteiras({ projeto }: ProjetoCarteirasProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-pmo-primary mb-4 flex items-center gap-2">
        <Building className="h-5 w-5" />
        Carteiras
      </h2>
      
      <div className="space-y-3">
        <div>
          <span className="text-sm text-pmo-gray">Carteira Principal:</span>
          <div className="mt-1">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
              {projeto.area_responsavel}
            </Badge>
          </div>
        </div>

        {projeto.carteira_primaria && (
          <div>
            <span className="text-sm text-pmo-gray">Carteira Primária:</span>
            <div className="mt-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {projeto.carteira_primaria}
              </Badge>
            </div>
          </div>
        )}

        {projeto.carteira_secundaria && (
          <div>
            <span className="text-sm text-pmo-gray">Carteira Secundária:</span>
            <div className="mt-1">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {projeto.carteira_secundaria}
              </Badge>
            </div>
          </div>
        )}

        {projeto.carteira_terciaria && (
          <div>
            <span className="text-sm text-pmo-gray">Carteira Terciária:</span>
            <div className="mt-1">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {projeto.carteira_terciaria}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
