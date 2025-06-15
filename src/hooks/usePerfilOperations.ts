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

      // Construir objeto apenas com campos que têm valores válidos
      const dadosParaEnviar: any = {
        usuario_id: dados.usuario_id,
        data_atualizacao: new Date().toISOString()
      };

      // Só incluir campos que têm valores não vazios
      if (dados.nome && dados.nome.trim() !== '') {
        dadosParaEnviar.nome = dados.nome.trim();
      }

      if (dados.sobrenome && dados.sobrenome.trim() !== '') {
        dadosParaEnviar.sobrenome = dados.sobrenome.trim();
      }

      if (dados.foto_url && dados.foto_url.trim() !== '') {
        dadosParaEnviar.foto_url = dados.foto_url.trim();
      }

      console.log('Dados que serão enviados:', dadosParaEnviar);

      const { data, error } = await supabase
        .from('perfis_usuario')
        .upsert(dadosParaEnviar, {
          onConflict: 'usuario_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado ao salvar perfil:', error);
        throw error;
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
        description: `Ocorreu um erro ao salvar suas informações: ${error.message}`,
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
        throw uploadError;
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
        description: `Ocorreu um erro ao fazer upload da foto: ${error.message}`,
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
        throw error;
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
        description: "Ocorreu um erro ao alterar sua senha.",
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
