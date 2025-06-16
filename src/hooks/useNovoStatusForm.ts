
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useProjetos } from '@/hooks/useProjetos';
import { useMemo } from 'react';

export function useNovoStatusForm() {
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);
  const { data: projetos } = useProjetos();
  
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
    progresso_estimado: 0,
    responsavel_cwi: '',
    gp_responsavel_cwi: '',
    responsavel_asa: ''
  });

  const projetosFiltrados = useMemo(() => {
    if (!projetos || !formData.carteira) return [];
    
    return projetos
      .filter(p => p.area_responsavel === formData.carteira)
      .sort((a, b) => a.nome_projeto.localeCompare(b.nome_projeto));
  }, [projetos, formData.carteira]);

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCarteiraChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      carteira: value,
      projeto_id: '' // Clear project when carteira changes
    }));
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
        status_geral: formData.status_geral as "Verde" | "Amarelo" | "Vermelho",
        status_visao_gp: formData.status_visao_gp as "Verde" | "Amarelo" | "Vermelho",
        impacto_riscos: formData.impacto_riscos as "Baixo" | "Médio" | "Alto",
        probabilidade_riscos: formData.probabilidade_riscos as "Baixo" | "Médio" | "Alto",
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
        responsavel_cwi: formData.responsavel_cwi || null,
        gp_responsavel_cwi: formData.gp_responsavel_cwi || null,
        responsavel_asa: formData.responsavel_asa || null,
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

  const getFormData = () => formData;
  const isFormValid = () => validarFormulario().length === 0;

  return {
    // Basic info
    carteiraSelecionada: formData.carteira,
    projetoId: formData.projeto_id,
    progressoEstimado: formData.progresso_estimado,
    projetosFiltrados,
    handleCarteiraChange,
    setProjetoId: (value: string) => updateField('projeto_id', value),
    setProgressoEstimado: (value: number) => updateField('progresso_estimado', value),
    
    // Responsáveis
    responsavelCwi: formData.responsavel_cwi,
    gpResponsavelCwi: formData.gp_responsavel_cwi,
    responsavelAsa: formData.responsavel_asa,
    setResponsavelCwi: (value: string) => updateField('responsavel_cwi', value),
    setGpResponsavelCwi: (value: string) => updateField('gp_responsavel_cwi', value),
    setResponsavelAsa: (value: string) => updateField('responsavel_asa', value),
    
    // Status e riscos
    statusGeral: formData.status_geral,
    statusVisaoGp: formData.status_visao_gp,
    impactoRiscos: formData.impacto_riscos,
    probabilidadeRiscos: formData.probabilidade_riscos,
    setStatusGeral: (value: string) => updateField('status_geral', value),
    setStatusVisaoGp: (value: string) => updateField('status_visao_gp', value),
    setImpactoRiscos: (value: string) => updateField('impacto_riscos', value),
    setProbabilidadeRiscos: (value: string) => updateField('probabilidade_riscos', value),
    
    // Entregas
    nomeEntrega1: formData.entrega1,
    escopoEntrega1: formData.entregaveis1,
    dataEntrega1: formData.data_marco1,
    nomeEntrega2: formData.entrega2,
    escopoEntrega2: formData.entregaveis2,
    dataEntrega2: formData.data_marco2,
    nomeEntrega3: formData.entrega3,
    escopoEntrega3: formData.entregaveis3,
    dataEntrega3: formData.data_marco3,
    setNomeEntrega1: (value: string) => updateField('entrega1', value),
    setEscopoEntrega1: (value: string) => updateField('entregaveis1', value),
    setDataEntrega1: (value: string) => updateField('data_marco1', value),
    setNomeEntrega2: (value: string) => updateField('entrega2', value),
    setEscopoEntrega2: (value: string) => updateField('entregaveis2', value),
    setDataEntrega2: (value: string) => updateField('data_marco2', value),
    setNomeEntrega3: (value: string) => updateField('entrega3', value),
    setEscopoEntrega3: (value: string) => updateField('entregaveis3', value),
    setDataEntrega3: (value: string) => updateField('data_marco3', value),
    
    // Outras informações
    realizadoSemana: formData.realizado_semana_atual,
    backlog: formData.backlog,
    bloqueios: formData.bloqueios_atuais,
    observacoesPontosAtencao: formData.observacoes_pontos_atencao,
    setRealizadoSemana: (value: string) => updateField('realizado_semana_atual', value),
    setBacklog: (value: string) => updateField('backlog', value),
    setBloqueios: (value: string) => updateField('bloqueios_atuais', value),
    setObservacoesPontosAtencao: (value: string) => updateField('observacoes_pontos_atencao', value),
    
    // Methods
    getFormData,
    isFormValid,
    salvarStatus,
    carregando
  };
}
