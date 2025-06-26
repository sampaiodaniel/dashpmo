
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useAuth } from '@/hooks/useAuth';
import { Entrega } from '@/hooks/useEntregasDinamicas';

interface UseStatusFormSubmitProps {
  status: StatusProjeto;
  formData: any;
  validarEntregas: () => boolean;
  obterEntregasParaSalvar: () => Entrega[];
}

export function useStatusFormSubmit({ 
  status, 
  formData, 
  validarEntregas, 
  obterEntregasParaSalvar 
}: UseStatusFormSubmitProps) {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [carregando, setCarregando] = useState(false);

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
    carregando,
    handleSubmit
  };
}
