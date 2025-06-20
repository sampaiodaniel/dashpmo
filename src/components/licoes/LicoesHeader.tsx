
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface LicoesHeaderProps {
  onNovaLicao: () => void;
}

export function LicoesHeader({ onNovaLicao }: LicoesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-pmo-primary">Lições Aprendidas</h1>
        <p className="text-pmo-gray mt-2">Base de conhecimento e boas práticas</p>
      </div>
      <Button 
        onClick={onNovaLicao}
        className="bg-pmo-primary hover:bg-pmo-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova Lição
      </Button>
    </div>
  );
}
