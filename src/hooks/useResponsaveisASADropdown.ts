
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useResponsaveisASADropdown() {
  return useQuery({
    queryKey: ['responsaveis-asa-dropdown'],
    queryFn: async () => {
      console.log('🔍 Buscando responsáveis ASA para dropdown...');
      
      const { data, error } = await supabase
        .from('responsaveis_asa')
        .select('nome')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar responsáveis ASA:', error);
        throw error;
      }

      console.log('Responsáveis ASA encontrados:', data?.length || 0);
      return data?.map(item => item.nome) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}
