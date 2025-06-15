
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface IncidenteData {
  carteira: string;
  anterior: number;
  entrada: number;
  saida: number;
  atual: number;
  mais_15_dias: number;
  criticos: number;
  data_registro?: string;
}

export function useIncidentes() {
  return useQuery({
    queryKey: ['incidentes-recentes'],
    queryFn: async () => {
      console.log('Buscando registros mais recentes por carteira...');
      
      const { data, error } = await supabase
        .from('incidentes')
        .select('*')
        .order('data_registro', { ascending: false });

      if (error) {
        console.error('Erro ao buscar incidentes:', error);
        throw error;
      }

      // Agrupar por carteira e pegar o mais recente de cada uma
      const registrosPorCarteira = new Map();
      
      data?.forEach(registro => {
        if (!registrosPorCarteira.has(registro.carteira) || 
            new Date(registro.data_registro!) > new Date(registrosPorCarteira.get(registro.carteira).data_registro!)) {
          registrosPorCarteira.set(registro.carteira, registro);
        }
      });

      const registrosRecentes = Array.from(registrosPorCarteira.values());
      console.log('Registros mais recentes por carteira:', registrosRecentes);
      
      return registrosRecentes;
    },
  });
}

export function useIncidenteOperations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const criarIncidente = useMutation({
    mutationFn: async (data: IncidenteData & { criado_por: string }) => {
      console.log('Criando novo registro de incidente:', data);
      
      const { data: result, error } = await supabase
        .from('incidentes')
        .insert([{
          carteira: data.carteira,
          anterior: data.anterior,
          entrada: data.entrada,
          saida: data.saida,
          atual: data.atual,
          mais_15_dias: data.mais_15_dias,
          criticos: data.criticos,
          criado_por: data.criado_por,
          data_registro: data.data_registro || new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar incidente:', error);
        throw error;
      }

      console.log('Incidente criado com sucesso:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes-recentes'] });
      toast({
        title: "Sucesso",
        description: "Registro de incidente criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar incidente:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar registro de incidente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    criarIncidente,
  };
}
