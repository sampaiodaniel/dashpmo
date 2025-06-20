
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useEntregasDinamicas, Entrega } from '@/hooks/useEntregasDinamicas';

export function useEditarStatusForm(status: StatusProjeto) {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [carregando, setCarregando] = useState(false);
  
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
  const entregasIniciais: Entrega[] = [];
  if (status.entrega1) {
    entregasIniciais.push({
      id: '1',
      nome: status.entrega1,
      data: typeof status.data_marco1 === 'string' ? status.data_marco1 : (status.data_marco1 ? status.data_marco1.toISOString().split('T')[0] : ''),
      entregaveis: status.entregaveis1 || ''
    });
  }
  if (status.entrega2) {
    entregasIniciais.push({
      id: '2',
      nome: status.entrega2,
      data: typeof status.data_marco2 === 'string' ? status.data_marco2 : (status.data_marco2 ? status.data_marco2.toISOString().split('T')[0] : ''),
      entregaveis: status.entregaveis2 || ''
    });
  }
  if (status.entrega3) {
    entregasIniciais.push({
      id: '3',
      nome: status.entrega3,
      data: typeof status.data_marco3 === 'string' ? status.data_marco3 : (status.data_marco3 ? status.data_marco3.toISOString().split('T')[0] : ''),
      entregaveis: status.entregaveis3 || ''
    });
  }

  const {
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar
  } = useEntregasDinamicas(entregasIniciais);
  
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();

    if (!validarEntregas()) {
      toast({
        title: "Erro",
        description: "A primeira entrega é obrigatória e deve ter nome e entregáveis preenchidos.",
        variant: "destructive",
      });
      return;
    }

    setCarregando(true);

    try {
      const entregasParaSalvar = obterEntregasParaSalvar();

      const dataToUpdate = {
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
        entrega2: entregasParaSalvar[1]?.nome || null,
        data_marco2: entregasParaSalvar[1]?.data || null,
        entregaveis2: entregasParaSalvar[1]?.entregaveis || null,
        entrega3: entregasParaSalvar[2]?.nome || null,
        data_marco3: entregasParaSalvar[2]?.data || null,
        entregaveis3: entregasParaSalvar[2]?.entregaveis || null,
        data_atualizacao: new Date().toISOString().split('T')[0],
        // Se for admin editando status aprovado, voltar para revisão
        ...(status.aprovado && isAdmin() && {
          aprovado: false,
          aprovado_por: null,
          data_aprovacao: null
        })
      };

      console.log('Dados a serem salvos:', dataToUpdate);

      const { error } = await supabase
        .from('status_projeto')
        .update(dataToUpdate)
        .eq('id', status.id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status",
          variant: "destructive",
        });
        return;
      }

      // Atualizar entregas dinâmicas na tabela separada
      if (entregasParaSalvar.length > 3) {
        // Remover entregas existentes
        await supabase
          .from('entregas_status')
          .delete()
          .eq('status_id', status.id);

        // Inserir novas entregas
        const entregasAdicionais = entregasParaSalvar.slice(3).map((entrega, index) => ({
          status_id: status.id,
          ordem: index + 4,
          nome_entrega: entrega.nome,
          data_entrega: entrega.data || null,
          entregaveis: entrega.entregaveis
        }));

        if (entregasAdicionais.length > 0) {
          await supabase
            .from('entregas_status')
            .insert(entregasAdicionais);
        }
      }

      const successMessage = status.aprovado && isAdmin() 
        ? "Status atualizado com sucesso! O status voltou para revisão."
        : "Status atualizado com sucesso!";

      toast({
        title: "Sucesso",
        description: successMessage,
      });

      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status",
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
