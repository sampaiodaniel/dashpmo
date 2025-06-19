
import { Button } from '@/components/ui/button';
import { StatusProjeto } from '@/types/pmo';
import { useEditarStatusForm } from '@/hooks/useEditarStatusForm';
import { useMilestoneHandlers } from '@/hooks/useMilestoneHandlers';
import { ProjetoInformacoes } from './status/ProjetoInformacoes';
import { StatusManagementSection } from './status/StatusManagementSection';
import { StatusDetailsSection } from './status/StatusDetailsSection';
import { EntregasDinamicas } from './EntregasDinamicas';

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
    handleSubmit,
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega
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

      <EntregasDinamicas
        entregas={entregas}
        onEntregasChange={setEntregas}
        onAdicionarEntrega={adicionarEntrega}
        onRemoverEntrega={removerEntrega}
        onAtualizarEntrega={atualizarEntrega}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Status'}
        </Button>
      </div>
    </form>
  );
}
