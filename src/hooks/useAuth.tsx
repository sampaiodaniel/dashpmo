
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Usuario } from '@/types/pmo';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: () => boolean;
  isAprovador: () => boolean;
  canApprove: () => boolean;
  canAdminister: () => boolean;
  refreshUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados atualizados do usuário
  const refreshUsuario = async () => {
    const savedUser = localStorage.getItem('pmo-user');
    if (!savedUser) return;

    const userFromStorage = JSON.parse(savedUser);
    
    try {
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userFromStorage.id)
        .single();

      if (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        return;
      }

      const updatedUser: Usuario = {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        tipo_usuario: userData.tipo_usuario as 'GP' | 'Responsavel' | 'Admin',
        areas_acesso: userData.areas_acesso || [],
        ativo: userData.ativo,
        ultimo_login: userData.ultimo_login ? new Date(userData.ultimo_login) : undefined,
        data_criacao: new Date(userData.data_criacao)
      };

      setUsuario(updatedUser);
      localStorage.setItem('pmo-user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao buscar usuário atualizado:', error);
    }
  };

  useEffect(() => {
    // Verificar se há usuário logado na sessão
    const savedUser = localStorage.getItem('pmo-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUsuario(user);
      
      // Buscar dados atualizados do usuário no banco
      refreshUsuario();
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Buscar usuário no banco de dados
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('ativo', true)
        .single();

      if (error || !userData) {
        toast({
          title: "Erro de Login",
          description: "Email não encontrado ou usuário inativo",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      // Verificar senha - comparar com hash armazenado
      const senhaHash = btoa(senha); // Base64 básico para demonstração
      if (userData.senha_hash !== senhaHash) {
        toast({
          title: "Erro de Login", 
          description: "Senha incorreta",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      const user: Usuario = {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        tipo_usuario: userData.tipo_usuario as 'GP' | 'Responsavel' | 'Admin',
        areas_acesso: userData.areas_acesso || [],
        ativo: userData.ativo,
        ultimo_login: userData.ultimo_login ? new Date(userData.ultimo_login) : undefined,
        data_criacao: new Date(userData.data_criacao)
      };

      // Atualizar último login
      await supabase
        .from('usuarios')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('id', userData.id);

      setUsuario(user);
      localStorage.setItem('pmo-user', JSON.stringify(user));
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.nome}!`,
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro de Login",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('pmo-user');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  // Funções de verificação de permissões
  const isAdmin = () => usuario?.tipo_usuario === 'Admin';
  const isAprovador = () => usuario?.tipo_usuario === 'Responsavel';
  const canApprove = () => isAdmin() || isAprovador();
  const canAdminister = () => isAdmin();

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      isLoading,
      isAdmin,
      isAprovador,
      canApprove,
      canAdminister,
      refreshUsuario
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
