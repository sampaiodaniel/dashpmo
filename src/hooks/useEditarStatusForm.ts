
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useEntregasDinamicas, Entrega } from '@/hooks/useEntregasDinamicas';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';

export function useEditarStatusForm(status: StatusProjeto) {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const { statusEntrega } = useStatusEntrega();
  const [carregando, setCarregando] = useState(false);
  const [entregasCarregadas, setEntregasCarregadas] = useState(false);

  // Buscar entregas da tabela entregas_status SEM migração automática
  const { data: entregasExistentes = [] } = useQuery({
    queryKey: ['entregas-status-edit', status.id],
    queryFn: async () => {
      console.log('🔍 Buscando entregas para edição do status:', status.id);
      
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas:', error);
        return [];
      }

      console.log('📦 Entregas encontradas na tabela entregas_status:', data?.length || 0, data);

      // Se há entregas na nova tabela, usar elas diretamente (sem migração)
      if (data && data.length > 0) {
        console.log('✅ Usando entregas existentes da tabela entregas_status');
        return data;
      }

      // Somente se não há entregas na nova tabela, verificar dados legados
      console.log('⚠️ Nenhuma entrega encontrada na tabela nova, verificando dados legados...');
      
      const { data: statusData, error: statusError } = await supabase
        .from('status_projeto')
        .select('entrega1, entrega2, entrega3, entregaveis1, entregaveis2, entregaveis3, data_marco1, data_marco2, data_marco3, status_entrega1_id, status_entrega2_id, status_entrega3_id')
        .eq('id', status.id)
        .single();

      if (statusError) {
        console.error('Erro ao buscar dados legados:', statusError);
        return [];
      }

      console.log('📋 Dados legados encontrados:', statusData);

      // Se há dados legados, criar entregas para migração
      const entregasParaMigrar = [];
      
      if (statusData?.entrega1) {
        entregasParaMigrar.push({
          status_id: status.id,
          ordem: 1,
          nome_entrega: statusData.entrega1,
          data_entrega: statusData.data_marco1,
          entregaveis: statusData.entregaveis1,
          status_entrega_id: statusData.status_entrega1_id,
          status_da_entrega: 'Em andamento'
        });
      }

      if (statusData?.entrega2) {
        entregasParaMigrar.push({
          status_id: status.id,
          ordem: 2,
          nome_entrega: statusData.entrega2,
          data_entrega: statusData.data_marco2,
          entregaveis: statusData.entregaveis2,
          status_entrega_id: statusData.status_entrega2_id,
          status_da_entrega: 'Em andamento'
        });
      }

      if (statusData?.entrega3) {
        entregasParaMigrar.push({
          status_id: status.id,
          ordem: 3,
          nome_entrega: statusData.entrega3,
          data_entrega: statusData.data_marco3,
          entregaveis: statusData.entregaveis3,
          status_entrega_id: statusData.status_entrega3_id,
          status_da_entrega: 'Em andamento'
        });
      }

      // Apenas retornar os dados legados como referência, SEM fazer migração automática
      if (entregasParaMigrar.length > 0) {
        console.log('📝 Dados legados disponíveis para migração manual:', entregasParaMigrar);
      }

      return [];
    },
  });
  
  // Inicializar entregas dinâmicas com dados existentes
  const {
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar
  } = useEntregasDinamicas([], true);

  // Carregar entregas quando os dados estiverem prontos
  useEffect(() => {
    if (entregasCarregadas || !statusEntrega.length) return;
    
    console.log('🔄 Carregando entregas para edição do status:', status.id);
    console.log('📦 Entregas encontradas:', entregasExistentes);
    
    if (entregasExistentes && entregasExistentes.length > 0) {
      const entregasCompletas: Entrega[] = entregasExistentes.map((entrega: any) => ({
        id: entrega.id.toString(),
        nome: entrega.nome_entrega || '',
        data: entrega.data_entrega || '',
        entregaveis: entrega.entregaveis || '',
        statusEntregaId: entrega.status_entrega_id || (statusEntrega.length > 0 ? statusEntrega[0].id : null)
      }));
      
      console.log('✅ Carregando entregas existentes:', entregasCompletas.length);
      setEntregas(entregasCompletas);
    } else {
      // Se não há entregas, criar uma entrega vazia
      const entregaVazia: Entrega = { 
        id: 'nova-1', 
        nome: '', 
        data: '', 
        entregaveis: '', 
        statusEntregaId: statusEntrega.length > 0 ? statusEntrega[0].id : null 
      };
      
      console.log('📝 Criando entrega vazia para novo status');
      setEntregas([entregaVazia]);
    }
    
    setEntregasCarregadas(true);
  }, [entregasExistentes, statusEntrega, status.id, setEntregas, entregasCarregadas]);
  
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
      toast({
        title: "Erro",
        description: "Todas as entregas devem ter nome, entregáveis e status de entrega preenchidos.",
        variant: "destructive",
      });
      return;
    }

    setCarregando(true);

    try {
      const entregasParaSalvar = obterEntregasParaSalvar();
      console.log('📝 Entregas para salvar durante edição:', entregasParaSalvar);

      // Validar entregas antes de salvar
      for (const entrega of entregasParaSalvar) {
        if (!entrega.nome || !entrega.entregaveis) {
          toast({
            title: "Erro de Validação",
            description: `Entrega "${entrega.nome || 'sem nome'}" deve ter nome e entregáveis preenchidos.`,
            variant: "destructive",
          });
          setCarregando(false);
          return;
        }
      }

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
        // Limpar campos de entrega legados apenas se houver entregas para salvar
        ...(entregasParaSalvar.length > 0 && {
          entrega1: null,
          entrega2: null,
          entrega3: null,
          entregaveis1: null,
          entregaveis2: null,
          entregaveis3: null,
          data_marco1: null,
          data_marco2: null,
          data_marco3: null,
          status_entrega1_id: null,
          status_entrega2_id: null,
          status_entrega3_id: null,
        }),
        // Se for admin editando status aprovado, voltar para revisão
        ...(status.aprovado && isAdmin() && {
          aprovado: false,
          aprovado_por: null,
          data_aprovacao: null
        })
      };

      console.log('💾 Dados do status a serem salvos:', dataToUpdate);

      // Salvar status
      const { error, data: savedData } = await supabase
        .from('status_projeto')
        .update(dataToUpdate)
        .eq('id', status.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Status atualizado:', savedData);

      // Gerenciar entregas na tabela entregas_status
      try {
        // Primeiro, remover todas as entregas existentes para este status
        console.log('🗑️ Removendo entregas existentes para status:', status.id);
        const { error: deleteError } = await supabase
          .from('entregas_status')
          .delete()
          .eq('status_id', status.id);

        if (deleteError) {
          console.error('❌ Erro ao remover entregas existentes:', deleteError);
          throw deleteError;
        }

        // Inserir todas as entregas atualizadas
        if (entregasParaSalvar.length > 0) {
          console.log('📦 Inserindo entregas durante edição:', entregasParaSalvar.length, 'entregas');

          for (let index = 0; index < entregasParaSalvar.length; index++) {
            const entrega = entregasParaSalvar[index];
            
            const entregaFormatada = {
              status_id: status.id,
              ordem: index + 1,
              nome_entrega: entrega.nome?.trim() || '',
              data_entrega: entrega.data || null,
              entregaveis: entrega.entregaveis?.trim() || '',
              status_entrega_id: entrega.statusEntregaId || null,
              status_da_entrega: 'Em andamento'
            };

            console.log(`📦 Inserindo entrega ${index + 1}/${entregasParaSalvar.length}:`, entregaFormatada);

            const { error: insertError, data: insertedData } = await supabase
              .from('entregas_status')
              .insert(entregaFormatada)
              .select()
              .single();

            if (insertError) {
              console.error('❌ Erro ao inserir entrega individual:', entregaFormatada.nome_entrega, insertError);
              throw new Error(`Erro ao salvar entrega "${entregaFormatada.nome_entrega}": ${insertError.message}`);
            } else {
              console.log('✅ Entrega inserida com sucesso:', entregaFormatada.nome_entrega, insertedData);
            }
          }

          console.log('✅ Todas as entregas inseridas com sucesso');
        }
      } catch (entregasError: any) {
        console.error('❌ Erro ao gerenciar entregas:', entregasError);
        toast({
          title: "Erro ao Salvar Entregas",
          description: entregasError.message || 'Erro desconhecido ao salvar entregas.',
          variant: "destructive",
        });
        return;
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
      queryClient.invalidateQueries({ queryKey: ['entregas-status-edit', status.id] });
      
      onSuccess();
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status.",
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
