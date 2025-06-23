
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useListaValores(tipo: string) {
  return useQuery({
    queryKey: ['lista-valores', tipo],
    queryFn: async () => {
      console.log(`Buscando lista de valores para tipo: ${tipo}`);
      
      try {
        const { data, error } = await supabase
          .from('configuracoes_sistema')
          .select('valor')
          .eq('tipo', tipo)
          .eq('ativo', true)
          .order('ordem', { ascending: true })
          .order('valor', { ascending: true });

        if (error) {
          console.error(`Erro ao buscar lista de valores para ${tipo}:`, error);
          // Retornar valores padrão em caso de erro
          return getValoresPadrao(tipo);
        }

        console.log(`Lista de valores para ${tipo}:`, data);
        const valores = data?.map(item => item.valor) || [];
        
        // Se não houver dados, usar valores padrão
        if (valores.length === 0) {
          console.warn(`Nenhum valor encontrado para ${tipo}, usando valores padrão`);
          return getValoresPadrao(tipo);
        }
        
        return valores;
      } catch (error) {
        console.error(`Erro inesperado ao buscar lista de valores para ${tipo}:`, error);
        return getValoresPadrao(tipo);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false, // Não refetch quando a janela volta ao foco
    retry: 2, // Tentar 2 vezes em caso de erro
  });
}

// Função para retornar valores padrão em caso de erro
function getValoresPadrao(tipo: string): string[] {
  switch (tipo) {
    case 'status_geral':
      return ['No Prazo', 'Atrasado', 'Pausado'];
    case 'status_visao_gp':
      return ['Verde', 'Amarelo', 'Vermelho'];
    case 'nivel_risco':
      return ['Baixo', 'Médio', 'Alto'];
    case 'tipo_mudanca':
      return ['Replanejamento', 'Mudança de Escopo', 'Recursos Adicionais'];
    case 'categoria_licao':
      return ['Técnica', 'Gestão', 'Comunicação', 'Recursos'];
    default:
      return [];
  }
}

// Hooks específicos para cada tipo de lista
export const useResponsaveisCWI = () => useListaValores('responsavel_cwi');
export const useCarteiras = () => useListaValores('carteira');
export const useStatusGeral = () => useListaValores('status_geral');
export const useStatusVisaoGP = () => useListaValores('status_visao_gp');
export const useNiveisRisco = () => useListaValores('nivel_risco');
export const useTiposMudanca = () => useListaValores('tipo_mudanca');
export const useCategoriaLicao = () => useListaValores('categoria_licao');
