
import { Button } from '@/components/ui/button';
import { StatusProjeto } from '@/types/pmo';
import { useEditarStatusForm } from '@/hooks/useEditarStatusForm';
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
    carregando,
    handleInputChange,
    handleSubmit,
    entregas,
    setEntregas
  } = useEditarStatusForm(status);

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
          onInputChange={handleInputChange}
        />

        <StatusDetailsSection
          formData={formData}
          onInputChange={handleInputChange}
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
