import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Usuario } from '@/types/pmo';
import { toast } from '@/hooks/use-toast';

export interface UsuarioComPerfil extends Usuario {
  perfil?: {
    nome?: string;
    sobrenome?: string;
    foto_url?: string;
  };
}

// Hash da senha padrão "123asa" em base64
const SENHA_PADRAO_HASH = btoa('123asa');

export function useUsuarios() {
  const { data: usuarios, isLoading, error, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      console.log('Buscando usuários...');
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }

      // Processar usuários para detectar senha padrão
      const usuariosProcessados = data?.map((usuario: any) => {
        // Detectar se está usando senha padrão
        const temSenhaPadrao = 
          usuario.senha_padrao === true || 
          usuario.senha_hash === SENHA_PADRAO_HASH ||
          usuario.senha_hash === btoa('123asa');

        return {
          ...usuario,
          // tipo_usuario já está no formato novo
          senha_padrao: temSenhaPadrao,
          areas_atuacao: usuario.areas_atuacao || []
        };
      }) || [];

      console.log('Usuários carregados:', usuariosProcessados);
      return usuariosProcessados;
    },
    retry: 3,
    staleTime: 30000,
  });

  return {
    data: usuarios,
    isLoading,
    error,
    refetch,
  };
}

export function useUsuariosOperations() {
  const queryClient = useQueryClient();

  const createUsuario = useMutation({
    mutationFn: async (novoUsuario: {
      nome: string;
      sobrenome?: string;
      email: string;
      senha: string;
      tipo_usuario: 'Administrador' | 'Aprovador' | 'Editor' | 'Leitor' | 'GP' | 'Responsavel' | 'Admin';
      areas_acesso: string[];
      ativo: boolean;
    }) => {
      console.log('Criando usuário:', novoUsuario);

      const senhaHash = btoa(novoUsuario.senha);

      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          nome: novoUsuario.nome,
          sobrenome: novoUsuario.sobrenome || null,
          email: novoUsuario.email,
          senha_hash: senhaHash,
          tipo_usuario: novoUsuario.tipo_usuario as any,
          areas_acesso: novoUsuario.areas_acesso,
          ativo: novoUsuario.ativo,
        } as any])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
      }

      console.log('Usuário criado:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    },
  });

  const updateUsuario = useMutation({
    mutationFn: async (usuarioAtualizado: {
      id: number;
      nome: string;
      sobrenome?: string;
      email: string;
      senha?: string;
      tipo_usuario: 'Administrador' | 'Aprovador' | 'Editor' | 'Leitor' | 'GP' | 'Responsavel' | 'Admin';
      areas_acesso: string[];
      ativo: boolean;
    }) => {
      console.log('Atualizando usuário:', usuarioAtualizado);

      const updateData: any = {
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        tipo_usuario: usuarioAtualizado.tipo_usuario,
        areas_acesso: usuarioAtualizado.areas_acesso,
        ativo: usuarioAtualizado.ativo,
      };

      // Adicionar campos opcionais se existirem
      if (usuarioAtualizado.sobrenome !== undefined) {
        updateData.sobrenome = usuarioAtualizado.sobrenome || null;
      }

      if (usuarioAtualizado.senha) {
        updateData.senha_hash = btoa(usuarioAtualizado.senha);
        // Se mudou a senha e não é mais a padrão, marcar como false
        const isNovaSenhaPadrao = usuarioAtualizado.senha === '123asa';
        try {
          updateData.senha_padrao = isNovaSenhaPadrao;
        } catch (e) {
          // Campo não existe ainda
        }
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', usuarioAtualizado.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
      }

      console.log('Usuário atualizado:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['perfil-usuario', data.id] });
      
      const savedUser = localStorage.getItem('pmo-user');
      if (savedUser) {
        const currentUser = JSON.parse(savedUser);
        if (currentUser.id === data.id) {
          const updatedUser = {
            ...currentUser,
            nome: data.nome,
            email: data.email,
            tipo_usuario: data.tipo_usuario,
            areas_acesso: data.areas_acesso,
            ativo: data.ativo
          };
          localStorage.setItem('pmo-user', JSON.stringify(updatedUser));
          window.location.reload();
        }
      }
      
      toast({
        title: "Usuário atualizado",
        description: "O usuário foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    },
  });

  const deleteUsuario = useMutation({
    mutationFn: async (id: number) => {
      console.log('Removendo usuário:', id);

      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover usuário:', error);
        throw error;
      }

      console.log('Usuário removido:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: "Erro ao remover usuário",
        description: "Ocorreu um erro ao remover o usuário.",
        variant: "destructive",
      });
    },
  });

  const resetarSenha = useMutation({
    mutationFn: async (usuarioId: number) => {
      console.log('Resetando senha para usuário:', usuarioId);

      // Primeiro, resetar apenas o hash da senha (campo que sempre existe)
      const { error } = await supabase
        .from('usuarios')
        .update({
          senha_hash: SENHA_PADRAO_HASH
        })
        .eq('id', usuarioId);

      if (error) {
        console.error('Erro ao resetar senha:', error);
        throw error;
      }

      // Tentar atualizar senha_padrao separadamente se a coluna existir
      try {
        await supabase
          .from('usuarios')
          .update({ senha_padrao: true } as any)
          .eq('id', usuarioId);
      } catch (extraError) {
        console.log('Campo senha_padrao não existe ainda, ignorando');
      }

      console.log('Senha resetada para usuário:', usuarioId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: "Senha resetada",
        description: "A senha foi resetada para '123asa'.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao resetar senha:', error);
      toast({
        title: "Erro ao resetar senha",
        description: error.message || "Ocorreu um erro ao resetar a senha.",
        variant: "destructive",
      });
    },
  });

  return {
    createUsuario,
    updateUsuario,
    deleteUsuario,
    resetarSenha,
  };
}
