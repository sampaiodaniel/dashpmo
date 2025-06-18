
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SolicitarAcessoModal } from './SolicitarAcessoModal';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && senha) {
      await login(email, senha);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-pmo-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/d157ae33-1b14-4a31-b5db-2a5d85d550e4.png" 
                alt="DashPMO" 
                className="h-16 w-auto max-w-full"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <CardDescription>
              Faça login para acessar o sistema de gestão de projetos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-pmo-primary hover:bg-pmo-secondary"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setModalAberto(true)}
              >
                Solicitar Acesso
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">Acesso ao sistema:</p>
              <p className="text-xs text-blue-600">Use as credenciais fornecidas pelo administrador</p>
              <p className="text-xs text-blue-600">Não possui acesso? Clique em "Solicitar Acesso"</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <SolicitarAcessoModal 
        aberto={modalAberto} 
        onClose={() => setModalAberto(false)} 
      />
    </>
  );
}
