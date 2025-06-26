import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCarteirasPermitidas } from './useCarteirasPermitidas';

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
  const carteirasPermitidas = useCarteirasPermitidas();
  return useQuery({
    queryKey: ['incidentes-recentes'],
    queryFn: async () => {
      console.log('🔍 Buscando registros mais recentes por carteira...');
      
      const { data, error } = await supabase
        .from('incidentes')
        .select('*')
        .order('data_registro', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar incidentes:', error);
        throw error;
      }

      console.log('📋 Todos os registros encontrados:', data);

      // Agrupar por carteira e pegar o mais recente de cada uma
      const registrosPorCarteira = new Map();
      
      data?.forEach(registro => {
        if (!registrosPorCarteira.has(registro.carteira) || 
            new Date(registro.data_registro!) > new Date(registrosPorCarteira.get(registro.carteira).data_registro!)) {
          registrosPorCarteira.set(registro.carteira, registro);
        }
      });

      let registrosRecentes = Array.from(registrosPorCarteira.values());

      // Filtrar por carteiras se o usuário não for admin
      if (carteirasPermitidas.length > 0) {
        registrosRecentes = registrosRecentes.filter(r => carteirasPermitidas.includes(r.carteira));
        console.log('🔒 Filtro de carteiras aplicado nos incidentes:', carteirasPermitidas);
      }

      return registrosRecentes;
    },
  });
}

export function useIncidenteOperations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const criarIncidente = useMutation({
    mutationFn: async (data: IncidenteData & { criado_por: string }) => {
      console.log('🆕 Criando novo registro de incidente:', data);
      
      // Verificar se já existe um registro para esta carteira e data
      const dataRegistro = data.data_registro || new Date().toISOString().split('T')[0];
      
      console.log(`🔍 Verificando registros existentes para carteira: ${data.carteira} e data: ${dataRegistro}`);
      
      const { data: existente, error: checkError } = await supabase
        .from('incidentes')
        .select('id')
        .eq('carteira', data.carteira)
        .eq('data_registro', dataRegistro);

      if (checkError) {
        console.error('❌ Erro ao verificar registros existentes:', checkError);
        throw checkError;
      }

      if (existente && existente.length > 0) {
        console.log('⚠️ Registro existente encontrado:', existente);
        throw new Error(`Já existe um registro para a carteira ${data.carteira} na data ${dataRegistro}`);
      }

      // Se não foi fornecido um valor atual customizado, calcular automaticamente
      let anteriorCalculado = data.anterior;
      let atualCalculado = data.atual;
      
      // Se o valor atual não foi customizado, buscar o último registro para calcular
      if (data.atual === (data.anterior + data.entrada - data.saida)) {
        // Buscar o último registro dessa carteira para calcular o valor "anterior"
        const { data: ultimoRegistro } = await supabase
          .from('incidentes')
          .select('atual')
          .eq('carteira', data.carteira)
          .order('data_registro', { ascending: false })
          .limit(1)
          .maybeSingle();

        anteriorCalculado = ultimoRegistro?.atual || 0;
        atualCalculado = anteriorCalculado + data.entrada - data.saida;
      }
      
      const { data: result, error } = await supabase
        .from('incidentes')
        .insert([{
          carteira: data.carteira,
          anterior: anteriorCalculado,
          entrada: data.entrada,
          saida: data.saida,
          atual: atualCalculado,
          mais_15_dias: data.mais_15_dias,
          criticos: data.criticos,
          criado_por: data.criado_por,
          data_registro: dataRegistro
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar incidente:', error);
        throw error;
      }

      console.log('✅ Incidente criado com sucesso:', result);
      console.log(`📊 Carteira: ${data.carteira}, Anterior: ${anteriorCalculado}, Entradas: ${data.entrada}, Saídas: ${data.saida}, Atual: ${atualCalculado}`);
      
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
      console.error('❌ Erro ao criar incidente:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar registro de incidente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const editarIncidente = useMutation({
    mutationFn: async (data: { id: number } & Partial<IncidenteData>) => {
      console.log('✏️ Editando registro de incidente:', data);
      
      const { data: result, error } = await supabase
        .from('incidentes')
        .update({
          carteira: data.carteira,
          anterior: data.anterior,
          entrada: data.entrada,
          saida: data.saida,
          atual: data.atual,
          mais_15_dias: data.mais_15_dias,
          criticos: data.criticos,
          data_registro: data.data_registro
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao editar incidente:', error);
        throw error;
      }

      console.log('✅ Incidente editado com sucesso:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes-recentes'] });
      queryClient.invalidateQueries({ queryKey: ['incidentes-historico'] });
      toast({
        title: "Sucesso",
        description: "Registro de incidente editado com sucesso!",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao editar incidente:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao editar registro de incidente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const excluirIncidente = useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Excluindo registro de incidente com ID:', id);
      
      // Primeiro verificar se o registro existe
      const { data: existing, error: checkError } = await supabase
        .from('incidentes')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('❌ Erro ao verificar registro existente:', checkError);
        throw checkError;
      }

      console.log('📋 Registro a ser excluído:', existing);

      const { error } = await supabase
        .from('incidentes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao excluir incidente:', error);
        throw error;
      }

      console.log('✅ Incidente excluído com sucesso. ID:', id);
      
      // Verificar se realmente foi excluído
      const { data: verification } = await supabase
        .from('incidentes')
        .select('id')
        .eq('id', id);

      if (verification && verification.length > 0) {
        console.error('⚠️ Registro ainda existe após tentativa de exclusão!');
        throw new Error('Falha na exclusão do registro');
      }

      console.log('✅ Exclusão verificada com sucesso');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes-recentes'] });
      queryClient.invalidateQueries({ queryKey: ['incidentes-historico'] });
      toast({
        title: "Sucesso",
        description: "Registro de incidente excluído com sucesso!",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao excluir incidente:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir registro de incidente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    criarIncidente,
    editarIncidente,
    excluirIncidente,
  };
}
