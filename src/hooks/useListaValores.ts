
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useListaValores(tipo: string) {
  return useQuery({
    queryKey: ['lista-valores', tipo],
    queryFn: async () => {
      console.log(`Buscando lista de valores para tipo: ${tipo}`);
      
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('valor')
        .eq('tipo', tipo)
        .eq('ativo', true)
        .order('ordem', { ascending: true })
        .order('valor', { ascending: true });

      if (error) {
        console.error(`Erro ao buscar lista de valores para ${tipo}:`, error);
        throw error;
      }

      console.log(`Lista de valores para ${tipo}:`, data);
      return data?.map(item => item.valor) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hooks específicos para cada tipo de lista
export const useResponsaveisCWI = () => useListaValores('responsavel_cwi');
export const useCarteiras = () => useListaValores('carteira');
export const useStatusGeral = () => useListaValores('status_geral');
export const useStatusVisaoGP = () => useListaValores('status_visao_gp');
export const useNiveisRisco = () => useListaValores('nivel_risco');
export const useTiposMudanca = () => useListaValores('tipo_mudanca');
export const useCategoriaLicao = () => useListaValores('categoria_licao');
