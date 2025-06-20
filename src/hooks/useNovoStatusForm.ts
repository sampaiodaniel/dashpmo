import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useLogger } from '@/utils/logger';
import { EntregaDinamica } from '@/components/forms/EntregasDinamicasNovo';

const statusFormSchema = z.object({
  projeto_id: z.number().min(1, "Projeto é obrigatório"),
  status_geral: z.enum(['Planejamento', 'Em Andamento', 'Pausado', 'Concluído', 'Cancelado', 'Aguardando Aprovação', 'Aguardando Homologação', 'Em Especificação'], {
    required_error: "Status geral é obrigatório",
  }),
  status_visao_gp: z.enum(['Verde', 'Amarelo', 'Vermelho'], {
    required_error: "Visão Chefe do Projeto é obrigatória",
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
});

type StatusFormData = z.infer<typeof statusFormSchema>;

export function useNovoStatusForm() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { log } = useLogger();
  const [searchParams] = useSearchParams();
  
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('');
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | null>(null);
  const [progressoEstimado, setProgressoEstimado] = useState(0);
  const [entregas, setEntregas] = useState<EntregaDinamica[]>([
    { id: '1', nome: '', data: null, entregaveis: '' }
  ]);

  // Verificar se há um projeto especificado na URL
  const projetoIdFromUrl = searchParams.get('projeto');

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      progresso_estimado: 0,
      entregas_realizadas: '',
      backlog: '',
      bloqueios_atuais: '',
      observacoes_gerais: '',
    },
  });

  // Buscar último status do projeto quando projetoSelecionado ou projetoIdFromUrl mudar
  const { data: ultimoStatus } = useQuery({
    queryKey: ['ultimo-status', projetoSelecionado || projetoIdFromUrl],
    queryFn: async () => {
      const projetoId = projetoSelecionado || (projetoIdFromUrl ? parseInt(projetoIdFromUrl) : null);
      if (!projetoId) return null;

      console.log('🔍 Buscando último status para projeto:', projetoId);

      const { data, error } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos(*)
        `)
        .eq('projeto_id', projetoId)
        .order('data_atualizacao', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar último status:', error);
        return null;
      }

      console.log('📋 Último status encontrado:', data);
      return data;
    },
    enabled: !!(projetoSelecionado || projetoIdFromUrl),
  });

  // Verificar se último status não foi validado
  const temStatusNaoValidado = ultimoStatus && !ultimoStatus.aprovado;

  // Pré-preencher formulário quando último status for carregado
  useEffect(() => {
    if (ultimoStatus) {
      console.log('🔄 Preenchendo formulário com dados do último status');
      
      // Definir carteira e projeto
      if (ultimoStatus.projeto?.area_responsavel) {
        setCarteiraSelecionada(ultimoStatus.projeto.area_responsavel);
      }
      
      const projetoId = ultimoStatus.projeto_id;
      setProjetoSelecionado(projetoId);
      form.setValue('projeto_id', projetoId);

      // Preencher campos do formulário com dados do último status
      form.setValue('status_geral', ultimoStatus.status_geral);
      form.setValue('status_visao_gp', ultimoStatus.status_visao_gp);
      form.setValue('probabilidade_riscos', ultimoStatus.probabilidade_riscos);
      form.setValue('impacto_riscos', ultimoStatus.impacto_riscos);
      
      // Preencher progresso (limpar para nova atualização)
      const novoProgresso = (ultimoStatus.progresso_estimado || 0);
      setProgressoEstimado(novoProgresso);
      form.setValue('progresso_estimado', novoProgresso);

      // Preencher backlog e observações (manter para continuidade)
      form.setValue('backlog', ultimoStatus.backlog || '');
      form.setValue('observacoes_gerais', ultimoStatus.observacoes_pontos_atencao || '');

      // Limpar campos que devem ser atualizados semanalmente
      form.setValue('entregas_realizadas', '');
      form.setValue('bloqueios_atuais', '');

      // Preencher entregas com base no último status
      const entregasPreenchidas: EntregaDinamica[] = [];
      
      if (ultimoStatus.entrega1) {
        entregasPreenchidas.push({
          id: '1',
          nome: ultimoStatus.entrega1,
          data: ultimoStatus.data_marco1 ? new Date(ultimoStatus.data_marco1) : null,
          entregaveis: ultimoStatus.entregaveis1 || ''
        });
      }
      
      if (ultimoStatus.entrega2) {
        entregasPreenchidas.push({
          id: '2',
          nome: ultimoStatus.entrega2,
          data: ultimoStatus.data_marco2 ? new Date(ultimoStatus.data_marco2) : null,
          entregaveis: ultimoStatus.entregaveis2 || ''
        });
      }
      
      if (ultimoStatus.entrega3) {
        entregasPreenchidas.push({
          id: '3',
          nome: ultimoStatus.entrega3,
          data: ultimoStatus.data_marco3 ? new Date(ultimoStatus.data_marco3) : null,
          entregaveis: ultimoStatus.entregaveis3 || ''
        });
      }

      // Se não houver entregas, criar uma vazia
      if (entregasPreenchidas.length === 0) {
        entregasPreenchidas.push({ id: '1', nome: '', data: null, entregaveis: '' });
      }

      setEntregas(entregasPreenchidas);

      console.log('✅ Formulário preenchido com sucesso');
    }
  }, [ultimoStatus, form]);

  // Pré-selecionar projeto se especificado na URL
  useEffect(() => {
    if (projetoIdFromUrl && !projetoSelecionado) {
      const projetoId = parseInt(projetoIdFromUrl);
      setProjetoSelecionado(projetoId);
      form.setValue('projeto_id', projetoId);
    }
  }, [projetoIdFromUrl, projetoSelecionado, form]);

  const mutation = useMutation({
    mutationFn: async (data: StatusFormData) => {
      if (!usuario || !projetoSelecionado) {
        throw new Error('Usuário não autenticado ou projeto não selecionado');
      }

      // Validar primeira entrega
      const primeiraEntrega = entregas[0];
      if (!primeiraEntrega?.nome || !primeiraEntrega?.entregaveis) {
        throw new Error('A primeira entrega é obrigatória');
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
        entrega1: entregas[0]?.nome || null,
        data_marco1: entregas[0]?.data ? entregas[0].data.toISOString().split('T')[0] : null,
        entregaveis1: entregas[0]?.entregaveis || null,
        entrega2: entregas[1]?.nome || null,
        data_marco2: entregas[1]?.data ? entregas[1].data.toISOString().split('T')[0] : null,
        entregaveis2: entregas[1]?.entregaveis || null,
        entrega3: entregas[2]?.nome || null,
        data_marco3: entregas[2]?.data ? entregas[2].data.toISOString().split('T')[0] : null,
        entregaveis3: entregas[2]?.entregaveis || null,
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

      // Salvar entregas extras se houver
      if (entregas.length > 3) {
        const entregasExtras = entregas.slice(3);
        for (const entrega of entregasExtras) {
          if (entrega.nome) {
            await supabase
              .from('entregas_status')
              .insert({
                status_id: novoStatus.id,
                nome_entrega: entrega.nome,
                data_entrega: entrega.data ? entrega.data.toISOString().split('T')[0] : null,
                entregaveis: entrega.entregaveis,
                ordem: entregas.indexOf(entrega) + 1
              });
          }
        }
      }

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
          progresso_estimado: novoStatus.progresso_estimado,
          total_entregas: entregas.length
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
        description: error.message || "Erro ao criar status. Tente novamente.",
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
    entregas,
    setEntregas,
    handleCarteiraChange,
    handleProjetoChange,
    handleProgressoChange,
    temStatusNaoValidado,
    ultimoStatus,
  };
}
