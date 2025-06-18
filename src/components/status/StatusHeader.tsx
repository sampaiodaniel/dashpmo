
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StatusHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-pmo-primary">Status dos Projetos</h1>
        <p className="text-pmo-gray mt-2">Acompanhamento e revisão dos status dos projetos</p>
      </div>
      <Link to="/novo-status">
        <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Status
        </Button>
      </Link>
    </div>
  );
}
