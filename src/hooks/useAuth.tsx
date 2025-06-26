import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { verificarCriacaoNoLogin } from '@/utils/debugIncidentes';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'admin' | 'usuario' | 'visualizador';
  areas_acesso: string[];
}

interface AuthContextType {
  usuario: Usuario | null;
  userUuid: string | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  canAccess: (area: string) => boolean;
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
            nome: data.nome,
            email: data.email,
            tipo_usuario: data.tipo_usuario === 'Admin' ? 'admin' : 
                         data.tipo_usuario === 'GP' ? 'usuario' : 'visualizador',
            areas_acesso: data.areas_acesso || []
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
            nome: authUser.user.email || 'Usuário Supabase',
            email: authUser.user.email || '',
            tipo_usuario: 'visualizador',
            areas_acesso: []
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
            nome: session.user.email || 'Usuário Supabase',
            email: session.user.email || '',
            tipo_usuario: 'visualizador',
            areas_acesso: []
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
        console.error('Usuário não encontrado ou inativo');
        return false;
      }

      // Verificar senha - comparar com hash armazenado
      const senhaHash = btoa(senha); // Base64 encoding simples
      if (data.senha_hash !== senhaHash) {
        console.error('Senha incorreta');
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
        nome: data.nome,
        email: data.email,
        tipo_usuario: data.tipo_usuario === 'Admin' ? 'admin' : 
                     data.tipo_usuario === 'GP' ? 'usuario' : 'visualizador',
        areas_acesso: data.areas_acesso || []
      };

      // Salvar no localStorage
      const token = `pmo_${data.id}_${Date.now()}`;
      localStorage.setItem('pmo_token', token);
      localStorage.setItem('pmo_user', JSON.stringify(usuarioMapeado));
      
      setUsuario(usuarioMapeado);
      // Buscar UUID do usuário autenticado no Supabase Auth
      const { data: authUser } = await supabase.auth.getUser();
      setUserUuid(authUser?.user?.id || null);
      console.log('✅ Login realizado com sucesso:', usuarioMapeado.nome);
      
      // INVESTIGAÇÃO: Verificar criação de incidentes após login
      verificarCriacaoNoLogin();
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
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
    console.log('👋 Logout realizado');
  };

  const isAdmin = () => {
    return usuario?.tipo_usuario === 'admin';
  };

  const canAccess = (area: string) => {
    if (!usuario) return false;
    if (isAdmin()) return true;
    return usuario.areas_acesso?.includes(area) || false;
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      userUuid,
      isLoading,
      login,
      logout,
      isAdmin,
      canAccess
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
