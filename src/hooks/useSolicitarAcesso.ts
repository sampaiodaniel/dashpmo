
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
      console.log('🚀 Enviando solicitação de acesso:', dados);
      
      try {
        // Chamar edge function para enviar email
        const { data, error } = await supabase.functions.invoke('solicitar-acesso', {
          body: {
            nome: dados.nome,
            email: dados.email,
            telefone: dados.area, // Usando area como telefone temporariamente
            motivo: dados.motivo
          }
        });

        if (error) {
          console.error('❌ Erro ao chamar função:', error);
          throw new Error(`Erro ao enviar email: ${error.message}`);
        }

        console.log('✅ Resposta da função:', data);
        return data;
      } catch (err) {
        console.error('💥 Erro inesperado:', err);
        throw err;
      }
    },
  });

  return {
    enviarSolicitacao,
  };
}
