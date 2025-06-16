
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NovoRegistroIncidenteModal } from '@/components/incidentes/NovoRegistroIncidenteModal';

export function IncidentesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Incidentes</h1>
          <p className="text-pmo-gray mt-2">Controle e gestão de incidentes</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-pmo-primary hover:bg-pmo-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro
        </Button>
      </div>
      
      <NovoRegistroIncidenteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
