
import { MudancaCard } from './MudancaCard';
import { MudancaReplanejamento } from '@/types/pmo';

interface MudancasListProps {
  mudancas: MudancaReplanejamento[];
}

export function MudancasList({ mudancas }: MudancasListProps) {
  return (
    <div className="space-y-4">
      {mudancas.map((mudanca) => (
        <MudancaCard
          key={mudanca.id}
          mudanca={mudanca}
        />
      ))}
    </div>
  );
}
