import { Button } from '@/components/ui/button';
import { StatusProjeto } from '@/types/pmo';
import { useEditarStatusForm } from '@/hooks/useEditarStatusForm';
import { useMilestoneHandlers } from '@/hooks/useMilestoneHandlers';
import { ProjetoInformacoes } from './status/ProjetoInformacoes';
import { StatusManagementSection } from './status/StatusManagementSection';
import { StatusDetailsSection } from './status/StatusDetailsSection';
import { EntregasDinamicas } from './EntregasDinamicas';
import { Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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

  // Wrapper para compatibilizar tipos
  const handleInputChangeBasic = (field: string, value: string | number) => {
    handleInputChange(field, value);
  };

  return (
    <div className="space-y-6">
      {/* Alerta informativo sobre edição */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>📝 Editando Status:</strong> Você está editando o status de{' '}
          {status.data_atualizacao && new Date(status.data_atualizacao).toLocaleDateString('pt-BR')}.{' '}
          Todas as alterações serão salvas e o histórico mantido.
        </AlertDescription>
      </Alert>

      <form onSubmit={(e) => handleSubmit(e, onSuccess)} className="space-y-6">
        <ProjetoInformacoes 
          status={status} 
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        <StatusManagementSection 
          formData={formData}
          onInputChange={handleInputChangeBasic}
        />

        <StatusDetailsSection
          formData={formData}
          onInputChange={handleInputChangeBasic}
        />

        <EntregasDinamicas
          entregas={entregas}
          onChange={setEntregas}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={carregando}>
            <Save className="h-4 w-4 mr-2" />
            {carregando ? 'Salvando...' : 'Salvar Status'}
          </Button>
        </div>
      </form>
    </div>
  );
}
