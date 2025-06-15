
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

      // Criar objeto apenas com campos definidos
      const dadosLimpos: any = {
        usuario_id: dados.usuario_id,
        data_atualizacao: new Date().toISOString()
      };

      // Só adicionar campos que têm valor
      if (dados.nome !== undefined && dados.nome !== null && dados.nome.trim() !== '') {
        dadosLimpos.nome = dados.nome.trim();
      }

      if (dados.sobrenome !== undefined && dados.sobrenome !== null && dados.sobrenome.trim() !== '') {
        dadosLimpos.sobrenome = dados.sobrenome.trim();
      }

      if (dados.foto_url !== undefined && dados.foto_url !== null && dados.foto_url.trim() !== '') {
        dadosLimpos.foto_url = dados.foto_url.trim();
      }

      console.log('Dados limpos para envio:', dadosLimpos);

      const { data, error } = await supabase
        .from('perfis_usuario')
        .upsert(dadosLimpos, {
          onConflict: 'usuario_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado ao salvar perfil:', error);
        throw new Error(`Erro ao salvar perfil: ${error.message}`);
      }

      console.log('Perfil salvo com sucesso:', data);
      return data;
    },
    onSuccess: () => {
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

      // Hash básico da senha (em produção, use um hash mais seguro)
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
