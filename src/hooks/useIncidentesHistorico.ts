
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface IncidenteHistorico {
  id: number;
  carteira: string;
  anterior: number;
  entrada: number;
  saida: number;
  atual: number;
  mais_15_dias: number;
  criticos: number;
  data_registro: string;
}

export function useIncidentesHistorico() {
  return useQuery({
    queryKey: ['incidentes-historico'],
    queryFn: async () => {
      console.log('Buscando histórico completo de incidentes...');
      
      const { data, error } = await supabase
        .from('incidentes')
        .select('*')
        .order('data_registro', { ascending: true })
        .order('carteira', { ascending: true });

      if (error) {
        console.error('Erro ao buscar histórico de incidentes:', error);
        throw error;
      }

      console.log('Histórico de incidentes:', data);
      return data as IncidenteHistorico[];
    },
  });
}
