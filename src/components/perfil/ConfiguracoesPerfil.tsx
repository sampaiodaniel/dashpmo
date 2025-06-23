import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/utils/logger';
import { usePerfilUsuario } from '@/hooks/usePerfilUsuario';
import { Camera, Upload } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function ConfiguracoesPerfil() {
  const { usuario } = useAuth();
  const { log } = useLogger();
  const queryClient = useQueryClient();
  const { data: perfil } = usePerfilUsuario(usuario?.id || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    nome: usuario?.nome?.split(' ')[0] || '',
    sobrenome: usuario?.nome?.split(' ').slice(1).join(' ') || '',
    email: usuario?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !usuario) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho do arquivo (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 2MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${usuario.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Fazer upload da imagem para o storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        toast({
          title: "Erro",
          description: "Erro ao fazer upload da imagem",
          variant: "destructive",
        });
        return;
      }

      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const fotoUrl = urlData.publicUrl;

      // Verificar se já existe um perfil para este usuário
      const { data: perfilExistente } = await supabase
        .from('perfis_usuario')
        .select('id')
        .eq('usuario_id', usuario.id)
        .maybeSingle();

      if (perfilExistente) {
        // Atualizar perfil existente
        const { error: updateError } = await supabase
          .from('perfis_usuario')
          .update({ 
            foto_url: fotoUrl,
            data_atualizacao: new Date().toISOString()
          })
          .eq('usuario_id', usuario.id);

        if (updateError) {
          console.error('Erro ao atualizar foto no perfil:', updateError);
          toast({
            title: "Erro",
            description: "Erro ao atualizar foto de perfil",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Criar novo perfil
        const { error: insertError } = await supabase
          .from('perfis_usuario')
          .insert({
            usuario_id: usuario.id,
            nome: usuario.nome?.split(' ')[0] || '',
            sobrenome: usuario.nome?.split(' ').slice(1).join(' ') || '',
            foto_url: fotoUrl
          });

        if (insertError) {
          console.error('Erro ao criar perfil com foto:', insertError);
          toast({
            title: "Erro",
            description: "Erro ao criar perfil com foto",
            variant: "destructive",
          });
          return;
        }
      }

      // Invalidar cache do perfil para atualizar a interface
      queryClient.invalidateQueries({ queryKey: ['perfil-usuario', usuario.id] });

      // Registrar log da alteração
      log(
        'usuarios',
        'edicao',
        'usuario',
        usuario.id,
        usuario.nome,
        {
          acao_especifica: 'upload_foto_perfil',
          foto_url: fotoUrl
        }
      );

      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da foto",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhoto(false);
      // Limpar o input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!usuario || !perfil?.foto_url) return;

    setIsUploadingPhoto(true);

    try {
      // Atualizar perfil removendo a foto
      const { error: updateError } = await supabase
        .from('perfis_usuario')
        .update({ 
          foto_url: null,
          data_atualizacao: new Date().toISOString()
        })
        .eq('usuario_id', usuario.id);

      if (updateError) {
        console.error('Erro ao remover foto do perfil:', updateError);
        toast({
          title: "Erro",
          description: "Erro ao remover foto de perfil",
          variant: "destructive",
        });
        return;
      }

      // Invalidar cache do perfil para atualizar a interface
      queryClient.invalidateQueries({ queryKey: ['perfil-usuario', usuario.id] });

      // Registrar log da alteração
      log(
        'usuarios',
        'edicao',
        'usuario',
        usuario.id,
        usuario.nome,
        {
          acao_especifica: 'remover_foto_perfil'
        }
      );

      toast({
        title: "Sucesso",
        description: "Foto de perfil removida com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao remover foto:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover foto",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSalvarPerfil = async () => {
    if (!usuario) return;

    setIsLoading(true);
    
    try {
      const updates: any = {};
      
      // Combinar nome e sobrenome
      const nomeCompleto = `${formData.nome.trim()} ${formData.sobrenome.trim()}`.trim();
      
      if (nomeCompleto !== usuario.nome) {
        updates.nome = nomeCompleto;
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

        // Também atualizar na tabela perfis_usuario se existir
        const { data: perfilExistente } = await supabase
          .from('perfis_usuario')
          .select('id')
          .eq('usuario_id', usuario.id)
          .maybeSingle();

        if (perfilExistente) {
          await supabase
            .from('perfis_usuario')
            .update({
              nome: formData.nome.trim(),
              sobrenome: formData.sobrenome.trim(),
              data_atualizacao: new Date().toISOString()
            })
            .eq('usuario_id', usuario.id);
        } else {
          // Criar perfil se não existir
          await supabase
            .from('perfis_usuario')
            .insert({
              usuario_id: usuario.id,
              nome: formData.nome.trim(),
              sobrenome: formData.sobrenome.trim()
            });
        }

        // Invalidar cache do perfil
        queryClient.invalidateQueries({ queryKey: ['perfil-usuario', usuario.id] });

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
              nome: usuario.nome
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
          {/* Foto de Perfil */}
          <div className="flex flex-col items-center space-y-4 pb-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={perfil?.foto_url || "/placeholder.svg"} 
                  alt="Foto de perfil" 
                  className="object-cover"
                />
                <AvatarFallback className="text-lg">
                  {usuario?.nome?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'US'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full h-8 w-8 p-0 bg-white shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isUploadingPhoto ? 'Enviando...' : 'Alterar Foto'}
                </Button>
                
                {perfil?.foto_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                    disabled={isUploadingPhoto}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 text-center max-w-xs">
                Recomendamos uma imagem quadrada de pelo menos 200x200 pixels. Máximo 2MB.
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          
          <Separator />
          
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
              <Label htmlFor="sobrenome">Sobrenome</Label>
              <Input
                id="sobrenome"
                value={formData.sobrenome}
                onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                placeholder="Seu sobrenome"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              readOnly
              disabled
              className="bg-gray-50 cursor-not-allowed"
              placeholder="Email não pode ser alterado"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">O email não pode ser alterado pois é usado para identificação única do usuário</p>
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
