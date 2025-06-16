
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useQueryClient } from '@tanstack/react-query';
import { StatusInformationSection } from './status/StatusInformationSection';
import { RiskManagementSection } from './status/RiskManagementSection';
import { ActivitiesSection } from './status/ActivitiesSection';
import { MilestonesSection } from './status/MilestonesSection';
import { ObservationsSection } from './status/ObservationsSection';

interface EditarStatusFormProps {
  status: StatusProjeto;
  onSuccess: () => void;
}

export function EditarStatusForm({ status, onSuccess }: EditarStatusFormProps) {
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);
  
  const [formData, setFormData] = useState({
    status_geral: status.status_geral,
    status_visao_gp: status.status_visao_gp,
    impacto_riscos: status.impacto_riscos,
    probabilidade_riscos: status.probabilidade_riscos,
    realizado_semana_atual: status.realizado_semana_atual || '',
    backlog: status.backlog || '',
    bloqueios_atuais: status.bloqueios_atuais || '',
    observacoes_pontos_atencao: status.observacoes_pontos_atencao || '',
    entregaveis1: status.entregaveis1 || '',
    entrega1: status.entrega1 || '',
    data_marco1: status.data_marco1 ? status.data_marco1.toISOString().split('T')[0] : '',
    entregaveis2: status.entregaveis2 || '',
    entrega2: status.entrega2 || '',
    data_marco2: status.data_marco2 ? status.data_marco2.toISOString().split('T')[0] : '',
    entregaveis3: status.entregaveis3 || '',
    entrega3: status.entrega3 || '',
    data_marco3: status.data_marco3 ? status.data_marco3.toISOString().split('T')[0] : '',
    progresso_estimado: (status as any).progresso_estimado || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const dataToUpdate = {
        status_geral: formData.status_geral,
        status_visao_gp: formData.status_visao_gp,
        impacto_riscos: formData.impacto_riscos,
        probabilidade_riscos: formData.probabilidade_riscos,
        realizado_semana_atual: formData.realizado_semana_atual,
        backlog: formData.backlog,
        bloqueios_atuais: formData.bloqueios_atuais,
        observacoes_pontos_atencao: formData.observacoes_pontos_atencao,
        entregaveis1: formData.entregaveis1,
        entrega1: formData.entrega1,
        data_marco1: formData.data_marco1 || null,
        entregaveis2: formData.entregaveis2,
        entrega2: formData.entrega2,
        data_marco2: formData.data_marco2 || null,
        entregaveis3: formData.entregaveis3,
        entrega3: formData.entrega3,
        data_marco3: formData.data_marco3 || null,
        progresso_estimado: formData.progresso_estimado,
        data_atualizacao: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('status_projeto')
        .update(dataToUpdate)
        .eq('id', status.id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StatusInformationSection
        statusGeral={formData.status_geral}
        statusVisaoGp={formData.status_visao_gp}
        progressoEstimado={formData.progresso_estimado}
        onStatusGeralChange={(value) => handleInputChange('status_geral', value)}
        onStatusVisaoGpChange={(value) => handleInputChange('status_visao_gp', value)}
        onProgressoEstimadoChange={(value) => handleInputChange('progresso_estimado', value)}
      />

      <RiskManagementSection
        impactoRiscos={formData.impacto_riscos}
        probabilidadeRiscos={formData.probabilidade_riscos}
        onImpactoRiscosChange={(value) => handleInputChange('impacto_riscos', value)}
        onProbabilidadeRiscosChange={(value) => handleInputChange('probabilidade_riscos', value)}
      />

      <ActivitiesSection
        realizadoSemanaAtual={formData.realizado_semana_atual}
        backlog={formData.backlog}
        onRealizadoSemanaAtualChange={(value) => handleInputChange('realizado_semana_atual', value)}
        onBacklogChange={(value) => handleInputChange('backlog', value)}
      />

      <MilestonesSection
        marco1={{
          entrega: formData.entrega1,
          data: formData.data_marco1,
          entregaveis: formData.entregaveis1,
        }}
        marco2={{
          entrega: formData.entrega2,
          data: formData.data_marco2,
          entregaveis: formData.entregaveis2,
        }}
        marco3={{
          entrega: formData.entrega3,
          data: formData.data_marco3,
          entregaveis: formData.entregaveis3,
        }}
        onMarco1Change={(field, value) => {
          if (field === 'entrega') handleInputChange('entrega1', value);
          else if (field === 'data') handleInputChange('data_marco1', value);
          else if (field === 'entregaveis') handleInputChange('entregaveis1', value);
        }}
        onMarco2Change={(field, value) => {
          if (field === 'entrega') handleInputChange('entrega2', value);
          else if (field === 'data') handleInputChange('data_marco2', value);
          else if (field === 'entregaveis') handleInputChange('entregaveis2', value);
        }}
        onMarco3Change={(field, value) => {
          if (field === 'entrega') handleInputChange('entrega3', value);
          else if (field === 'data') handleInputChange('data_marco3', value);
          else if (field === 'entregaveis') handleInputChange('entregaveis3', value);
        }}
      />

      <ObservationsSection
        bloqueiosAtuais={formData.bloqueios_atuais}
        observacoesPontosAtencao={formData.observacoes_pontos_atencao}
        onBloqueiosAtuaisChange={(value) => handleInputChange('bloqueios_atuais', value)}
        onObservacoesPontosAtencaoChange={(value) => handleInputChange('observacoes_pontos_atencao', value)}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Status'}
        </Button>
      </div>
    </form>
  );
}
