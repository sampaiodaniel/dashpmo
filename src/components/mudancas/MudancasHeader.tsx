import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { CriarMudancaModal } from '@/components/forms/CriarMudancaModal';

interface MudancasHeaderProps {
  onMudancaCriada: () => void;
}

export function MudancasHeader({ onMudancaCriada }: MudancasHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-pmo-primary">Mudanças</h1>
        <p className="text-pmo-gray mt-2">Gestão de mudanças e replanejamentos de projetos</p>
      </div>
      <CriarMudancaModal onMudancaCriada={onMudancaCriada} />
    </div>
  );
}
