
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NovoRegistroIncidenteModal } from '@/components/incidentes/NovoRegistroIncidenteModal';
import { useAuth } from '@/hooks/useAuth';

export function IncidentesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Incidentes</h1>
          <p className="text-pmo-gray mt-2">Controle e gestão de incidentes</p>
        </div>
        <div className="flex gap-2">
          {isAdmin() && (
            <Button 
              variant="outline"
              onClick={() => navigate('/incidentes-registros')}
              className="border-pmo-primary text-pmo-primary hover:bg-pmo-primary hover:text-white"
            >
              <List className="w-4 h-4 mr-2" />
              Ver Registros
            </Button>
          )}
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-pmo-primary hover:bg-pmo-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        </div>
      </div>
      
      <NovoRegistroIncidenteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
