
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useResponsaveisASAHierarquia() {
  return useQuery({
    queryKey: ['responsaveis-asa-hierarquia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('responsaveis_asa')
        .select('*')
        .eq('ativo', true)
        .order('nivel', { ascending: true })
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar responsáveis ASA:', error);
        throw error;
      }

      return data;
    },
  });
}

export function useCarteirasDoResponsavel(responsavelSelecionado: string) {
  const { data: responsaveis } = useResponsaveisASAHierarquia();

  if (!responsaveis || responsavelSelecionado === 'todos') {
    return [];
  }

  const responsavel = responsaveis.find(r => r.nome === responsavelSelecionado);
  if (!responsavel) return [];

  // Se for Head, retorna suas carteiras
  if (responsavel.nivel === 'Head') {
    return responsavel.carteiras || [];
  }

  // Se for Superintendente, retorna suas carteiras
  if (responsavel.nivel === 'Superintendente') {
    return responsavel.carteiras || [];
  }

  return [];
}
