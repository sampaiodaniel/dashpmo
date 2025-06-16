
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

const statusFormSchema = z.object({
  projeto_id: z.number(),
  status_geral: z.string(),
  status_visao_gp: z.string(),
  realizado_semana_atual: z.string().optional(),
  backlog: z.string().optional(),
  bloqueios_atuais: z.string().optional(),
  observacoes_pontos_atencao: z.string().optional(),
  data_marco1: z.string().optional(),
  entrega1: z.string().optional(),
  entregaveis1: z.string().optional(),
  data_marco2: z.string().optional(),
  entrega2: z.string().optional(),
  entregaveis2: z.string().optional(),
  data_marco3: z.string().optional(),
  entrega3: z.string().optional(),
  entregaveis3: z.string().optional(),
  probabilidade_riscos: z.enum(['Baixo', 'Médio', 'Alto']),
  impacto_riscos: z.enum(['Baixo', 'Médio', 'Alto']),
  progresso_estimado: z.number().optional(),
  marco1_responsavel: z.string().optional(),
  marco1_nome: z.string().optional(),
  marco1_data: z.string().optional(),
  marco2_responsavel: z.string().optional(),
  marco2_nome: z.string().optional(),
  marco2_data: z.string().optional(),
  marco3_responsavel: z.string().optional(),
  marco3_nome: z.string().optional(),
  marco3_data: z.string().optional(),
  entregas_realizadas: z.string().optional(),
  observacoes_gerais: z.string().optional(),
});

type StatusFormData = z.infer<typeof statusFormSchema>;

export interface NovoStatusData {
  projeto_id: number;
  status_geral: string;
  status_visao_gp: string;
  realizado_semana_atual?: string;
  backlog?: string;
  bloqueios_atuais?: string;
  observacoes_pontos_atencao?: string;
  data_marco1?: string;
  entrega1?: string;
  entregaveis1?: string;
  data_marco2?: string;
  entrega2?: string;
  entregaveis2?: string;
  data_marco3?: string;
  entrega3?: string;
  entregaveis3?: string;
  probabilidade_riscos: 'Baixo' | 'Médio' | 'Alto';
  impacto_riscos: 'Baixo' | 'Médio' | 'Alto';
  progresso_estimado?: number;
}

export function useNovoStatusForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('');
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | null>(null);
  const [progressoEstimado, setProgressoEstimado] = useState(0);
  const queryClient = useQueryClient();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      probabilidade_riscos: 'Baixo',
      impacto_riscos: 'Baixo',
      progresso_estimado: 0,
    },
  });

  const criarStatus = useMutation({
    mutationFn: async (data: NovoStatusData) => {
      if (!usuario) throw new Error('Usuário não autenticado');

      console.log('Criando novo status:', data);

      const { data: result, error } = await supabase
        .from('status_projeto')
        .insert({
          ...data,
          criado_por: usuario.nome,
          aprovado: null // Status pendente de aprovação
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar status:', error);
        throw error;
      }

      console.log('Status criado com sucesso:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['status-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      
      toast({
        title: "Sucesso",
        description: "Status criado com sucesso!",
      });

      // Navegar de volta para a listagem de status
      navigate('/status');
    },
    onError: (error: Error) => {
      console.error('Erro ao criar status:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar status. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: StatusFormData) => {
    setIsSubmitting(true);
    try {
      const statusData: NovoStatusData = {
        projeto_id: data.projeto_id,
        status_geral: data.status_geral,
        status_visao_gp: data.status_visao_gp,
        realizado_semana_atual: data.entregas_realizadas,
        backlog: data.backlog,
        bloqueios_atuais: data.bloqueios_atuais,
        observacoes_pontos_atencao: data.observacoes_gerais,
        data_marco1: data.marco1_data,
        entrega1: data.marco1_nome,
        entregaveis1: data.marco1_responsavel,
        data_marco2: data.marco2_data,
        entrega2: data.marco2_nome,
        entregaveis2: data.marco2_responsavel,
        data_marco3: data.marco3_data,
        entrega3: data.marco3_nome,
        entregaveis3: data.marco3_responsavel,
        probabilidade_riscos: data.probabilidade_riscos,
        impacto_riscos: data.impacto_riscos,
        progresso_estimado: progressoEstimado,
      };
      
      await criarStatus.mutateAsync(statusData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCarteiraChange = (carteira: string) => {
    setCarteiraSelecionada(carteira);
    setProjetoSelecionado(null);
    form.setValue('projeto_id', 0);
  };

  const handleProjetoChange = (projetoId: number) => {
    setProjetoSelecionado(projetoId);
    form.setValue('projeto_id', projetoId);
  };

  const handleProgressoChange = (progresso: number) => {
    setProgressoEstimado(progresso);
  };

  return {
    form,
    isSubmitting: isSubmitting || criarStatus.isPending,
    onSubmit,
    projetoSelecionado,
    carteiraSelecionada,
    progressoEstimado,
    handleCarteiraChange,
    handleProjetoChange,
    handleProgressoChange,
  };
}
