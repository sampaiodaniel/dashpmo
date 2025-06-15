
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Usuario } from '@/types/pmo';
import { toast } from '@/hooks/use-toast';

export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      console.log('Buscando usuários...');
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }

      console.log('Usuários encontrados:', data);
      
      return data.map((usuario): Usuario => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario as 'GP' | 'Responsavel' | 'Admin',
        areas_acesso: usuario.areas_acesso || [],
        ativo: usuario.ativo,
        ultimo_login: usuario.ultimo_login ? new Date(usuario.ultimo_login) : undefined,
        data_criacao: new Date(usuario.data_criacao)
      }));
    },
  });
}

export function useUsuariosOperations() {
  const queryClient = useQueryClient();

  const createUsuario = useMutation({
    mutationFn: async (novoUsuario: {
      nome: string;
      email: string;
      senha: string;
      tipo_usuario: 'GP' | 'Responsavel' | 'Admin';
      areas_acesso: string[];
      ativo: boolean;
    }) => {
      console.log('Criando usuário:', novoUsuario);

      // Para simplicidade, vamos usar um hash básico da senha
      // Em produção, use uma biblioteca de hash adequada
      const senhaHash = btoa(novoUsuario.senha); // Base64 básico - não seguro para produção!

      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          senha_hash: senhaHash,
          tipo_usuario: novoUsuario.tipo_usuario,
          areas_acesso: novoUsuario.areas_acesso,
          ativo: novoUsuario.ativo,
        }])
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
      email: string;
      senha?: string;
      tipo_usuario: 'GP' | 'Responsavel' | 'Admin';
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

      // Se uma nova senha foi fornecida, inclui no update
      if (usuarioAtualizado.senha) {
        updateData.senha_hash = btoa(usuarioAtualizado.senha); // Base64 básico
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
      // Invalidar também o perfil do usuário atualizado
      queryClient.invalidateQueries({ queryKey: ['perfil-usuario', data.id] });
      
      // Se o usuário logado foi atualizado, atualizar o localStorage
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
          // Forçar atualização da página para refletir mudanças
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

  return {
    createUsuario,
    updateUsuario,
    deleteUsuario,
  };
}
