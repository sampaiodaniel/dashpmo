import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StatusProjeto } from '@/types/pmo';
import { supabase } from '@/integrations/supabase/client';

// Interface para entrega, agora mais simples e com o status como texto
export interface EntregaDinamica {
  id: number | string; // ID pode ser número (do banco) ou string (novo)
  nome_entrega: string;
  data_entrega: string;
  entregaveis: string;
  status_da_entrega: string; // O status como texto
  ordem: number;
}

function isAdmin(): boolean {
  // Mock para exemplo, idealmente viria de um hook de autenticação
  return localStorage.getItem('user_role') === 'admin';
}

export function useEditarStatusForm(status: StatusProjeto) {
  const { toast } = useToast();
  
  const [carregando, setCarregando] = useState(false);
  const [entregas, setEntregas] = useState<EntregaDinamica[]>([]);
  const [entregasCarregadas, setEntregasCarregadas] = useState(false);
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
  });

  // Efeito para carregar TODAS as entregas da tabela 'entregas_status'
  useEffect(() => {
    if (entregasCarregadas) return;

    const carregarEntregas = async () => {
      setCarregando(true);
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        toast({
          title: "Erro ao carregar entregas",
          description: error.message,
          variant: "destructive",
        });
        setEntregas([]);
      } else {
        // Mapear os dados para o formato do nosso estado
        const entregasFormatadas: EntregaDinamica[] = data.map(d => ({
          id: d.id,
          nome_entrega: d.nome_entrega || '',
          data_entrega: d.data_entrega || '',
          entregaveis: d.entregaveis || '',
          status_da_entrega: d.status_da_entrega || 'Não iniciado',
          ordem: d.ordem,
        }));

        // Se não houver entregas, adicionar uma em branco para iniciar
        if (entregasFormatadas.length === 0) {
          entregasFormatadas.push({
            id: `new-${Date.now()}`,
            nome_entrega: '',
            data_entrega: '',
            entregaveis: '',
            status_da_entrega: 'Não iniciado',
            ordem: 1,
          });
        }
        setEntregas(entregasFormatadas);
      }
      setEntregasCarregadas(true);
      setCarregando(false);
    };

    carregarEntregas();
  }, [status.id, entregasCarregadas, toast]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    setCarregando(true);

    const { error: statusError } = await supabase
      .from('status_projeto')
      .update({
        ...formData,
        // Se for admin editando status aprovado, voltar para revisão
        ...(status.aprovado && isAdmin() && {
          aprovado: false,
          aprovado_por: null,
          data_aprovacao: null
        })
      })
      .eq('id', status.id);

    if (statusError) {
      toast({ title: "Erro ao salvar status", description: statusError.message, variant: "destructive" });
      setCarregando(false);
      return;
    }

    // Deletar entregas antigas
    const { error: deleteError } = await supabase
        .from('entregas_status')
        .delete()
        .eq('status_id', status.id);

    if (deleteError) {
        toast({ title: "Erro ao limpar entregas antigas", description: deleteError.message, variant: "destructive" });
        // Continuamos mesmo com erro aqui para tentar salvar as novas
    }

    // Inserir as novas entregas
    const entregasParaSalvar = entregas
        .filter(e => e.nome_entrega.trim() !== '')
        .map((entrega, index) => ({
            status_id: status.id,
            nome_entrega: entrega.nome_entrega,
            data_entrega: entrega.data_entrega || null,
            entregaveis: entrega.entregaveis,
            status_da_entrega: entrega.status_da_entrega,
            ordem: index + 1,
        }));

    if (entregasParaSalvar.length > 0) {
        const { error: insertError } = await supabase
            .from('entregas_status')
            .insert(entregasParaSalvar);

        if (insertError) {
            toast({ title: "Erro ao salvar novas entregas", description: insertError.message, variant: "destructive" });
            setCarregando(false);
            return;
        }
    }
    
    toast({ title: "Sucesso", description: "Status atualizado com sucesso!" });
    onSuccess();
    setCarregando(false);
  };

  const adicionarEntrega = () => {
    setEntregas(prev => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        nome_entrega: '',
        data_entrega: '',
        entregaveis: '',
        status_da_entrega: 'Não iniciado',
        ordem: prev.length + 1,
      },
    ]);
  };

  const removerEntrega = (id: number | string) => {
    setEntregas(prev => prev.filter(entrega => entrega.id !== id));
  };

  const atualizarEntrega = (id: number | string, campo: keyof EntregaDinamica, valor: any) => {
    setEntregas(prev => prev.map(entrega => 
      entrega.id === id ? { ...entrega, [campo]: valor } : entrega
    ));
  };

  return {
    formData,
    carregando,
    entregas,
    handleInputChange,
    handleSubmit,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
  };
}
