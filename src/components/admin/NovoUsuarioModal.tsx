import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Info } from 'lucide-react';
import { useCarteiras } from '@/hooks/useListaValores';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface NovoUsuarioModalProps {
  aberto: boolean;
  onFechar: () => void;
  onSucesso: () => void;
}

export function NovoUsuarioModal({ aberto, onFechar, onSucesso }: NovoUsuarioModalProps) {
  const { data: carteiras = [] } = useCarteiras();
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    tipo_usuario: 'Editor',
    areas_atuacao: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.areas_atuacao.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma carteira.",
        variant: "destructive",
      });
      return;
    }

    setCarregando(true);
    try {
      // Criar usuário com dados básicos que sempre funcionam
      const dadosBasicos = {
        nome: formData.nome,
        email: formData.email.toLowerCase(),
        senha_hash: 'MTIzYXNh', // Base64 de "123asa"
        tipo_usuario: formData.tipo_usuario,
        areas_acesso: ['ASA'], // Campo obrigatório nos tipos antigos
        ativo: true
      };

      const { data, error } = await supabase
        .from('usuarios')
        .insert([dadosBasicos as any])
        .select()
        .single();

      if (error) throw error;

      // Tentar adicionar campos extras se existirem
      try {
        const dadosExtras: any = {};
        
        if (formData.sobrenome) {
          dadosExtras.sobrenome = formData.sobrenome;
        }
        
        if (formData.areas_atuacao.length > 0) {
          dadosExtras.areas_atuacao = formData.areas_atuacao;
        }
        
        dadosExtras.senha_padrao = true;

        if (Object.keys(dadosExtras).length > 0) {
          await supabase
            .from('usuarios')
            .update(dadosExtras)
            .eq('id', data.id);
        }
      } catch (extraError) {
        console.log('Campos extras não existem ainda, usuário criado apenas com dados básicos');
      }

      toast({
        title: "Sucesso",
        description: "Usuário criado com senha padrão '123asa'. O usuário deve alterar a senha no primeiro login.",
      });

      // Resetar formulário
      setFormData({
        nome: '',
        sobrenome: '',
        email: '',
        tipo_usuario: 'Editor',
        areas_atuacao: []
      });

      onSucesso();
      onFechar();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleToggleCarteira = (carteira: string) => {
    setFormData(prev => ({
      ...prev,
      areas_atuacao: prev.areas_atuacao.includes(carteira)
        ? prev.areas_atuacao.filter(c => c !== carteira)
        : [...prev.areas_atuacao, carteira]
    }));
  };

  const handleFechar = () => {
    setFormData({
      nome: '',
      sobrenome: '',
      email: '',
      tipo_usuario: 'Editor',
      areas_atuacao: []
    });
    onFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={handleFechar}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
        </DialogHeader>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Senha Padrão:</strong> Novos usuários são criados com a senha padrão <strong>"123asa"</strong>. 
            O usuário deve alterar esta senha no primeiro login por questões de segurança.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="sobrenome">Sobrenome</Label>
              <Input
                id="sobrenome"
                value={formData.sobrenome}
                onChange={(e) => setFormData(prev => ({ ...prev, sobrenome: e.target.value }))}
                placeholder="Sobrenome"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@empresa.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de Usuário *</Label>
            <Select value={formData.tipo_usuario} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_usuario: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Aprovador">Aprovador</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Leitor">Leitor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Carteiras de Atuação *</Label>
            <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-3">
              {carteiras.map((carteira) => (
                <div key={carteira} className="flex items-center space-x-2">
                  <Checkbox
                    id={`carteira-${carteira}`}
                    checked={formData.areas_atuacao.includes(carteira)}
                    onCheckedChange={() => handleToggleCarteira(carteira)}
                  />
                  <Label htmlFor={`carteira-${carteira}`} className="text-sm cursor-pointer">
                    {carteira}
                  </Label>
                </div>
              ))}
            </div>
            {formData.areas_atuacao.length === 0 && (
              <p className="text-sm text-red-600 mt-1">Selecione pelo menos uma carteira</p>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleFechar}
              disabled={carregando}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Usuário
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
