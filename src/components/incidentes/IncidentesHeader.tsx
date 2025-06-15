
import { NovoRegistroIncidenteModal } from '@/components/incidentes/NovoRegistroIncidenteModal';

export function IncidentesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-pmo-primary">Incidentes</h1>
        <p className="text-pmo-gray mt-2">Controle e gestão de incidentes</p>
      </div>
      <NovoRegistroIncidenteModal />
    </div>
  );
}
