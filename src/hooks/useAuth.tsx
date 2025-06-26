
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { verificarCriacaoNoLogin } from '@/utils/debugIncidentes';
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

interface AuthContextType {
  usuario: Usuario | null;
  userUuid: string | null;
  isLoading: boolean;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isGestor: () => boolean;
  canAccess: (area: string) => boolean;
  atualizarSenha: (senhaAtual: string, novaSenha: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('pmo_token');
      const userData = localStorage.getItem('pmo_user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        
        // Verificar se o token ainda é válido consultando o usuário
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .eq('ativo', true)
          .single();

        if (error || !data) {
          console.log('Token inválido ou usuário inativo, fazendo logout...');
          logout();
        } else {
          // Mapear tipos de usuário do banco para a interface
          const usuarioMapeado: Usuario = {
            id: data.id,
            uuid: `user-${data.id}`,
            nome: data.nome,
            email: data.email,
            tipo_usuario: data.tipo_usuario as 'Admin' | 'Gestor' | 'Usuario',
            areas_atuacao: data.areas_atuacao || [],
            areas_acesso: data.areas_acesso || [],
            ativo: data.ativo,
            senha_padrao: data.senha_padrao
          };
          setUsuario(usuarioMapeado);
          // Buscar UUID do usuário autenticado no Supabase Auth
          const { data: authUser } = await supabase.auth.getUser();
          setUserUuid(authUser?.user?.id || null);
          console.log('✅ Usuário autenticado:', usuarioMapeado.nome);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Garantir que o userUuid e usuario estejam preenchidos mesmo se o usuário já estiver autenticado no Supabase Auth
  useEffect(() => {
    const fetchUserUuid = async () => {
      const { data: authUser } = await supabase.auth.getUser();
      setUserUuid(authUser?.user?.id || null);
      if (authUser?.user?.id) {
        // Se não houver usuario local, criar um mínimo para liberar o fluxo de compartilhamento
        if (!usuario) {
          setUsuario({
            id: -1,
            uuid: `user-${authUser.user.id}`,
            nome: authUser.user.email || 'Usuário Supabase',
            email: authUser.user.email || '',
            tipo_usuario: 'Usuario',
            areas_atuacao: [],
            areas_acesso: [],
            ativo: true,
            senha_padrao: false
          });
          console.log('👤 Usuário local mínimo criado via Supabase Auth:', authUser.user.email);
        }
        setIsLoading(false);
        console.log('🔑 userUuid preenchido via Supabase Auth:', authUser.user.id);
      }
    };
    fetchUserUuid();
    // Listener para mudanças de sessão do Supabase Auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserUuid(session?.user?.id || null);
      if (session?.user?.id) {
        if (!usuario) {
          setUsuario({
            id: -1,
            uuid: `user-${session.user.id}`,
            nome: session.user.email || 'Usuário Supabase',
            email: session.user.email || '',
            tipo_usuario: 'Usuario',
            areas_atuacao: [],
            areas_acesso: [],
            ativo: true,
            senha_padrao: false
          });
          console.log('👤 Usuário local mínimo criado via onAuthStateChange:', session.user.email);
        }
        setIsLoading(false);
        console.log('🔄 userUuid atualizado via onAuthStateChange:', session.user.id);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [usuario]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('ativo', true)
        .single();

      if (error || !data) {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
        return false;
      }

      // Verificar senha - comparar com hash armazenado
      const senhaHash = btoa(senha); // Base64 encoding simples
      if (data.senha_hash !== senhaHash) {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
        return false;
      }

      // Atualizar último login
      await supabase
        .from('usuarios')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('id', data.id);

      // Mapear tipos de usuário do banco para a interface
      const usuarioMapeado: Usuario = {
        id: data.id,
        uuid: `user-${data.id}`,
        nome: data.nome,
        email: data.email,
        tipo_usuario: data.tipo_usuario as 'Admin' | 'Gestor' | 'Usuario',
        areas_atuacao: data.areas_atuacao || [],
        areas_acesso: data.areas_acesso || [],
        ativo: data.ativo,
        senha_padrao: data.senha_padrao
      };

      // Salvar no localStorage
      const token = `pmo_${data.id}_${Date.now()}`;
      localStorage.setItem('pmo_token', token);
      localStorage.setItem('pmo_user', JSON.stringify(usuarioMapeado));
      
      setUsuario(usuarioMapeado);
      // Buscar UUID do usuário autenticado no Supabase Auth
      const { data: authUser } = await supabase.auth.getUser();
      setUserUuid(authUser?.user?.id || null);

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${data.nome}!`,
      });
      
      // INVESTIGAÇÃO: Verificar criação de incidentes após login
      verificarCriacaoNoLogin();
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Erro interno do sistema",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pmo_token');
    localStorage.removeItem('pmo_user');
    setUsuario(null);
    setUserUuid(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    console.log('👋 Logout realizado');
  };

  const isAdmin = () => {
    return usuario?.tipo_usuario === 'Admin';
  };

  const isGestor = () => {
    return usuario?.tipo_usuario === 'Gestor' || usuario?.tipo_usuario === 'Admin';
  };

  const canAccess = (area: string) => {
    if (!usuario) return false;
    if (isAdmin()) return true;
    return usuario.areas_acesso?.includes(area) || false;
  };

  const atualizarSenha = async (senhaAtual: string, novaSenha: string): Promise<boolean> => {
    if (!usuario) return false;

    try {
      // Verificar senha atual
      const senhaAtualHash = btoa(senhaAtual);
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('senha_hash')
        .eq('id', usuario.id)
        .single();

      if (userError || !userData || userData.senha_hash !== senhaAtualHash) {
        toast({
          title: "Erro",
          description: "Senha atual incorreta",
          variant: "destructive",
        });
        return false;
      }

      // Atualizar senha
      const novaSenhaHash = btoa(novaSenha);
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          senha_hash: novaSenhaHash,
          senha_padrao: false 
        })
        .eq('id', usuario.id);

      if (error) {
        throw error;
      }

      setUsuario(prev => prev ? { ...prev, senha_padrao: false } : null);
      toast({
        title: "Sucesso",
        description: "Senha atualizada com sucesso",
      });
      return true;
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

  return (
    <AuthContext.Provider value={{
      usuario,
      userUuid,
      isLoading,
      carregando: isLoading, // Alias para compatibilidade
      login,
      logout,
      isAdmin,
      isGestor,
      canAccess,
      atualizarSenha
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
