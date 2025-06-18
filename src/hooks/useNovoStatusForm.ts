
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useLogger } from '@/utils/logger';

const statusFormSchema = z.object({
  projeto_id: z.number().min(1, "Projeto é obrigatório"),
  status_geral: z.enum(['Planejamento', 'Em Andamento', 'Pausado', 'Concluído', 'Cancelado', 'Aguardando Aprovação', 'Aguardando Homologação', 'Em Especificação'], {
    required_error: "Status geral é obrigatório",
  }),
  status_visao_gp: z.enum(['Verde', 'Amarelo', 'Vermelho'], {
    required_error: "Visão GP é obrigatória",
  }),
  progresso_estimado: z.number().min(0).max(100),
  probabilidade_riscos: z.enum(['Baixo', 'Médio', 'Alto'], {
    required_error: "Probabilidade de riscos é obrigatória",
  }),
  impacto_riscos: z.enum(['Baixo', 'Médio', 'Alto'], {
    required_error: "Impacto de riscos é obrigatório",
  }),
  entregas_realizadas: z.string().min(1, "Itens trabalhados na semana são obrigatórios"),
  backlog: z.string().optional(),
  bloqueios_atuais: z.string().optional(),
  observacoes_gerais: z.string().optional(),
  marco1_nome: z.string().min(1, "Nome da primeira entrega é obrigatório"),
  marco1_data: z.string().optional(),
  marco1_responsavel: z.string().min(1, "Entregáveis da primeira entrega são obrigatórios"),
  marco2_nome: z.string().optional(),
  marco2_data: z.string().optional(),
  marco2_responsavel: z.string().optional(),
  marco3_nome: z.string().optional(),
  marco3_data: z.string().optional(),
  marco3_responsavel: z.string().optional(),
});

type StatusFormData = z.infer<typeof statusFormSchema>;

export function useNovoStatusForm() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { log } = useLogger();
  
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('');
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | null>(null);
  const [progressoEstimado, setProgressoEstimado] = useState(0);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      progresso_estimado: 0,
      entregas_realizadas: '',
      backlog: '',
      bloqueios_atuais: '',
      observacoes_gerais: '',
      marco1_nome: '',
      marco1_data: '',
      marco1_responsavel: '',
      marco2_nome: '',
      marco2_data: '',
      marco2_responsavel: '',
      marco3_nome: '',
      marco3_data: '',
      marco3_responsavel: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: StatusFormData) => {
      if (!usuario || !projetoSelecionado) {
        throw new Error('Usuário não autenticado ou projeto não selecionado');
      }

      console.log('📝 Criando status:', data);

      // Buscar dados do projeto para preencher campos adicionais
      const { data: projeto, error: projetoError } = await supabase
        .from('projetos')
        .select('*')
        .eq('id', projetoSelecionado)
        .single();

      if (projetoError) {
        console.error('Erro ao buscar projeto:', projetoError);
        throw projetoError;
      }

      const statusData = {
        projeto_id: projetoSelecionado,
        status_geral: data.status_geral,
        status_visao_gp: data.status_visao_gp,
        progresso_estimado: progressoEstimado,
        probabilidade_riscos: data.probabilidade_riscos,
        impacto_riscos: data.impacto_riscos,
        realizado_semana_atual: data.entregas_realizadas,
        backlog: data.backlog || null,
        bloqueios_atuais: data.bloqueios_atuais || null,
        observacoes_pontos_atencao: data.observacoes_gerais || null,
        entrega1: data.marco1_nome,
        data_marco1: data.marco1_data === 'TBD' ? null : (data.marco1_data || null),
        entregaveis1: data.marco1_responsavel,
        entrega2: data.marco2_nome || null,
        data_marco2: data.marco2_data === 'TBD' ? null : (data.marco2_data || null),
        entregaveis2: data.marco2_responsavel || null,
        entrega3: data.marco3_nome || null,
        data_marco3: data.marco3_data === 'TBD' ? null : (data.marco3_data || null),
        entregaveis3: data.marco3_responsavel || null,
        criado_por: usuario.nome,
        responsavel_asa: projeto.responsavel_asa,
        responsavel_cwi: projeto.responsavel_cwi,
        gp_responsavel_cwi: projeto.gp_responsavel_cwi,
        carteira_primaria: projeto.carteira_primaria,
        carteira_secundaria: projeto.carteira_secundaria,
        carteira_terciaria: projeto.carteira_terciaria,
      };

      const { data: novoStatus, error } = await supabase
        .from('status_projeto')
        .insert(statusData)
        .select('*, projeto:projetos(*)')
        .single();

      if (error) {
        console.error('Erro ao criar status:', error);
        throw error;
      }

      console.log('✅ Status criado com sucesso:', novoStatus);

      // Registrar log da criação
      log(
        'status',
        'criacao',
        'status_projeto',
        novoStatus.id,
        `Status do projeto ${projeto.nome_projeto}`,
        {
          status_geral: novoStatus.status_geral,
          status_visao_gp: novoStatus.status_visao_gp,
          progresso_estimado: novoStatus.progresso_estimado
        }
      );

      return novoStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      toast({
        title: "Sucesso",
        description: "Status criado com sucesso!",
      });
      navigate('/status');
    },
    onError: (error) => {
      console.error('Erro ao criar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar status. Tente novamente.",
        variant: "destructive",
      });
    },
  });

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
    form.setValue('progresso_estimado', progresso);
  };

  const onSubmit = (data: StatusFormData) => {
    mutation.mutate(data);
  };

  return {
    form,
    isLoading: mutation.isPending,
    onSubmit,
    projetoSelecionado,
    carteiraSelecionada,
    progressoEstimado,
    handleCarteiraChange,
    handleProjetoChange,
    handleProgressoChange,
  };
}
