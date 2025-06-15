
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Usuario } from '@/types/pmo';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado na sessão
    const savedUser = localStorage.getItem('pmo-user');
    if (savedUser) {
      setUsuario(JSON.parse(savedUser));
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
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      // Por simplicidade, vamos aceitar qualquer senha para o demo
      // Em produção, você deve verificar o hash da senha
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

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isLoading }}>
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
