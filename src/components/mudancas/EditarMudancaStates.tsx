
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="text-center py-8 text-pmo-gray">
      <div>{message}</div>
    </div>
  );
}

interface NotFoundStateProps {
  onVoltar: () => void;
}

export function NotFoundState({ onVoltar }: NotFoundStateProps) {
  return (
    <div className="text-center py-8">
      <div className="text-red-600 mb-4">Mudança não encontrada</div>
      <Button onClick={onVoltar}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Mudanças
      </Button>
    </div>
  );
}
