
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function IncidentesRegistrosHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/incidentes')}
          className="border-pmo-primary text-pmo-primary hover:bg-pmo-primary hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Registros de Incidentes</h1>
          <p className="text-pmo-gray mt-2">Visualizar e gerenciar todos os registros históricos</p>
        </div>
      </div>
    </div>
  );
}
