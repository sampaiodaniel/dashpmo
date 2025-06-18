
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/utils/logger';

export function ConfiguracoesPerfil() {
  const { usuario } = useAuth();
  const { log } = useLogger();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvarPerfil = async () => {
    if (!usuario) return;

    setIsLoading(true);
    
    try {
      const updates: any = {};
      
      if (formData.nome !== usuario.nome) {
        updates.nome = formData.nome;
      }
      
      if (formData.email !== usuario.email) {
        updates.email = formData.email;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('usuarios')
          .update(updates)
          .eq('id', usuario.id);

        if (error) {
          console.error('Erro ao atualizar perfil:', error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar perfil",
            variant: "destructive",
          });
          return;
        }

        // Registrar log da alteração de perfil
        log(
          'usuarios',
          'edicao',
          'usuario',
          usuario.id,
          usuario.nome,
          {
            campos_alterados: Object.keys(updates),
            valores_anteriores: {
              nome: usuario.nome,
              email: usuario.email
            }
          }
        );

        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso!",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlterarSenha = async () => {
    if (!usuario) return;

    if (!formData.senhaAtual || !formData.novaSenha || !formData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos de senha",
        variant: "destructive",
      });
      return;
    }

    if (formData.novaSenha !== formData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "A nova senha e confirmação não coincidem",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verificar senha atual
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('senha_hash')
        .eq('id', usuario.id)
        .single();

      if (userError || !userData) {
        toast({
          title: "Erro",
          description: "Erro ao verificar senha atual",
          variant: "destructive",
        });
        return;
      }

      const senhaAtualHash = btoa(formData.senhaAtual);
      if (userData.senha_hash !== senhaAtualHash) {
        toast({
          title: "Erro",
          description: "Senha atual incorreta",
          variant: "destructive",
        });
        return;
      }

      // Atualizar senha
      const novaSenhaHash = btoa(formData.novaSenha);
      const { error } = await supabase
        .from('usuarios')
        .update({ senha_hash: novaSenhaHash })
        .eq('id', usuario.id);

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar senha",
          variant: "destructive",
        });
        return;
      }

      // Registrar log da alteração de senha
      log(
        'usuarios',
        'edicao',
        'usuario',
        usuario.id,
        usuario.nome,
        {
          acao_especifica: 'alteracao_senha'
        }
      );

      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      }));

      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSalvarPerfil}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="senhaAtual">Senha Atual</Label>
            <Input
              id="senhaAtual"
              type="password"
              value={formData.senhaAtual}
              onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
              placeholder="Digite sua senha atual"
            />
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <Input
                id="novaSenha"
                type="password"
                value={formData.novaSenha}
                onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>
            <div>
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleAlterarSenha}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
