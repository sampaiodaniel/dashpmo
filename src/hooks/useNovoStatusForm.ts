
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

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
  probabilidade_riscos: string;
  impacto_riscos: string;
  progresso_estimado?: number;
}

export function useNovoStatusForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const criarStatus = useMutation({
    mutationFn: async (data: NovoStatusData) => {
      if (!usuario) throw new Error('Usuário não autenticado');

      console.log('Criando novo status:', data);

      const { data: result, error } = await supabase
        .from('status_projeto')
        .insert([{
          ...data,
          criado_por: usuario.nome,
          aprovado: null // Status pendente de aprovação
        }])
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

  const handleSubmit = async (data: NovoStatusData) => {
    setIsSubmitting(true);
    try {
      await criarStatus.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting: isSubmitting || criarStatus.isPending,
  };
}
