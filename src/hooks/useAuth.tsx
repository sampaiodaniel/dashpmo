
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '@/types/pmo';

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
    // Simular verificação de sessão
    const savedUser = localStorage.getItem('pmo-user');
    if (savedUser) {
      setUsuario(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular dados de usuário para demonstração
    const mockUser: Usuario = {
      id: 1,
      nome: 'João Silva',
      email: email,
      tipo_usuario: 'Admin',
      areas_acesso: ['Área 1', 'Área 2', 'Área 3'],
      ativo: true,
      ultimo_login: new Date(),
      data_criacao: new Date('2024-01-01')
    };

    // Simular validação
    if (email && senha) {
      setUsuario(mockUser);
      localStorage.setItem('pmo-user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('pmo-user');
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
