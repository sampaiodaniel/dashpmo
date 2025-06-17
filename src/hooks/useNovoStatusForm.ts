
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { useProjetos } from './useProjetos';
import { useCarteiraOverview } from './useCarteiraOverview';

const statusFormSchema = z.object({
  projeto_id: z.number().min(1, "Projeto é obrigatório"),
  status_geral: z.string().min(1, "Status geral é obrigatório"),
  status_visao_gp: z.string().min(1, "Visão GP é obrigatória"),
  probabilidade_riscos: z.string().min(1, "Probabilidade de riscos é obrigatória"),
  impacto_riscos: z.string().min(1, "Impacto de riscos é obrigatório"),
  entregas_realizadas: z.string().min(1, "Itens trabalhados na semana é obrigatório"),
  backlog: z.string().optional(),
  bloqueios_atuais: z.string().optional(),
  observacoes_gerais: z.string().optional(),
  marco1_nome: z.string().min(1, "Nome da entrega do Marco 1 é obrigatório"),
  marco1_data: z.string().min(1, "Data de entrega do Marco 1 é obrigatória"),
  marco1_responsavel: z.string().min(1, "Entregáveis do Marco 1 são obrigatórios"),
  marco2_nome: z.string().optional(),
  marco2_data: z.string().optional(),
  marco2_responsavel: z.string().optional(),
  marco3_nome: z.string().optional(),
  marco3_data: z.string().optional(),
  marco3_responsavel: z.string().optional(),
});

type StatusFormData = z.infer<typeof statusFormSchema>;

export function useNovoStatusForm() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('');
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | null>(null);
  const [progressoEstimado, setProgressoEstimado] = useState<number>(5); // Default to 5% instead of 0

  const { data: carteiras } = useCarteiraOverview();
  const { data: projetos } = useProjetos();

  const projetosFiltrados = projetos?.filter(p => 
    !carteiraSelecionada || carteiraSelecionada === 'todas' || p.area_responsavel === carteiraSelecionada
  ) || [];

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status_geral: '',
      status_visao_gp: '',
      probabilidade_riscos: '',
      impacto_riscos: '',
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

  const onSubmit = async (data: StatusFormData) => {
    console.log('Form data submitted:', data);
    console.log('Projeto selecionado:', projetoSelecionado);
    console.log('Progresso estimado:', progressoEstimado);

    if (!usuario) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    if (!projetoSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um projeto",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const statusData = {
        criado_por: usuario.nome,
        aprovado: false, // Set to false instead of null
        projeto_id: projetoSelecionado,
        status_geral: data.status_geral as "Aguardando Aprovação" | "Aguardando Homologação" | "Cancelado" | "Concluído" | "Em Andamento" | "Em Especificação" | "Pausado" | "Planejamento",
        status_visao_gp: data.status_visao_gp as "Verde" | "Amarelo" | "Vermelho",
        realizado_semana_atual: data.entregas_realizadas,
        backlog: data.backlog || null,
        bloqueios_atuais: data.bloqueios_atuais || null,
        observacoes_pontos_atencao: data.observacoes_gerais || null,
        probabilidade_riscos: data.probabilidade_riscos as "Baixo" | "Médio" | "Alto",
        impacto_riscos: data.impacto_riscos as "Baixo" | "Médio" | "Alto",
        entrega1: data.marco1_nome,
        data_marco1: data.marco1_data || null,
        entregaveis1: data.marco1_responsavel,
        entrega2: data.marco2_nome || null,
        data_marco2: data.marco2_data || null,
        entregaveis2: data.marco2_responsavel || null,
        entrega3: data.marco3_nome || null,
        data_marco3: data.marco3_data || null,
        entregaveis3: data.marco3_responsavel || null,
        progresso_estimado: progressoEstimado,
      };

      console.log('Dados do status a serem enviados:', statusData);

      const { data: insertedData, error } = await supabase
        .from('status_projeto')
        .insert([statusData])
        .select();

      if (error) {
        console.error('Erro ao criar status:', error);
        toast({
          title: "Erro ao criar status",
          description: error.message || "Ocorreu um erro ao salvar o status. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      console.log('Status criado com sucesso:', insertedData);

      toast({
        title: "Status criado com sucesso!",
        description: "O status do projeto foi registrado.",
      });

      navigate('/status');
    } catch (error) {
      console.error('Erro inesperado ao salvar status:', error);
      toast({
        title: "Erro ao criar status",
        description: "Ocorreu um erro inesperado ao salvar o status. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCarteiraChange = (carteira: string) => {
    console.log('Carteira changed to:', carteira);
    setCarteiraSelecionada(carteira);
    setProjetoSelecionado(null);
    form.setValue('projeto_id', 0);
  };

  const handleProjetoChange = (projetoId: number) => {
    console.log('Projeto changed to:', projetoId);
    setProjetoSelecionado(projetoId);
    form.setValue('projeto_id', projetoId);
  };

  const handleProgressoChange = (progresso: number) => {
    console.log('Progresso changed to:', progresso);
    setProgressoEstimado(progresso);
  };

  return {
    form,
    isLoading: isSubmitting,
    onSubmit,
    projetoSelecionado,
    carteiraSelecionada,
    progressoEstimado,
    handleCarteiraChange,
    handleProjetoChange,
    handleProgressoChange,
    projetos: projetosFiltrados,
    carteiras: carteiras || [],
  };
}
