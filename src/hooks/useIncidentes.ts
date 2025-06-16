
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
      
      // Verificar se já existe um registro para esta carteira e data
      const dataRegistro = data.data_registro || new Date().toISOString().split('T')[0];
      
      const { data: existente } = await supabase
        .from('incidentes')
        .select('id')
        .eq('carteira', data.carteira)
        .eq('data_registro', dataRegistro)
        .single();

      if (existente) {
        throw new Error(`Já existe um registro para a carteira ${data.carteira} na data ${dataRegistro}`);
      }

      // Buscar o último registro dessa carteira para calcular o valor "anterior"
      const { data: ultimoRegistro } = await supabase
        .from('incidentes')
        .select('atual')
        .eq('carteira', data.carteira)
        .order('data_registro', { ascending: false })
        .limit(1)
        .single();

      // O valor "anterior" deve ser o "atual" do último registro, ou 0 se for o primeiro
      const anterior = ultimoRegistro?.atual || 0;
      
      const { data: result, error } = await supabase
        .from('incidentes')
        .insert([{
          carteira: data.carteira,
          anterior: anterior,
          entrada: data.entrada,
          saida: data.saida,
          atual: data.atual,
          mais_15_dias: data.mais_15_dias,
          criticos: data.criticos,
          criado_por: data.criado_por,
          data_registro: dataRegistro
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
      queryClient.invalidateQueries({ queryKey: ['incidentes-historico'] });
      toast({
        title: "Sucesso",
        description: "Registro de incidente criado com sucesso!",
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao criar incidente:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar registro de incidente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    criarIncidente,
  };
}
