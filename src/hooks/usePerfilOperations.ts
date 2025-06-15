
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function usePerfilOperations() {
  const queryClient = useQueryClient();

  const createOrUpdatePerfil = useMutation({
    mutationFn: async (dados: {
      usuario_id: number;
      nome?: string;
      sobrenome?: string;
      foto_url?: string;
    }) => {
      console.log('Criando/atualizando perfil:', dados);

      // Primeiro, verificar se já existe um perfil para este usuário
      const { data: existingProfile, error: checkError } = await supabase
        .from('perfis_usuario')
        .select('id')
        .eq('usuario_id', dados.usuario_id)
        .maybeSingle();

      if (checkError) {
        console.error('Erro ao verificar perfil existente:', checkError);
        throw new Error(`Erro ao verificar perfil: ${checkError.message}`);
      }

      let result;

      if (existingProfile) {
        // Atualizar perfil existente
        const { data, error } = await supabase
          .from('perfis_usuario')
          .update({
            nome: dados.nome || null,
            sobrenome: dados.sobrenome || null,
            foto_url: dados.foto_url || null,
            data_atualizacao: new Date().toISOString()
          })
          .eq('usuario_id', dados.usuario_id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar perfil:', error);
          throw new Error(`Erro ao atualizar perfil: ${error.message}`);
        }

        result = data;
      } else {
        // Criar novo perfil
        const { data, error } = await supabase
          .from('perfis_usuario')
          .insert({
            usuario_id: dados.usuario_id,
            nome: dados.nome || null,
            sobrenome: dados.sobrenome || null,
            foto_url: dados.foto_url || null,
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar perfil:', error);
          throw new Error(`Erro ao criar perfil: ${error.message}`);
        }

        result = data;
      }

      console.log('Perfil salvo com sucesso:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidar cache para forçar recarregamento dos dados
      queryClient.invalidateQueries({ queryKey: ['perfil-usuario'] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: `${error.message}`,
        variant: "destructive",
      });
    },
  });

  const uploadFoto = useMutation({
    mutationFn: async ({ file, usuarioId }: { file: File; usuarioId: number }) => {
      console.log('Iniciando upload da foto para usuário:', usuarioId);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${usuarioId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log('Fazendo upload do arquivo:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('URL da foto gerada:', data.publicUrl);
      return data.publicUrl;
    },
    onSuccess: () => {
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao fazer upload da foto:', error);
      toast({
        title: "Erro ao atualizar foto",
        description: `${error.message}`,
        variant: "destructive",
      });
    },
  });

  const alterarSenha = useMutation({
    mutationFn: async ({ usuarioId, novaSenha }: { usuarioId: number; novaSenha: string }) => {
      console.log('Alterando senha do usuário:', usuarioId);

      const senhaHash = btoa(novaSenha);

      const { error } = await supabase
        .from('usuarios')
        .update({ senha_hash: senhaHash })
        .eq('id', usuarioId);

      if (error) {
        console.error('Erro ao alterar senha:', error);
        throw new Error(`Erro ao alterar senha: ${error.message}`);
      }
    },
    onSuccess: () => {
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro ao alterar senha",
        description: `${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    createOrUpdatePerfil,
    uploadFoto,
    alterarSenha,
  };
}
