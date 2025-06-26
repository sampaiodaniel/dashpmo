
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

  // Buscar entregas da tabela entregas_status
  const { data: entregasExistentes = [] } = useQuery({
    queryKey: ['entregas-status', status.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas:', error);
        return [];
      }

      return data || [];
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
  } = useEntregasDinamicas([], true); // statusObrigatorio = true

  // Carregar entregas quando os dados estiverem prontos
  useEffect(() => {
    if (entregasCarregadas || !statusEntrega.length) return;
    
    console.log('🔄 Carregando entregas para edição do status:', status.id);
    console.log('📦 Entregas encontradas:', entregasExistentes);
    
    const entregasCompletas: Entrega[] = entregasExistentes.map((entrega: any) => ({
      id: entrega.id.toString(),
      nome: entrega.nome_entrega || '',
      data: entrega.data_entrega || '',
      entregaveis: entrega.entregaveis || '',
      statusEntregaId: entrega.status_entrega_id || (statusEntrega.length > 0 ? statusEntrega[0].id : null)
    }));
    
    // Garantir que sempre temos pelo menos uma entrega
    if (entregasCompletas.length === 0) {
      entregasCompletas.push({ 
        id: 'nova-1', 
        nome: '', 
        data: '', 
        entregaveis: '', 
        statusEntregaId: statusEntrega.length > 0 ? statusEntrega[0].id : null 
      });
    }
    
    console.log('✅ Total de entregas carregadas:', entregasCompletas.length);
    setEntregas(entregasCompletas);
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
      console.log('📝 Entregas para salvar:', entregasParaSalvar);

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
        // Limpar campos de entrega legados - não usar mais
        entrega1: null,
        entrega2: null,
        entrega3: null,
        entregaveis1: null,
        entregaveis2: null,
        entregaveis3: null,
        data_marco1: null,
        data_marco2: null,
        data_marco3: null,
        // Se for admin editando status aprovado, voltar para revisão
        ...(status.aprovado && isAdmin() && {
          aprovado: false,
          aprovado_por: null,
          data_aprovacao: null
        })
      };

      console.log('💾 Dados do status a serem salvos:', dataToUpdate);

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

      console.log('✅ Status atualizado:', savedData);

      // Gerenciar entregas na tabela entregas_status
      try {
        // Primeiro, remover todas as entregas existentes para este status
        const { error: deleteError } = await supabase
          .from('entregas_status')
          .delete()
          .eq('status_id', status.id);

        if (deleteError) {
          console.error('Erro ao remover entregas existentes:', deleteError);
          throw deleteError;
        }

        // Inserir todas as entregas atualizadas
        if (entregasParaSalvar.length > 0) {
          const entregasParaInserir = entregasParaSalvar.map((entrega, index) => ({
            status_id: status.id,
            ordem: index + 1,
            nome_entrega: entrega.nome,
            data_entrega: entrega.data || null,
            entregaveis: entrega.entregaveis,
            status_entrega_id: entrega.statusEntregaId,
            status_da_entrega: 'Em andamento' // Campo obrigatório
          }));

          console.log('📦 Inserindo entregas:', entregasParaInserir);

          const { error: insertError, data: insertedData } = await supabase
            .from('entregas_status')
            .insert(entregasParaInserir)
            .select();

          if (insertError) {
            console.error('Erro detalhado ao inserir entregas:', insertError);
            console.error('Dados que causaram erro:', entregasParaInserir);
            throw insertError;
          } else {
            console.log('✅ Entregas inseridas com sucesso:', insertedData);
          }
        }
      } catch (entregasError: any) {
        console.error('Erro ao gerenciar entregas:', entregasError);
        toast({
          title: "Erro",
          description: `Erro ao salvar entregas: ${entregasError.message || 'Verifique os dados e tente novamente.'}`,
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
      
      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
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
