

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const statusFormSchema = z.object({
  projeto_id: z.number().min(1, 'Projeto é obrigatório'),
  carteira_primaria: z.string().min(1, 'Carteira primária é obrigatória'),
  carteira_secundaria: z.string().optional(),
  carteira_terciaria: z.string().optional(),
  status_geral: z.enum(['Planejamento', 'Em Andamento', 'Pausado', 'Concluído', 'Cancelado', 'Em Especificação', 'Aguardando Aprovação', 'Aguardando Homologação']),
  status_visao_gp: z.enum(['Verde', 'Amarelo', 'Vermelho']),
  probabilidade_riscos: z.enum(['Baixo', 'Médio', 'Alto']),
  impacto_riscos: z.enum(['Baixo', 'Médio', 'Alto']),
  backlog: z.string().optional(),
  bloqueios_atuais: z.string().optional(),
  entregas_realizadas: z.string().optional(),
  proximas_entregas: z.string().optional(),
  marcos_projeto: z.string().optional(),
  riscos_identificados: z.string().optional(),
  mudancas_solicitadas: z.string().optional(),
  observacoes_gerais: z.string().optional(),
  marco1_nome: z.string().min(1, 'Nome do Marco 1 é obrigatório'),
  marco1_data: z.string().min(1, 'Data do Marco 1 é obrigatória'),
  marco1_responsavel: z.string().min(1, 'Responsável do Marco 1 é obrigatório'),
  marco2_nome: z.string().optional(),
  marco2_data: z.string().optional(),
  marco2_responsavel: z.string().optional(),
  marco3_nome: z.string().optional(),
  marco3_data: z.string().optional(),
  marco3_responsavel: z.string().optional(),
});

type StatusFormData = z.infer<typeof statusFormSchema>;

export function useNovoStatusForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | null>(null);
  const [carteiraSelecionada, setCarteiraSelecionada] = useState<string>('');
  const { usuario } = useAuth();

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      projeto_id: 0,
      carteira_primaria: '',
      carteira_secundaria: '',
      carteira_terciaria: '',
      status_geral: 'Planejamento',
      status_visao_gp: 'Verde',
      probabilidade_riscos: 'Baixo',
      impacto_riscos: 'Baixo',
      backlog: '',
      bloqueios_atuais: '',
      entregas_realizadas: '',
      proximas_entregas: '',
      marcos_projeto: '',
      riscos_identificados: '',
      mudancas_solicitadas: '',
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

  const handleCarteiraChange = (carteira: string) => {
    setCarteiraSelecionada(carteira);
    form.setValue('carteira_primaria', carteira);
    // Reset projeto when carteira changes
    setProjetoSelecionado(null);
    form.setValue('projeto_id', 0);
  };

  const handleProjetoChange = (projetoId: number) => {
    setProjetoSelecionado(projetoId);
    form.setValue('projeto_id', projetoId);
  };

  const onSubmit = async (data: StatusFormData) => {
    if (!usuario) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const statusData = {
        projeto_id: data.projeto_id,
        carteira_primaria: data.carteira_primaria,
        carteira_secundaria: data.carteira_secundaria || null,
        carteira_terciaria: data.carteira_terciaria || null,
        status_geral: data.status_geral,
        status_visao_gp: data.status_visao_gp,
        probabilidade_riscos: data.probabilidade_riscos,
        impacto_riscos: data.impacto_riscos,
        backlog: data.backlog || null,
        bloqueios_atuais: data.bloqueios_atuais || null,
        entregas_realizadas: data.entregas_realizadas || null,
        proximas_entregas: data.proximas_entregas || null,
        marcos_projeto: data.marcos_projeto || null,
        riscos_identificados: data.riscos_identificados || null,
        mudancas_solicitadas: data.mudancas_solicitadas || null,
        observacoes_gerais: data.observacoes_gerais || null,
        marco1_nome: data.marco1_nome,
        marco1_data: data.marco1_data,
        marco1_responsavel: data.marco1_responsavel,
        marco2_nome: data.marco2_nome || null,
        marco2_data: data.marco2_data || null,
        marco2_responsavel: data.marco2_responsavel || null,
        marco3_nome: data.marco3_nome || null,
        marco3_data: data.marco3_data || null,
        marco3_responsavel: data.marco3_responsavel || null,
        criado_por: usuario.nome,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString().split('T')[0], // Only date part
      };

      const { error } = await supabase
        .from('status_projeto')
        .insert(statusData);

      if (error) {
        console.error('Erro ao criar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar status. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Status criado",
        description: "Status criado com sucesso!",
      });

      form.reset();
      setProjetoSelecionado(null);
      setCarteiraSelecionada('');
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
    projetoSelecionado,
    carteiraSelecionada,
    handleCarteiraChange,
    handleProjetoChange,
  };
}

