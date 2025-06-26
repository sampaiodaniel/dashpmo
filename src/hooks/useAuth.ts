import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Usuario {
  id: number;
  uuid: string;
  nome: string;
  email: string;
  tipo_usuario: 'Admin' | 'Gestor' | 'Usuario';
  areas_atuacao: string[];
  areas_acesso: string[];
  ativo: boolean;
  senha_padrao: boolean;
}

interface UseAuthReturn {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isGestor: () => boolean;
  atualizarSenha: (senhaAtual: string, novaSenha: string) => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    verificarSessao();
  }, []);

  const verificarSessao = async () => {
    try {
      const sessaoSalva = localStorage.getItem('sessao_usuario');
      if (!sessaoSalva) {
        setCarregando(false);
        return;
      }

      const dadosSessao = JSON.parse(sessaoSalva);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', dadosSessao.id)
        .eq('ativo', true)
        .single();

      if (error || !data) {
        localStorage.removeItem('sessao_usuario');
        setCarregando(false);
        return;
      }

      setUsuario({
        id: data.id,
        uuid: `user-${data.id}`, // Gerar UUID simples
        nome: data.nome,
        email: data.email,
        tipo_usuario: data.tipo_usuario,
        areas_atuacao: data.areas_atuacao || [],
        areas_acesso: data.areas_acesso || [],
        ativo: data.ativo,
        senha_padrao: data.senha_padrao
      });
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      localStorage.removeItem('sessao_usuario');
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setCarregando(true);
      
      const { data, error } = await supabase.rpc('login_usuario', {
        p_email: email,
        p_senha: senha
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
        return false;
      }

      if (data && data.length > 0) {
        const userData = data[0];
        const usuarioLogado: Usuario = {
          id: userData.id,
          uuid: `user-${userData.id}`, // Gerar UUID simples
          nome: userData.nome,
          email: userData.email,
          tipo_usuario: userData.tipo_usuario,
          areas_atuacao: userData.areas_atuacao || [],
          areas_acesso: userData.areas_acesso || [],
          ativo: userData.ativo,
          senha_padrao: userData.senha_padrao
        };

        setUsuario(usuarioLogado);
        localStorage.setItem('sessao_usuario', JSON.stringify({ id: userData.id }));

        // Atualizar último login
        await supabase
          .from('usuarios')
          .update({ ultimo_login: new Date().toISOString() })
          .eq('id', userData.id);

        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${userData.nome}!`,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Erro interno do sistema",
        variant: "destructive",
      });
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUsuario(null);
      localStorage.removeItem('sessao_usuario');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const isAdmin = (): boolean => {
    return usuario?.tipo_usuario === 'Admin';
  };

  const isGestor = (): boolean => {
    return usuario?.tipo_usuario === 'Gestor' || usuario?.tipo_usuario === 'Admin';
  };

  const atualizarSenha = async (senhaAtual: string, novaSenha: string): Promise<boolean> => {
    if (!usuario) return false;

    try {
      const { data, error } = await supabase.rpc('atualizar_senha_usuario', {
        p_usuario_id: usuario.id,
        p_senha_atual: senhaAtual,
        p_nova_senha: novaSenha
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Senha atual incorreta",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        setUsuario(prev => prev ? { ...prev, senha_padrao: false } : null);
        toast({
          title: "Sucesso",
          description: "Senha atualizada com sucesso",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      toast({
        title: "Erro",
        description: "Erro interno do sistema",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    usuario,
    carregando,
    login,
    logout,
    isAdmin,
    isGestor,
    atualizarSenha,
  };
}
