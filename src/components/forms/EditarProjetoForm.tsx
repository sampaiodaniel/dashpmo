
import { Button } from '@/components/ui/button';
import { Projeto } from '@/types/pmo';
import { useEditarProjetoForm } from '@/hooks/useEditarProjetoForm';
import { InformacoesBasicasSection } from './editar-projeto/InformacoesBasicasSection';
import { ResponsaveisSection } from './editar-projeto/ResponsaveisSection';
import { CarteirasSection } from './editar-projeto/CarteirasSection';

interface EditarProjetoFormProps {
  projeto: Projeto;
  onSuccess: () => void;
}

export function EditarProjetoForm({ projeto, onSuccess }: EditarProjetoFormProps) {
  console.log('📋 EditarProjetoForm iniciado com projeto:', projeto);
  
  const { formData, carregando, handleInputChange, handleSubmit } = useEditarProjetoForm({
    projeto,
    onSuccess
  });

  console.log('📝 FormData inicial:', formData);

  if (!projeto) {
    console.error('❌ Projeto não encontrado no EditarProjetoForm');
    return <div>Projeto não encontrado</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InformacoesBasicasSection formData={formData} onInputChange={handleInputChange} />
      <ResponsaveisSection formData={formData} onInputChange={handleInputChange} />
      <CarteirasSection formData={formData} onInputChange={handleInputChange} />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
