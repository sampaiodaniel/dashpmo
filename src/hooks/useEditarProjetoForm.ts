
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Projeto } from '@/types/pmo';
import { useQueryClient } from '@tanstack/react-query';

interface UseEditarProjetoFormProps {
  projeto: Projeto;
  onSuccess: () => void;
}

export function useEditarProjetoForm({ projeto, onSuccess }: UseEditarProjetoFormProps) {
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);
  
  const [formData, setFormData] = useState({
    nome_projeto: projeto.nome_projeto || '',
    tipo_projeto_id: projeto.tipo_projeto_id || null,
    descricao_projeto: projeto.descricao_projeto || '',
    responsavel_asa: projeto.responsavel_asa || '',
    gp_responsavel_cwi: projeto.gp_responsavel_cwi || '',
    responsavel_cwi: projeto.responsavel_cwi || '',
    carteira_primaria: projeto.carteira_primaria || '',
    carteira_secundaria: projeto.carteira_secundaria || '',
    carteira_terciaria: projeto.carteira_terciaria || '',
    equipe: projeto.equipe || '',
    finalizacao_prevista: projeto.finalizacao_prevista && projeto.finalizacao_prevista !== 'TBD' ? projeto.finalizacao_prevista : '',
  });

  const handleInputChange = (field: string, value: string | Date | null | boolean | number) => {
    console.log('🔄 Campo alterado:', { field, value });
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Enviando formulário:', formData);
    setCarregando(true);

    try {
      // Validar se o tipo_projeto_id existe na tabela configuracoes_sistema (se não for null)
      if (formData.tipo_projeto_id) {
        const { data: tipoExiste, error: tipoError } = await supabase
          .from('configuracoes_sistema')
          .select('id')
          .eq('id', formData.tipo_projeto_id)
          .eq('tipo', 'tipos_projeto')
          .eq('ativo', true)
          .maybeSingle();

        if (tipoError) {
          console.error('❌ Erro ao validar tipo de projeto:', tipoError);
          toast({
            title: "Erro",
            description: "Erro ao validar tipo de projeto",
            variant: "destructive",
          });
          return;
        }

        if (!tipoExiste) {
          console.error('❌ Tipo de projeto não encontrado ou inativo');
          toast({
            title: "Erro",
            description: "Tipo de projeto selecionado não existe ou está inativo",
            variant: "destructive",
          });
          return;
        }
      }

      // Preparar dados para envio
      const dataToSubmit = {
        nome_projeto: formData.nome_projeto.trim(),
        tipo_projeto_id: formData.tipo_projeto_id,
        descricao_projeto: formData.descricao_projeto.trim() || null,
        responsavel_asa: formData.responsavel_asa.trim() || null,
        gp_responsavel_cwi: formData.gp_responsavel_cwi.trim() || null,
        responsavel_cwi: formData.responsavel_cwi.trim() || null,
        carteira_primaria: formData.carteira_primaria || null,
        carteira_secundaria: formData.carteira_secundaria || null,
        carteira_terciaria: formData.carteira_terciaria || null,
        equipe: formData.equipe.trim() || null,
        finalizacao_prevista: formData.finalizacao_prevista || null,
        // Manter os campos obrigatórios do banco com valores derivados dos novos campos
        area_responsavel: (formData.carteira_primaria || 'Cadastro') as any,
        responsavel_interno: formData.responsavel_asa || 'Admin',
        gp_responsavel: formData.gp_responsavel_cwi || 'Admin'
      };

      console.log('📝 Dados sendo enviados para atualização:', dataToSubmit);

      const { error } = await supabase
        .from('projetos')
        .update(dataToSubmit)
        .eq('id', projeto.id);

      if (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        
        // Mensagem de erro mais específica
        let errorMessage = "Erro ao atualizar projeto";
        if (error.message.includes('foreign key constraint')) {
          errorMessage = "Erro: Tipo de projeto selecionado não existe ou está inativo";
        } else if (error.message.includes('violates not-null constraint')) {
          errorMessage = "Erro: Campos obrigatórios não preenchidos";
        } else if (error.message.includes('check constraint')) {
          errorMessage = "Erro: Valor inválido em um dos campos. Verifique se todos os valores estão corretos.";
        } else {
          errorMessage = `Erro ao atualizar projeto: ${error.message}`;
        }
        
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Projeto atualizado com sucesso');
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      onSuccess();
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar projeto",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  return {
    formData,
    carregando,
    handleInputChange,
    handleSubmit
  };
}
