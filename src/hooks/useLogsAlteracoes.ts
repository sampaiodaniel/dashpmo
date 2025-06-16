
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LogAlteracao, ModuloSistema, AcaoSistema } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

export function useLogsAlteracoes() {
  return useQuery({
    queryKey: ['logs-alteracoes'],
    queryFn: async (): Promise<LogAlteracao[]> => {
      console.log('📋 Buscando logs de alterações...');

      const { data, error } = await supabase
        .from('logs_alteracoes')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar logs:', error);
        throw error;
      }

      console.log('✅ Logs encontrados:', data?.length || 0);
      
      return data?.map(log => ({
        ...log,
        data_criacao: new Date(log.data_criacao)
      })) || [];
    },
  });
}

export function useRegistrarLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      modulo,
      acao,
      entidade_tipo,
      entidade_id,
      entidade_nome,
      detalhes_alteracao,
      usuario_id,
      usuario_nome
    }: {
      modulo: ModuloSistema;
      acao: AcaoSistema;
      entidade_tipo: string;
      entidade_id?: number;
      entidade_nome?: string;
      detalhes_alteracao?: any;
      usuario_id: number;
      usuario_nome: string;
    }) => {
      console.log('📝 Registrando log de alteração:', { modulo, acao, entidade_tipo });

      // Capturar informações do navegador
      const ip_usuario = null; // Não é possível capturar IP no frontend
      const user_agent = navigator.userAgent;

      const { error } = await supabase.rpc('registrar_log_alteracao', {
        p_usuario_id: usuario_id,
        p_usuario_nome: usuario_nome,
        p_modulo: modulo,
        p_acao: acao,
        p_entidade_tipo: entidade_tipo,
        p_entidade_id: entidade_id,
        p_entidade_nome: entidade_nome,
        p_detalhes_alteracao: detalhes_alteracao,
        p_ip_usuario: ip_usuario,
        p_user_agent: user_agent
      });

      if (error) {
        console.error('❌ Erro ao registrar log:', error);
        throw error;
      }

      console.log('✅ Log registrado com sucesso');
    },
    onSuccess: () => {
      // Atualizar a lista de logs
      queryClient.invalidateQueries({ queryKey: ['logs-alteracoes'] });
    },
    onError: (error) => {
      console.error('❌ Erro ao registrar log:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar log de alteração",
        variant: "destructive",
      });
    },
  });
}

// Hook para filtrar logs por módulo
export function useLogsFiltrados(modulo?: string) {
  const { data: logs, isLoading, error } = useLogsAlteracoes();

  const logsFiltrados = logs?.filter(log => 
    !modulo || log.modulo === modulo
  ) || [];

  return {
    data: logsFiltrados,
    isLoading,
    error
  };
}
