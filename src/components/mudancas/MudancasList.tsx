
import { MudancaCard } from './MudancaCard';
import { MudancaReplanejamento } from '@/types/pmo';
import { MouseEvent } from 'react';

interface MudancasListProps {
  mudancas: MudancaReplanejamento[];
  onCardClick: (mudancaId: number) => void;
  onEditar: (e: MouseEvent, mudancaId: number) => void;
  onExcluir: (e: MouseEvent, mudancaId: number) => Promise<void>;
}

export function MudancasList({ 
  mudancas, 
  onCardClick, 
  onEditar, 
  onExcluir 
}: MudancasListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mudancas.map((mudanca) => (
        <MudancaCard
          key={mudanca.id}
          mudanca={mudanca}
          onCardClick={onCardClick}
          onEditar={onEditar}
          onExcluir={onExcluir}
        />
      ))}
    </div>
  );
}
