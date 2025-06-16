
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useNovoStatusForm() {
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);
  
  const [formData, setFormData] = useState({
    carteira: '',
    projeto_id: '',
    status_geral: '',
    status_visao_gp: '',
    impacto_riscos: '',
    probabilidade_riscos: '',
    realizado_semana_atual: '',
    backlog: '',
    bloqueios_atuais: '',
    observacoes_pontos_atencao: '',
    entregaveis1: '',
    entrega1: '',
    data_marco1: '',
    entregaveis2: '',
    entrega2: '',
    data_marco2: '',
    entregaveis3: '',
    entrega3: '',
    data_marco3: '',
    progresso_estimado: 0
  });

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validarFormulario = () => {
    const erros = [];

    if (!formData.carteira) erros.push('Carteira é obrigatória');
    if (!formData.projeto_id) erros.push('Projeto é obrigatório');
    if (!formData.status_geral) erros.push('Status geral é obrigatório');
    if (!formData.status_visao_gp) erros.push('Visão GP é obrigatória');
    if (!formData.impacto_riscos) erros.push('Impacto dos riscos é obrigatório');
    if (!formData.probabilidade_riscos) erros.push('Probabilidade dos riscos é obrigatória');
    
    // Marco 1 obrigatório
    if (!formData.entregaveis1) erros.push('Entregáveis do Marco 1 são obrigatórios');
    if (!formData.entrega1) erros.push('Entrega do Marco 1 é obrigatória');
    if (!formData.data_marco1) erros.push('Data do Marco 1 é obrigatória');

    return erros;
  };

  const salvarStatus = async () => {
    const erros = validarFormulario();
    
    if (erros.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: erros.join(', '),
        variant: "destructive",
      });
      return false;
    }

    setCarregando(true);

    try {
      const statusData = {
        projeto_id: parseInt(formData.projeto_id),
        status_geral: formData.status_geral,
        status_visao_gp: formData.status_visao_gp,
        impacto_riscos: formData.impacto_riscos,
        probabilidade_riscos: formData.probabilidade_riscos,
        realizado_semana_atual: formData.realizado_semana_atual || null,
        backlog: formData.backlog || null,
        bloqueios_atuais: formData.bloqueios_atuais || null,
        observacoes_pontos_atencao: formData.observacoes_pontos_atencao || null,
        entregaveis1: formData.entregaveis1,
        entrega1: formData.entrega1,
        data_marco1: formData.data_marco1,
        entregaveis2: formData.entregaveis2 || null,
        entrega2: formData.entrega2 || null,
        data_marco2: formData.data_marco2 || null,
        entregaveis3: formData.entregaveis3 || null,
        entrega3: formData.entrega3 || null,
        data_marco3: formData.data_marco3 || null,
        progresso_estimado: formData.progresso_estimado,
        criado_por: 'Sistema',
        data_atualizacao: new Date().toISOString().split('T')[0]
      };

      console.log('📝 Salvando status:', statusData);

      const { error } = await supabase
        .from('status_projeto')
        .insert(statusData);

      if (error) {
        console.error('❌ Erro ao salvar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar status",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Status criado com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      return true;

    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar status",
        variant: "destructive",
      });
      return false;
    } finally {
      setCarregando(false);
    }
  };

  return {
    formData,
    updateField,
    salvarStatus,
    carregando
  };
}
