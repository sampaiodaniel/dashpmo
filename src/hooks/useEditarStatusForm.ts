import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useEntregasDinamicas, Entrega } from '@/hooks/useEntregasDinamicas';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';

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

export function useEditarStatusForm(status: StatusProjeto) {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const { salvarStatusCache, carregarStatusCache, statusEntrega } = useStatusEntrega();
  const [carregando, setCarregando] = useState(false);
  const [statusObrigatorio, setStatusObrigatorio] = useState(false);
  const [entregasCarregadas, setEntregasCarregadas] = useState(false);

  // Verificar se os campos de status_entrega existem
  useEffect(() => {
    const verificarCampos = async () => {
      console.log('🚀 Iniciando verificação de campos...');
      const existe = await verificarCamposStatusEntrega();
      console.log('🎯 StatusObrigatorio definido como:', existe);
      setStatusObrigatorio(existe);
    };
    verificarCampos();
  }, []);

  // Buscar entregas extras da tabela entregas_status
  const { data: entregasExtras = [] } = useQuery({
    queryKey: ['entregas-status', status.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas extras:', error);
        return [];
      }

      return data || [];
    },
  });
  
  // Estados para controlar TBD nos marcos - verificar se é string 'TBD'
  const [marco1TBD, setMarco1TBD] = useState(
    typeof status.data_marco1 === 'string' ? status.data_marco1 === 'TBD' : false
  );
  const [marco2TBD, setMarco2TBD] = useState(
    typeof status.data_marco2 === 'string' ? status.data_marco2 === 'TBD' : false
  );
  const [marco3TBD, setMarco3TBD] = useState(
    typeof status.data_marco3 === 'string' ? status.data_marco3 === 'TBD' : false
  );

  // Estados para as datas dos marcos - só usar Date se não for 'TBD'
  const [dataMarco1, setDataMarco1] = useState<Date | null>(
    (status.data_marco1 && typeof status.data_marco1 !== 'string') ? new Date(status.data_marco1) : null
  );
  const [dataMarco2, setDataMarco2] = useState<Date | null>(
    (status.data_marco2 && typeof status.data_marco2 !== 'string') ? new Date(status.data_marco2) : null
  );
  const [dataMarco3, setDataMarco3] = useState<Date | null>(
    (status.data_marco3 && typeof status.data_marco3 !== 'string') ? new Date(status.data_marco3) : null
  );

  // Inicializar entregas dinâmicas com dados existentes
  const {
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar
  } = useEntregasDinamicas([], statusObrigatorio);

  // Efeito para carregar todas as entregas quando os dados estiverem prontos
  useEffect(() => {
    // Só processar uma vez e quando tiver todos os dados necessários
    if (entregasCarregadas || statusEntrega.length === 0) return;
    
    console.log('🔄 Carregando entregas para edição do status:', status.id);
    console.log('📦 Entregas extras encontradas:', entregasExtras);
    
    // Carregar cache de status se os campos não existirem no banco
    const cacheStatus = carregarStatusCache(status.id);
    console.log('💾 Cache de status carregado:', cacheStatus);
    
    const entregasCompletas: Entrega[] = [];
    const primeiroStatusId = statusEntrega.length > 0 ? statusEntrega[0].id : 1;
    
    // Função auxiliar para processar data
    const processarData = (data: any): string => {
      if (!data) return '';
      if (typeof data === 'string') {
        if (data === 'TBD') return '';
        return data;
      }
      if (data instanceof Date) {
        return data.toISOString().split('T')[0];
      }
      return '';
    };
    
    // Adicionar entregas principais (sempre, mesmo que vazias para manter estrutura)
    for (let i = 1; i <= 3; i++) {
      const entregaKey = `entrega${i}` as keyof typeof status;
      const dataKey = `data_marco${i}` as keyof typeof status;
      const entregaveisKey = `entregaveis${i}` as keyof typeof status;
      const statusCacheKey = `entrega${i}`;
      
      const nomeEntrega = status[entregaKey] as string || '';
      const dataEntrega = processarData(status[dataKey]);
      const entregaveisEntrega = status[entregaveisKey] as string || '';
      
      // Buscar status da entrega
      let statusEntregaId = (status as any)[`status_entrega${i}_id`] || cacheStatus[statusCacheKey] || null;
      if (!statusEntregaId && statusObrigatorio) {
        statusEntregaId = primeiroStatusId;
      }
      
      // Só adicionar se tiver pelo menos nome ou for a primeira entrega
      if (nomeEntrega || i === 1) {
        const entrega: Entrega = {
          id: i.toString(),
          nome: nomeEntrega,
          data: dataEntrega,
          entregaveis: entregaveisEntrega,
          statusEntregaId: statusEntregaId
        };
        entregasCompletas.push(entrega);
        console.log(`📝 Entrega ${i} carregada:`, entrega);
      }
    }
    
    // Adicionar entregas extras da tabela entregas_status
    entregasExtras.forEach((entrega: any, index: number) => {
      let statusEntregaId = entrega.status_entrega_id || cacheStatus[`extra${index + 4}`] || null;
      if (!statusEntregaId && statusObrigatorio) {
        statusEntregaId = primeiroStatusId;
      }
      
      const entregaExtra: Entrega = {
        id: entrega.id.toString(),
        nome: entrega.nome_entrega || '',
        data: entrega.data_entrega || '',
        entregaveis: entrega.entregaveis || '',
        statusEntregaId: statusEntregaId
      };
      entregasCompletas.push(entregaExtra);
      console.log(`📝 Entrega extra ${index + 4} carregada:`, entregaExtra);
    });
    
    // Garantir que sempre temos pelo menos uma entrega
    if (entregasCompletas.length === 0) {
      entregasCompletas.push({ 
        id: '1', 
        nome: '', 
        data: '', 
        entregaveis: '', 
        statusEntregaId: statusObrigatorio ? primeiroStatusId : null 
      });
    }
    
    console.log('✅ Total de entregas carregadas:', entregasCompletas.length);
    setEntregas(entregasCompletas);
    setEntregasCarregadas(true);
  }, [status, entregasExtras, statusEntrega, statusObrigatorio, carregarStatusCache, setEntregas, entregasCarregadas]);
  
  const [formData, setFormData] = useState({
    data_atualizacao: typeof status.data_atualizacao === 'string' 
      ? status.data_atualizacao 
      : status.data_atualizacao 
        ? new Date(status.data_atualizacao).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    status_geral: status.status_geral,
    status_visao_gp: status.status_visao_gp,
    impacto_riscos: status.impacto_riscos,
    probabilidade_riscos: status.probabilidade_riscos,
    realizado_semana_atual: status.realizado_semana_atual || '',
    backlog: status.backlog || '',
    bloqueios_atuais: status.bloqueios_atuais || '',
    observacoes_pontos_atencao: status.observacoes_pontos_atencao || '',
    progresso_estimado: (status as any).progresso_estimado || 0
  });

  const handleInputChange = (field: string, value: string | number | Date | undefined) => {
    let processedValue: string | number;
    
    if (value instanceof Date) {
      // Converter Date para string no formato apropriado dependendo do campo
      if (field === 'data_atualizacao') {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        processedValue = `${year}-${month}-${day}`;
      } else {
        processedValue = value.toISOString();
      }
    } else if (value === undefined) {
      processedValue = '';
    } else {
      processedValue = value;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();

    if (!validarEntregas()) {
      const mensagem = statusObrigatorio 
        ? "Todas as entregas devem ter nome, entregáveis e status de entrega preenchidos."
        : "A primeira entrega é obrigatória e deve ter nome e entregáveis preenchidos.";
      
      toast({
        title: "Erro",
        description: mensagem,
        variant: "destructive",
      });
      return;
    }

    setCarregando(true);

    try {
      const entregasParaSalvar = obterEntregasParaSalvar();
      console.log('📝 Entregas para salvar:', entregasParaSalvar);
      
      // Verificar se os campos de status_entrega existem na tabela
      const camposExistem = await verificarCamposStatusEntrega();
      console.log('🔧 Campos existem no momento do salvamento:', camposExistem);

      // Validação extra de integridade dos dados
      const entregasComErro = entregasParaSalvar.filter((entrega, index) => {
        if (statusObrigatorio && entrega.statusEntregaId && !Number.isInteger(entrega.statusEntregaId)) {
          console.error(`❌ Status de entrega inválido na posição ${index}:`, entrega.statusEntregaId);
          return true;
        }
        return false;
      });

      if (entregasComErro.length > 0) {
        toast({
          title: "Erro de Validação",
          description: "Status de entrega com valores inválidos detectados. Tente recarregar a página.",
          variant: "destructive",
        });
        return;
      }

      // Backup dos dados atuais antes de salvar
      const dadosOriginais = {
        entrega1: status.entrega1,
        entrega2: status.entrega2,
        entrega3: status.entrega3,
        entregaveis1: status.entregaveis1,
        entregaveis2: status.entregaveis2,
        entregaveis3: status.entregaveis3,
        data_marco1: status.data_marco1,
        data_marco2: status.data_marco2,
        data_marco3: status.data_marco3
      };

      const dataToUpdate = {
        data_atualizacao: formData.data_atualizacao,
        status_geral: formData.status_geral,
        status_visao_gp: formData.status_visao_gp,
        impacto_riscos: formData.impacto_riscos,
        probabilidade_riscos: formData.probabilidade_riscos,
        realizado_semana_atual: formData.realizado_semana_atual,
        backlog: formData.backlog,
        bloqueios_atuais: formData.bloqueios_atuais,
        observacoes_pontos_atencao: formData.observacoes_pontos_atencao,
        progresso_estimado: formData.progresso_estimado,
        // Limpar campos de entrega existentes
        entrega1: entregasParaSalvar[0]?.nome || null,
        data_marco1: entregasParaSalvar[0]?.data || null,
        entregaveis1: entregasParaSalvar[0]?.entregaveis || null,
        ...(camposExistem && { status_entrega1_id: entregasParaSalvar[0]?.statusEntregaId || null }),
        entrega2: entregasParaSalvar[1]?.nome || null,
        data_marco2: entregasParaSalvar[1]?.data || null,
        entregaveis2: entregasParaSalvar[1]?.entregaveis || null,
        ...(camposExistem && { status_entrega2_id: entregasParaSalvar[1]?.statusEntregaId || null }),
        entrega3: entregasParaSalvar[2]?.nome || null,
        data_marco3: entregasParaSalvar[2]?.data || null,
        entregaveis3: entregasParaSalvar[2]?.entregaveis || null,
        ...(camposExistem && { status_entrega3_id: entregasParaSalvar[2]?.statusEntregaId || null }),
        // Se for admin editando status aprovado, voltar para revisão
        ...(status.aprovado && isAdmin() && {
          aprovado: false,
          aprovado_por: null,
          data_aprovacao: null
        })
      };

      console.log('💾 Dados finais a serem salvos:', dataToUpdate);

      // Salvar no banco de dados
      const { error, data: savedData } = await supabase
        .from('status_projeto')
        .update(dataToUpdate)
        .eq('id', status.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status: " + error.message,
          variant: "destructive",
        });
        return;
      }

      // Verificação de integridade pós-salvamento
      console.log('✅ Dados salvos no banco:', savedData);
      
      // Se os campos não existem no banco, salvar no cache local
      if (!camposExistem) {
        const statusCache: Record<string, number> = {};
        entregasParaSalvar.forEach((entrega, index) => {
          if (entrega.statusEntregaId) {
            if (index < 3) {
              statusCache[`entrega${index + 1}`] = entrega.statusEntregaId;
            } else {
              statusCache[`extra${index + 1}`] = entrega.statusEntregaId;
            }
          }
        });
        
        console.log('💾 Salvando no cache:', statusCache);
        salvarStatusCache(status.id, statusCache);
        
        // Verificar se o cache foi salvo corretamente
        const cacheVerificacao = carregarStatusCache(status.id);
        console.log('🔍 Verificação do cache salvo:', cacheVerificacao);
      }

      // Gerenciar entregas extras na tabela separada
      try {
        // Primeiro, remover todas as entregas existentes
        const { error: deleteError } = await supabase
          .from('entregas_status')
          .delete()
          .eq('status_id', status.id);

        if (deleteError) {
          console.error('Erro ao remover entregas extras:', deleteError);
        }

        // Inserir entregas extras (acima das 3 principais)
        if (entregasParaSalvar.length > 3) {
          const entregasAdicionais = entregasParaSalvar.slice(3).map((entrega, index) => ({
            status_id: status.id,
            ordem: index + 4,
            nome_entrega: entrega.nome,
            data_entrega: entrega.data || null,
            entregaveis: entrega.entregaveis,
            ...(camposExistem && { status_entrega_id: entrega.statusEntregaId || null })
          }));

          if (entregasAdicionais.length > 0) {
            const { error: insertError, data: insertedData } = await supabase
              .from('entregas_status')
              .insert(entregasAdicionais)
              .select();

            if (insertError) {
              console.error('Erro ao inserir entregas extras:', insertError);
            } else {
              console.log('✅ Entregas extras inseridas:', insertedData);
            }
          }
        }
      } catch (extraError) {
        console.error('Erro ao gerenciar entregas extras:', extraError);
        // Não falhar o processo principal por causa das entregas extras
      }

      const successMessage = status.aprovado && isAdmin() 
        ? "Status atualizado com sucesso! O status voltou para revisão."
        : "Status atualizado com sucesso!";

      toast({
        title: "Sucesso",
        description: successMessage,
      });

      // Invalidar cache do React Query
      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      queryClient.invalidateQueries({ queryKey: ['entregas-status', status.id] });
      
      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status. Dados podem não ter sido salvos corretamente.",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  return {
    formData,
    setFormData,
    carregando,
    marco1TBD,
    setMarco1TBD,
    marco2TBD,
    setMarco2TBD,
    marco3TBD,
    setMarco3TBD,
    dataMarco1,
    setDataMarco1,
    dataMarco2,
    setDataMarco2,
    dataMarco3,
    setDataMarco3,
    handleInputChange,
    handleSubmit,
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar
  };
}
