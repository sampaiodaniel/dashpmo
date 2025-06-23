import React from 'react';
import { getCarteiraInfo, getCarteiraBadgeClasses, getTodasCarteiras, ProjetoComCarteiras } from '@/utils/carteiraUtils';

interface CarteirasTagsProps {
  projeto: ProjetoComCarteiras;
  className?: string;
  showIcon?: boolean;
}

export function CarteirasTags({ projeto, className = "", showIcon = true }: CarteirasTagsProps) {
  const carteiras = getTodasCarteiras(projeto);

  if (carteiras.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {carteiras.map((carteira, index) => {
        const carteiraInfo = getCarteiraInfo(carteira);
        const badgeClasses = getCarteiraBadgeClasses(carteira);
        
        return (
          <div 
            key={`${carteira}-${index}`}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${badgeClasses}`}
          >
            {showIcon && (
              <span className="text-sm">{carteiraInfo.emoji}</span>
            )}
            <span className="font-semibold text-sm">
              {carteiraInfo.nome}
            </span>
          </div>
        );
      })}
    </div>
  );
} 