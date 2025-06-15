
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SolicitacaoAcesso {
  nome: string;
  email: string;
  area: string;
  motivo: string;
}

export function useSolicitarAcesso() {
  const enviarSolicitacao = useMutation({
    mutationFn: async (dados: SolicitacaoAcesso) => {
      console.log('Enviando solicitação de acesso:', dados);
      
      // Chamar edge function para enviar email
      const { data, error } = await supabase.functions.invoke('solicitar-acesso', {
        body: dados
      });

      if (error) {
        console.error('Erro ao enviar solicitação:', error);
        throw error;
      }

      return data;
    },
  });

  return {
    enviarSolicitacao,
  };
}
