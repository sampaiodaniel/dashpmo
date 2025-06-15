
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Camera, User, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePerfilUsuario, usePerfilOperations } from '@/hooks/usePerfilUsuario';

const perfilSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  sobrenome: z.string().min(1, 'Sobrenome é obrigatório'),
});

const senhaSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string().min(6, 'Confirmação é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type PerfilFormData = z.infer<typeof perfilSchema>;
type SenhaFormData = z.infer<typeof senhaSchema>;

export function ConfiguracoesPerfil() {
  const { usuario } = useAuth();
  const { data: perfil, refetch } = usePerfilUsuario(usuario?.id || 0);
  const { createOrUpdatePerfil, uploadFoto, alterarSenha } = usePerfilOperations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const perfilForm = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: '',
      sobrenome: '',
    },
  });

  const senhaForm = useForm<SenhaFormData>({
    resolver: zodResolver(senhaSchema),
    defaultValues: {
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: '',
    },
  });

  // Atualizar formulário quando perfil carrega
  useEffect(() => {
    if (perfil) {
      console.log('Perfil carregado, atualizando form:', perfil);
      perfilForm.reset({
        nome: perfil.nome || '',
        sobrenome: perfil.sobrenome || '',
      });
    }
  }, [perfil, perfilForm]);

  const onSubmitPerfil = async (data: PerfilFormData) => {
    if (!usuario) {
      console.error('Usuário não encontrado');
      return;
    }

    console.log('Dados do formulário de perfil:', data);

    try {
      await createOrUpdatePerfil.mutateAsync({
        usuario_id: usuario.id,
        nome: data.nome,
        sobrenome: data.sobrenome,
        // Manter foto atual se existir
        foto_url: perfil?.foto_url
      });
      
      // Refetch para atualizar os dados exibidos
      await refetch();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const onSubmitSenha = async (data: SenhaFormData) => {
    if (!usuario) return;

    await alterarSenha.mutateAsync({
      usuarioId: usuario.id,
      novaSenha: data.novaSenha,
    });

    senhaForm.reset();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !usuario) {
      console.log('Arquivo ou usuário não encontrado');
      return;
    }

    console.log('Iniciando upload de arquivo:', file.name);

    try {
      const fotoUrl = await uploadFoto.mutateAsync({ file, usuarioId: usuario.id });
      
      console.log('Upload concluído, URL:', fotoUrl);
      
      // Atualizar perfil com nova foto mantendo dados existentes
      await createOrUpdatePerfil.mutateAsync({
        usuario_id: usuario.id,
        foto_url: fotoUrl,
        nome: perfil?.nome,
        sobrenome: perfil?.sobrenome
      });
      
      // Refetch para atualizar a foto no header
      await refetch();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }
  };

  const getInitials = () => {
    if (perfil?.nome && perfil?.sobrenome) {
      return `${perfil.nome[0]}${perfil.sobrenome[0]}`.toUpperCase();
    }
    return usuario?.nome.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (perfil?.nome && perfil?.sobrenome) {
      return `${perfil.nome} ${perfil.sobrenome}`;
    }
    return usuario?.nome || 'Usuário';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com Avatar e Nome */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={perfil?.foto_url} />
              <AvatarFallback className="bg-pmo-secondary text-white text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-pmo-primary">{getDisplayName()}</h2>
            <p className="text-gray-600">{usuario?.email}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-pmo-primary">Configurações</h1>
        <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e configurações da conta</p>
      </div>

      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Atualize suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...perfilForm}>
            <form onSubmit={perfilForm.handleSubmit(onSubmitPerfil)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={perfilForm.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={perfilForm.control}
                  name="sobrenome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu sobrenome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={usuario?.email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500">O email não pode ser alterado</p>
              </div>

              <Button 
                type="submit" 
                disabled={createOrUpdatePerfil.isPending}
                className="bg-pmo-primary hover:bg-pmo-secondary"
              >
                {createOrUpdatePerfil.isPending ? 'Salvando...' : 'Salvar Informações'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      {/* Alterar Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Altere sua senha de acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...senhaForm}>
            <form onSubmit={senhaForm.handleSubmit(onSubmitSenha)} className="space-y-4">
              <FormField
                control={senhaForm.control}
                name="senhaAtual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite sua senha atual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={senhaForm.control}
                  name="novaSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite a nova senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={senhaForm.control}
                  name="confirmarSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirme a nova senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={alterarSenha.isPending}
                className="bg-pmo-primary hover:bg-pmo-secondary"
              >
                {alterarSenha.isPending ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
