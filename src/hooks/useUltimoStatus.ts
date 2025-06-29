import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

export interface UltimoStatusDetalhado extends StatusProjeto {
  entregas_status?: any[]; // Lista de entregas associadas
}

export function useUltimoStatus(projetoId: number | null) {
  return useQuery({
    queryKey: ['ultimo-status', projetoId],
    queryFn: async (): Promise<UltimoStatusDetalhado | null> => {
      if (!projetoId) return null;
      
      const { data: status, error } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos(*)
        `)
        .eq('projeto_id', projetoId)
        .order('data_atualizacao', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Nenhum status encontrado
          return null;
        }
        throw error;
      }

      if (!status) return null;

      // Buscar entregas associadas na tabela entregas_status
      const { data: entregas } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      return {
        ...(status as unknown as StatusProjeto),
        entregas_status: entregas || [],
      };
    },
    enabled: !!projetoId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
} 