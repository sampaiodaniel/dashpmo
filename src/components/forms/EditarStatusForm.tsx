import { Button } from '@/components/ui/button';
import { StatusProjeto } from '@/types/pmo';
import { useEditarStatusForm } from '@/hooks/useEditarStatusForm';
import { useMilestoneHandlers } from '@/hooks/useMilestoneHandlers';
import { ProjetoInformacoes } from './status/ProjetoInformacoes';
import { StatusManagementSection } from './status/StatusManagementSection';
import { StatusDetailsSection } from './status/StatusDetailsSection';
import { MilestoneManagementSection } from './status/MilestoneManagementSection';

interface EditarStatusFormProps {
  status: StatusProjeto;
  onSuccess: () => void;
}

export function EditarStatusForm({ status, onSuccess }: EditarStatusFormProps) {
  const {
    formData,
    setFormData,
    carregando,
    marco1TBD,
    setMarco1TBD,
    marco2TBD,
    setMarco2TBD,
    marco3TBD,
    setMarco3TBD,
    dataMarco1,
    setDataMarco1,
    dataMarco2,
    setDataMarco2,
    dataMarco3,
    setDataMarco3,
    handleInputChange,
    handleSubmit
  } = useEditarStatusForm(status);

  const {
    handleMarco1DateChange,
    handleMarco1TBDChange,
    handleMarco2DateChange,
    handleMarco2TBDChange,
    handleMarco3DateChange,
    handleMarco3TBDChange
  } = useMilestoneHandlers(
    setFormData,
    setDataMarco1,
    setDataMarco2,
    setDataMarco3,
    setMarco1TBD,
    setMarco2TBD,
    setMarco3TBD,
    dataMarco1,
    dataMarco2,
    dataMarco3,
    marco1TBD,
    marco2TBD,
    marco3TBD
  );

  return (
    <form onSubmit={(e) => handleSubmit(e, onSuccess)} className="space-y-6">
      <ProjetoInformacoes status={status} />
      
      <StatusManagementSection 
        formData={formData}
        onInputChange={handleInputChange}
      />

      <StatusDetailsSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <MilestoneManagementSection
        formData={formData}
        onInputChange={handleInputChange}
        marco1TBD={marco1TBD}
        marco2TBD={marco2TBD}
        marco3TBD={marco3TBD}
        dataMarco1={dataMarco1}
        dataMarco2={dataMarco2}
        dataMarco3={dataMarco3}
        onMarco1DateChange={handleMarco1DateChange}
        onMarco2DateChange={handleMarco2DateChange}
        onMarco3DateChange={handleMarco3DateChange}
        onMarco1TBDChange={handleMarco1TBDChange}
        onMarco2TBDChange={handleMarco2TBDChange}
        onMarco3TBDChange={handleMarco3TBDChange}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Status'}
        </Button>
      </div>
    </form>
  );
}
