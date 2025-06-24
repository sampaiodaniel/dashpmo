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
  const inicializadoRef = useRef<{ [id: number]: boolean }>({});

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

  // Inicializar entregas dinâmicas com dados existentes (será atualizado com useEffect)
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
    if (inicializadoRef.current[status.id]) return;
    inicializadoRef.current[status.id] = true;
    // Carregar cache de status se os campos não existirem no banco
    const cacheStatus = carregarStatusCache(status.id);
    const entregasCompletas: Entrega[] = [];
    const primeiroStatusId = statusEntrega.length > 0 ? statusEntrega[0].id : 1;
    // Adicionar entregas principais
    if (status.entrega1) {
      let statusEntregaId = (status as any).status_entrega1_id || cacheStatus['entrega1'] || null;
      if (!statusEntregaId) {
        statusEntregaId = primeiroStatusId;
      }
      const entrega1 = {
        id: '1',
        nome: status.entrega1,
        data: typeof status.data_marco1 === 'string' ? status.data_marco1 : (status.data_marco1 ? status.data_marco1.toISOString().split('T')[0] : ''),
        entregaveis: status.entregaveis1 || '',
        statusEntregaId: statusEntregaId
      };
      entregasCompletas.push(entrega1);
    }
    if (status.entrega2) {
      let statusEntregaId = (status as any).status_entrega2_id || cacheStatus['entrega2'] || null;
      if (!statusEntregaId) {
        statusEntregaId = primeiroStatusId;
      }
      const entrega2 = {
        id: '2',
        nome: status.entrega2,
        data: typeof status.data_marco2 === 'string' ? status.data_marco2 : (status.data_marco2 ? status.data_marco2.toISOString().split('T')[0] : ''),
        entregaveis: status.entregaveis2 || '',
        statusEntregaId: statusEntregaId
      };
      entregasCompletas.push(entrega2);
    }
    if (status.entrega3) {
      let statusEntregaId = (status as any).status_entrega3_id || cacheStatus['entrega3'] || null;
      if (!statusEntregaId) {
        statusEntregaId = primeiroStatusId;
      }
      const entrega3 = {
        id: '3',
        nome: status.entrega3,
        data: typeof status.data_marco3 === 'string' ? status.data_marco3 : (status.data_marco3 ? status.data_marco3.toISOString().split('T')[0] : ''),
        entregaveis: status.entregaveis3 || '',
        statusEntregaId: statusEntregaId
      };
      entregasCompletas.push(entrega3);
    }
    // Adicionar entregas extras da tabela entregas_status
    entregasExtras.forEach((entrega: any, index: number) => {
      let statusEntregaId = entrega.status_entrega_id || cacheStatus[`extra${index + 4}`] || null;
      if (!statusEntregaId) {
        statusEntregaId = primeiroStatusId;
      }
      const entregaExtra = {
        id: entrega.id.toString(),
        nome: entrega.nome_entrega,
        data: entrega.data_entrega || '',
        entregaveis: entrega.entregaveis || '',
        statusEntregaId: statusEntregaId
      };
      entregasCompletas.push(entregaExtra);
    });
    if (entregasCompletas.length === 0) {
      entregasCompletas.push({ id: '1', nome: '', data: '', entregaveis: '', statusEntregaId: primeiroStatusId });
    }
    setEntregas(entregasCompletas);
  }, [status.id, entregasExtras, setEntregas, carregarStatusCache]);
  
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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        salvarStatusCache(status.id, statusCache);
      }

      // Gerenciar entregas extras na tabela separada
      // Primeiro, remover todas as entregas existentes
        await supabase
          .from('entregas_status')
          .delete()
          .eq('status_id', status.id);

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
          const { error: insertError } = await supabase
            .from('entregas_status')
            .insert(entregasAdicionais);

          if (insertError) {
            console.error('Erro ao inserir entregas extras:', insertError);
          }
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
