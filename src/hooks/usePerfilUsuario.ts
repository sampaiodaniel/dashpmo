
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PerfilUsuario {
  id: number;
  usuario_id: number;
  nome?: string;
  sobrenome?: string;
  foto_url?: string;
  data_criacao: Date;
  data_atualizacao: Date;
}

export function usePerfilUsuario(usuarioId: number) {
  return useQuery({
    queryKey: ['perfil-usuario', usuarioId],
    queryFn: async (): Promise<PerfilUsuario | null> => {
      if (!usuarioId) return null;
      
      console.log('Buscando perfil do usuário:', usuarioId);
      
      const { data, error } = await supabase
        .from('perfis_usuario')
        .select('*')
        .eq('usuario_id', usuarioId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      if (!data) {
        console.log('Nenhum perfil encontrado para o usuário:', usuarioId);
        return null;
      }

      return {
        id: data.id,
        usuario_id: data.usuario_id,
        nome: data.nome,
        sobrenome: data.sobrenome,
        foto_url: data.foto_url,
        data_criacao: new Date(data.data_criacao),
        data_atualizacao: new Date(data.data_atualizacao)
      };
    },
    enabled: !!usuarioId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
