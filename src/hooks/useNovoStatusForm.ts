import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useLogger } from '@/utils/logger';
import { EntregaDinamica } from '@/components/forms/EntregasDinamicasNovo';
import { useStatusGeral, useStatusVisaoGP, useNiveisRisco } from './useListaValores';
import { calcularMatrizRisco } from '@/utils/riskMatrixCalculator';

// Função para verificar se os campos de status_entrega existem
async function verificarCamposStatusEntrega() {
  try {
    console.log('🔍 Verificando se campos de status_entrega existem...');
    
    const { data, error } = await supabase
      .from('status_projeto')
      .select('status_entrega1_id')
      .limit(1);
    
    console.log('📊 Resultado da verificação:', { data, error });
    
    // Se o erro for sobre coluna não existir, retornar false
    if (error && error.message && error.message.includes('column') && error.message.includes('does not exist')) {
      console.log('❌ Campos de status_entrega não existem na tabela');
      return false;
    }
    
    // Se não deu erro, os campos existem
    const existe = !error;
    console.log('✅ Campos existem:', existe);
    return existe;
  } catch (error) {
    console.log('❌ Erro ao verificar campos de status_entrega:', error);
    return false;
  }
}

// Schema dinâmico que será criado com base nos dados do banco
const createStatusFormSchema = (statusGeral: string[], statusVisaoGP: string[], niveisRisco: string[]) => {
  // Usar valores padrão se as listas não estiverem carregadas ainda
  const statusGeralOptions = statusGeral.length > 0 ? statusGeral : [
    'Aguardando Aprovação', 'Aguardando Homologação', 'Cancelado', 'Concluído', 
    'Em Andamento', 'Em Especificação', 'Pausado', 'Planejamento'
  ];
  
  const statusVisaoGPOptions = statusVisaoGP.length > 0 ? statusVisaoGP : ['Verde', 'Amarelo', 'Vermelho'];
  
  const niveisRiscoOptions = niveisRisco.length > 0 ? niveisRisco : ['Baixo', 'Médio', 'Alto'];
  
  return z.object({
    projeto_id: z.number().min(1, "Selecione um projeto"),
    data_status: z.union([
      z.string().min(1, "Selecione a data do status"),
      z.date()
    ]).transform((val) => {
      if (typeof val === 'string') return val;
      // Converter Date para string no formato YYYY-MM-DD sem timezone
      const year = val.getFullYear();
      const month = String(val.getMonth() + 1).padStart(2, '0');
      const day = String(val.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }),
    status_geral: z.enum(statusGeralOptions as [string, ...string[]], {
      required_error: "Selecione o status geral do projeto",
    }),
    status_visao_gp: z.enum(statusVisaoGPOptions as [string, ...string[]], {
      required_error: "Selecione a visão do chefe do projeto",
    }),
    progresso_estimado: z.number().min(0, "O progresso deve ser no mínimo 0%").max(100, "O progresso deve ser no máximo 100%"),
    probabilidade_riscos: z.enum(niveisRiscoOptions as [string, ...string[]], {
      required_error: "Selecione a probabilidade de riscos",
    }),
    impacto_riscos: z.enum(niveisRiscoOptions as [string, ...string[]], {
      required_error: "Selecione o impacto dos riscos",
    }),
    entregas_realizadas: z.string().optional().default(""),
    backlog: z.string().optional(),
    bloqueios_atuais: z.string().optional(),
    observacoes_gerais: z.string().optional(),
  });
};

export function useNovoStatusForm() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projetoIdFromUrl = searchParams.get('projeto');
  const { log } = useLogger();
  const queryClient = useQueryClient();
  
  // Buscar listas de valores para validação dinâmica
  const { data: statusGeral = [], isLoading: isLoadingStatusGeral } = useStatusGeral();
  const { data: statusVisaoGP = [], isLoading: isLoadingStatusVisaoGP } = useStatusVisaoGP();
  const { data: niveisRisco = [], isLoading: isLoadingNiveisRisco } = useNiveisRisco();
  
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('');
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | null>(null);
  const [progressoEstimado, setProgressoEstimado] = useState(0);
  const [entregas, setEntregas] = useState<EntregaDinamica[]>([
    { id: '1', nome: '', data: null, entregaveis: '', statusEntregaId: null }
  ]);
  const [camposStatusEntregaExistem, setCamposStatusEntregaExistem] = useState(true);

  // Verificar se todas as listas foram carregadas
  const isLoadingListas = isLoadingStatusGeral || isLoadingStatusVisaoGP || isLoadingNiveisRisco;
  
  // Criar schema dinâmico quando as listas estiverem carregadas
  const statusFormSchema = createStatusFormSchema(statusGeral, statusVisaoGP, niveisRisco);
  type StatusFormData = z.infer<typeof statusFormSchema>;

  console.log('📊 Status do carregamento das listas:', {
    statusGeral: statusGeral.length,
    statusVisaoGP: statusVisaoGP.length,
    niveisRisco: niveisRisco.length,
    isLoadingListas
  });

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      projeto_id: 0,
      data_status: (() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
      status_geral: '',
      status_visao_gp: '',
      progresso_estimado: 0,
      probabilidade_riscos: '',
      impacto_riscos: '',
      entregas_realizadas: '',
      backlog: '',
      bloqueios_atuais: '',
      observacoes_gerais: '',
    },
  });

  // Verificar se os campos de status_entrega existem no banco
  useEffect(() => {
    const verificarCampos = async () => {
      console.log('🚀 Iniciando verificação de campos de status entrega...');
      const existe = await verificarCamposStatusEntrega();
      console.log('🎯 Campos de status entrega existem:', existe);
      setCamposStatusEntregaExistem(existe);
    };
    verificarCampos();
  }, []);

  // Buscar último status do projeto quando projetoSelecionado ou projetoIdFromUrl mudar
  const { data: ultimoStatus, isLoading: isLoadingUltimoStatus, refetch: refetchUltimoStatus } = useQuery({
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
    staleTime: 0, // Sempre considerar dados como obsoletos
    gcTime: 0, // Não manter cache
    refetchOnMount: true, // Sempre refetch ao montar
    refetchOnWindowFocus: false, // Não refetch quando foca na janela
    retry: 1, // Tentar apenas uma vez se falhar
  });

  // Verificar se último status não foi validado
  const temStatusNaoValidado = ultimoStatus && !ultimoStatus.aprovado;

  // Pré-preencher formulário quando último status for carregado
  useEffect(() => {
    if (ultimoStatus && ultimoStatus.id) {
      console.log('🔄 Preenchendo formulário com dados do último status');
      console.log('📋 Dados do projeto no último status:', ultimoStatus.projeto);
      console.log('📋 Area responsável:', ultimoStatus.projeto?.area_responsavel);
      console.log('📋 Carteira primária:', ultimoStatus.projeto?.carteira_primaria);
      console.log('📋 Nome do projeto:', ultimoStatus.projeto?.nome_projeto);
      
      // Definir carteira e projeto
      const carteiraParaUsar = ultimoStatus.projeto?.carteira_primaria || ultimoStatus.projeto?.area_responsavel;
      if (carteiraParaUsar) {
        console.log('🎯 Definindo carteira como:', carteiraParaUsar);
        setCarteiraSelecionada(carteiraParaUsar);
      } else {
        console.warn('⚠️ Nenhuma carteira encontrada no projeto');
      }
      
      const projetoId = ultimoStatus.projeto_id;
      console.log('🎯 Definindo projeto ID como:', projetoId);
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
          entregaveis: ultimoStatus.entregaveis1 || '',
          statusEntregaId: (ultimoStatus as any).status_entrega1_id || null
        });
      }
      
      if (ultimoStatus.entrega2) {
        entregasPreenchidas.push({
          id: '2',
          nome: ultimoStatus.entrega2,
          data: ultimoStatus.data_marco2 ? new Date(ultimoStatus.data_marco2) : null,
          entregaveis: ultimoStatus.entregaveis2 || '',
          statusEntregaId: (ultimoStatus as any).status_entrega2_id || null
        });
      }
      
      if (ultimoStatus.entrega3) {
        entregasPreenchidas.push({
          id: '3',
          nome: ultimoStatus.entrega3,
          data: ultimoStatus.data_marco3 ? new Date(ultimoStatus.data_marco3) : null,
          entregaveis: ultimoStatus.entregaveis3 || '',
          statusEntregaId: (ultimoStatus as any).status_entrega3_id || null
        });
      }

      // Se não houver entregas, criar uma vazia
      if (entregasPreenchidas.length === 0) {
        entregasPreenchidas.push({ id: '1', nome: '', data: null, entregaveis: '', statusEntregaId: null });
      }

      setEntregas(entregasPreenchidas);

      console.log('✅ Formulário preenchido com sucesso');
      console.log('📊 Estados finais:', {
        carteiraSelecionada: carteiraParaUsar,
        projetoSelecionado: projetoId,
        projeto_id_form: form.getValues('projeto_id')
      });
    }
  }, [ultimoStatus?.id]);

  // Pré-selecionar projeto se especificado na URL
  useEffect(() => {
    console.log('🔍 Verificando projetoIdFromUrl:', projetoIdFromUrl);
    console.log('🔍 Projeto já selecionado:', projetoSelecionado);
    
    if (projetoIdFromUrl) {
      const projetoId = parseInt(projetoIdFromUrl);
      console.log('🎯 Definindo projeto da URL como selecionado:', projetoId);
      
      // Invalidar queries para garantir dados frescos
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      queryClient.invalidateQueries({ queryKey: ['ultimo-status', projetoId] });
      
      // Definir projeto imediatamente
      if (projetoSelecionado !== projetoId) {
        setProjetoSelecionado(projetoId);
        form.setValue('projeto_id', projetoId);
      }
    }
  }, [projetoIdFromUrl, queryClient, form]);

  // Segundo useEffect separado para garantir que a query seja refeita quando projeto muda
  useEffect(() => {
    if (projetoSelecionado && projetoIdFromUrl) {
      const projetoId = parseInt(projetoIdFromUrl);
      if (projetoSelecionado === projetoId) {
        console.log('🔄 Forçando refetch do último status para projeto:', projetoId);
        // Usar tanto invalidação quanto refetch direto
        queryClient.invalidateQueries({ queryKey: ['ultimo-status', projetoId] });
        refetchUltimoStatus();
      }
    }
  }, [projetoSelecionado, projetoIdFromUrl, queryClient, refetchUltimoStatus]);

  // Terceiro useEffect para garantir preenchimento quando navegando via URL
  useEffect(() => {
    if (projetoIdFromUrl && ultimoStatus && ultimoStatus.projeto) {
      const projetoIdUrl = parseInt(projetoIdFromUrl);
      if (ultimoStatus.projeto_id === projetoIdUrl) {
        console.log('🎯 Forçando preenchimento do formulário via URL');
        
        // Definir carteira
        const carteiraParaUsar = ultimoStatus.projeto?.carteira_primaria || ultimoStatus.projeto?.area_responsavel;
        if (carteiraParaUsar && !carteiraSelecionada) {
          console.log('🎯 Definindo carteira via URL:', carteiraParaUsar);
          setCarteiraSelecionada(carteiraParaUsar);
        }
        
        // Definir projeto se ainda não foi definido
        if (!projetoSelecionado || projetoSelecionado !== projetoIdUrl) {
          console.log('🎯 Definindo projeto via URL:', projetoIdUrl);
          setProjetoSelecionado(projetoIdUrl);
          form.setValue('projeto_id', projetoIdUrl);
        }
      }
    }
  }, [projetoIdFromUrl, ultimoStatus, carteiraSelecionada, projetoSelecionado, form]);

  const mutation = useMutation({
    mutationFn: async (data: StatusFormData) => {
      console.log('🚀 INICIANDO MUTATION - Dados recebidos:', data);
      console.log('👤 Usuário atual:', usuario);
      console.log('🎯 Projeto selecionado ID:', projetoSelecionado);
      
      if (!usuario) {
        throw new Error('Você precisa estar logado para criar um status');
      }

      if (!projetoSelecionado) {
        throw new Error('Selecione um projeto antes de continuar');
      }

      // Validar primeira entrega
      const primeiraEntrega = entregas[0];
      console.log('🎯 Validando primeira entrega:', primeiraEntrega);
      
      if (!primeiraEntrega?.nome || !primeiraEntrega?.entregaveis) {
        console.error('❌ Primeira entrega inválida:', {
          nome: primeiraEntrega?.nome,
          entregaveis: primeiraEntrega?.entregaveis
        });
        throw new Error('Preencha pelo menos a primeira entrega com nome e entregáveis');
      }
      
      console.log('✅ Primeira entrega válida');

      console.log('📝 Criando status:', data);

      // Buscar dados do projeto para preencher campos adicionais
      const { data: projeto, error: projetoError } = await supabase
        .from('projetos')
        .select('*')
        .eq('id', projetoSelecionado)
        .single();

      if (projetoError) {
        console.error('Erro ao buscar projeto:', projetoError);
        throw new Error('Não foi possível encontrar as informações do projeto selecionado');
      }

      // Mapeamento dinâmico baseado nos ENUMs reais do banco
      const enumsValidos = {
        status_geral: ['Aguardando Aprovação', 'Aguardando Homologação', 'Cancelado', 'Concluído', 'Em Andamento', 'Em Especificação', 'Pausado', 'Planejamento'],
        status_visao_gp: ['Verde', 'Amarelo', 'Vermelho'],
        nivel_risco: ['Baixo', 'Médio', 'Alto']
      };

      // Função inteligente de mapeamento que tenta encontrar correspondência
      const mapearValorInteligente = (valor: string, enumsValidos: string[]): string => {
        // Se o valor exato existe, usa ele
        if (enumsValidos.includes(valor)) {
          return valor;
        }
        
        // Tenta encontrar correspondência por similaridade (case-insensitive)
        const valorLower = valor.toLowerCase();
        const match = enumsValidos.find(enumVal => 
          enumVal.toLowerCase() === valorLower || 
          enumVal.toLowerCase().includes(valorLower) ||
          valorLower.includes(enumVal.toLowerCase())
        );
        
        if (match) {
          console.log(`🔄 Mapeamento automático: "${valor}" → "${match}"`);
          return match;
        }
        
        // Mapeamentos especiais conhecidos (para compatibilidade)
        const mapeamentosEspeciais: Record<string, string> = {
          'Em Planejamento': 'Planejamento',
          'Planejando': 'Planejamento',
          'Planning': 'Planejamento'
        };
        
        if (mapeamentosEspeciais[valor]) {
          const valorMapeado = mapeamentosEspeciais[valor];
          if (enumsValidos.includes(valorMapeado)) {
            console.log(`🔄 Mapeamento especial: "${valor}" → "${valorMapeado}"`);
            return valorMapeado;
          }
        }
        
        // Se não encontrou correspondência, mantém o valor original e avisa
        console.warn(`⚠️ Valor "${valor}" não encontrou correspondência nos ENUMs válidos:`, enumsValidos);
        return valor;
      };

      const statusData = {
        projeto_id: projetoSelecionado,
        data_atualizacao: data.data_status,
        status_geral: mapearValorInteligente(data.status_geral, enumsValidos.status_geral) as Database['public']['Enums']['status_geral'],
        status_visao_gp: mapearValorInteligente(data.status_visao_gp, enumsValidos.status_visao_gp) as Database['public']['Enums']['status_visao_gp'],
        progresso_estimado: progressoEstimado,
        probabilidade_riscos: mapearValorInteligente(data.probabilidade_riscos, enumsValidos.nivel_risco) as Database['public']['Enums']['nivel_risco'],
        impacto_riscos: mapearValorInteligente(data.impacto_riscos, enumsValidos.nivel_risco) as Database['public']['Enums']['nivel_risco'],
        realizado_semana_atual: data.entregas_realizadas || 'Atualização de status regular - sem itens específicos',
        backlog: data.backlog || null,
        bloqueios_atuais: data.bloqueios_atuais || null,
        observacoes_pontos_atencao: data.observacoes_gerais || null,
        entrega1: entregas[0]?.nome || null,
        data_marco1: entregas[0]?.data ? (() => {
          const date = entregas[0].data;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        })() : null,
        entregaveis1: entregas[0]?.entregaveis || null,
        ...(camposStatusEntregaExistem && { status_entrega1_id: entregas[0]?.statusEntregaId || null }),
        entrega2: entregas[1]?.nome || null,
        data_marco2: entregas[1]?.data ? (() => {
          const date = entregas[1].data;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        })() : null,
        entregaveis2: entregas[1]?.entregaveis || null,
        ...(camposStatusEntregaExistem && { status_entrega2_id: entregas[1]?.statusEntregaId || null }),
        entrega3: entregas[2]?.nome || null,
        data_marco3: entregas[2]?.data ? (() => {
          const date = entregas[2].data;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        })() : null,
        entregaveis3: entregas[2]?.entregaveis || null,
        ...(camposStatusEntregaExistem && { status_entrega3_id: entregas[2]?.statusEntregaId || null }),
        criado_por: usuario.nome,
        responsavel_asa: projeto.responsavel_asa,
        responsavel_cwi: projeto.responsavel_cwi,
        gp_responsavel_cwi: projeto.gp_responsavel_cwi,
        carteira_primaria: projeto.carteira_primaria,
        carteira_secundaria: projeto.carteira_secundaria,
        carteira_terciaria: projeto.carteira_terciaria,
      };

      console.log('📋 Dados que serão enviados para o Supabase:', statusData);
      console.log('🎯 Projeto completo:', projeto);
      console.log('🔧 Campos de status entrega existem:', camposStatusEntregaExistem);
      
      if (!camposStatusEntregaExistem) {
        console.log('⚠️ Campos de status_entrega não existem na tabela, salvando sem eles');
      } else {
        console.log('✅ Campos de status_entrega existem, incluindo no salvamento');
      }
      
      // Validar dados críticos antes de enviar
      const camposObrigatorios = {
        projeto_id: statusData.projeto_id,
        data_atualizacao: statusData.data_atualizacao,
        status_geral: statusData.status_geral,
        status_visao_gp: statusData.status_visao_gp,
        probabilidade_riscos: statusData.probabilidade_riscos,
        impacto_riscos: statusData.impacto_riscos,
        criado_por: statusData.criado_por
      };
      
      console.log('🔍 Validando campos obrigatórios:', camposObrigatorios);
      
      // Log detalhado dos valores ENUM para debug
      console.log('🔍 Debug ENUM Values:');
      console.log('  - status_geral original:', data.status_geral, '→ mapeado:', statusData.status_geral);
      console.log('  - status_visao_gp original:', data.status_visao_gp, '→ mapeado:', statusData.status_visao_gp);
      console.log('  - probabilidade_riscos original:', data.probabilidade_riscos, '→ mapeado:', statusData.probabilidade_riscos);
      console.log('  - impacto_riscos original:', data.impacto_riscos, '→ mapeado:', statusData.impacto_riscos);
      
      // ⚠️ IMPORTANTE: Se você alterar nomes na administração que não correspondem aos ENUMs do banco,
      // adicione-os na seção 'mapeamentosEspeciais' acima para garantir compatibilidade.
      // 
      // Os ENUMs do banco são fixos e definidos nas migrações SQL:
      // - status_geral: ['Aguardando Aprovação', 'Aguardando Homologação', 'Cancelado', 'Concluído', 'Em Andamento', 'Em Especificação', 'Pausado', 'Planejamento']
      // - status_visao_gp: ['Verde', 'Amarelo', 'Vermelho'] 
      // - nivel_risco: ['Baixo', 'Médio', 'Alto']
      
      // Verificar se os valores correspondem aos ENUMs esperados
      console.log('🎯 Validação ENUM:');
      console.log('  - status_geral válido:', enumsValidos.status_geral.includes(statusData.status_geral));
      console.log('  - status_visao_gp válido:', enumsValidos.status_visao_gp.includes(statusData.status_visao_gp));
      console.log('  - probabilidade_riscos válido:', enumsValidos.nivel_risco.includes(statusData.probabilidade_riscos));
      console.log('  - impacto_riscos válido:', enumsValidos.nivel_risco.includes(statusData.impacto_riscos));
      
      // Validar ENUMs antes de enviar
      if (!enumsValidos.status_geral.includes(statusData.status_geral)) {
        throw new Error(`Status geral inválido: "${statusData.status_geral}". Valores aceitos: ${enumsValidos.status_geral.join(', ')}`);
      }
      if (!enumsValidos.status_visao_gp.includes(statusData.status_visao_gp)) {
        throw new Error(`Status visão GP inválido: "${statusData.status_visao_gp}". Valores aceitos: ${enumsValidos.status_visao_gp.join(', ')}`);
      }
      if (!enumsValidos.nivel_risco.includes(statusData.probabilidade_riscos)) {
        throw new Error(`Probabilidade de risco inválida: "${statusData.probabilidade_riscos}". Valores aceitos: ${enumsValidos.nivel_risco.join(', ')}`);
      }
      if (!enumsValidos.nivel_risco.includes(statusData.impacto_riscos)) {
        throw new Error(`Impacto de risco inválido: "${statusData.impacto_riscos}". Valores aceitos: ${enumsValidos.nivel_risco.join(', ')}`);
      }
      
      console.log('✅ Todas as validações ENUM passaram');
      
      for (const [campo, valor] of Object.entries(camposObrigatorios)) {
        if (!valor && valor !== 0) {
          console.error(`❌ Campo obrigatório vazio: ${campo} = ${valor}`);
          throw new Error(`Campo obrigatório não preenchido: ${campo}`);
        }
      }

      const { data: novoStatus, error } = await supabase
        .from('status_projeto')
        .insert(statusData)
        .select('*, projeto:projetos(*)')
        .single();

      if (error) {
        console.error('❌ ERRO DETALHADO DO SUPABASE:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error details:', error.details);
        console.error('❌ Error hint:', error.hint);
        console.error('❌ Error code:', error.code);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        console.error('❌ Status data que causou erro:', JSON.stringify(statusData, null, 2));
        
        if (error.message?.includes('duplicate key')) {
          throw new Error('Já existe um status para este projeto nesta data. Escolha uma data diferente.');
        } else if (error.message?.includes('foreign key')) {
          throw new Error('Erro de referência: verifique se o projeto selecionado ainda existe.');
        } else if (error.message?.includes('violates check constraint')) {
          throw new Error('Dados inválidos: verifique se todos os campos estão preenchidos corretamente.');
        } else if (error.message?.includes('enum')) {
          throw new Error(`Valor inválido de enum: ${error.message}`);
        } else {
          throw new Error(`Erro do banco: ${error.message || 'Não foi possível salvar o status.'}`);
        }
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
                data_entrega: entrega.data ? (() => {
                  const date = entrega.data;
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                })() : null,
                entregaveis: entrega.entregaveis,
                ...(camposStatusEntregaExistem && { status_entrega_id: entrega.statusEntregaId || null }),
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
    onSuccess: async () => {
      // Invalidação robusta - múltiplas estratégias para garantir que dados sejam atualizados
      console.log('✅ Status criado - executando invalidação robusta de cache');
      
      // Estratégia 1: Remover queries específicas
      queryClient.removeQueries({ queryKey: ['projetos'] });
      queryClient.removeQueries({ queryKey: ['ultimo-status'] });
      queryClient.removeQueries({ queryKey: ['status'] });
      
      // Estratégia 2: Invalidar queries relacionadas
      await queryClient.invalidateQueries({ queryKey: ['projetos'] });
      await queryClient.invalidateQueries({ queryKey: ['ultimo-status'] });
      await queryClient.invalidateQueries({ queryKey: ['status'] });
      
      // Estratégia 3: Aguardar um pouco e refetch forçado
      setTimeout(() => {
        console.log('🔄 Executando refetch forçado após criar status');
        queryClient.refetchQueries({ queryKey: ['projetos'] });
      }, 500);

      toast({
        title: "Status criado com sucesso!",
        description: "O status do projeto foi atualizado.",
      });
      
      navigate('/status');
    },
    onError: (error) => {
      console.error('Erro ao criar status:', error);
      toast({
        title: "Erro ao salvar status",
        description: error.message || "Ocorreu um erro inesperado. Verifique os dados preenchidos e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleCarteiraChange = (carteira: string) => {
    console.log('🔄 Mudança de carteira:', carteira);
    setCarteiraSelecionada(carteira);
    setProjetoSelecionado(null);
    form.setValue('projeto_id', 0);
  };

  const handleProjetoChange = (projetoId: number) => {
    console.log('🔄 Mudança de projeto:', projetoId);
    setProjetoSelecionado(projetoId);
    form.setValue('projeto_id', projetoId);
  };

  const handleProgressoChange = (progresso: number) => {
    setProgressoEstimado(progresso);
    form.setValue('progresso_estimado', progresso);
  };

  const onSubmit = (data: StatusFormData) => {
    console.log('🎯 BOTÃO SALVAR CLICADO! Iniciando processo de submissão...');
    console.log('🚀 Iniciando submit do formulário');
    console.log('📊 Dados do formulário:', data);
    console.log('📋 Listas de valores:', { statusGeral, statusVisaoGP, niveisRisco });
    console.log('🎯 Projeto selecionado:', projetoSelecionado);
    console.log('📦 Entregas:', entregas);
    
    // Verificar se o schema foi criado corretamente
    try {
      const validationResult = statusFormSchema.safeParse(data);
      if (!validationResult.success) {
        console.error('❌ Erro de validação do schema:', validationResult.error);
        console.error('❌ Detalhes dos erros:', validationResult.error.issues);
        toast({
          title: "Erro de validação",
          description: `Campos com erro: ${validationResult.error.issues.map(issue => issue.path.join('.')).join(', ')}`,
          variant: "destructive",
        });
        return;
      }
      console.log('✅ Validação do schema passou');
    } catch (schemaError) {
      console.error('❌ Erro ao validar schema:', schemaError);
      toast({
        title: "Erro interno",
        description: "Erro na validação dos dados. Recarregue a página e tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(data);
  };

  return {
    form,
    isLoading: mutation.isPending,
    isLoadingListas,
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
