import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Save, X, AlertTriangle, Users, Key } from 'lucide-react';
import { useUsuarios, useUsuariosOperations } from '@/hooks/useUsuarios';
import { useCarteiras } from '@/hooks/useListaValores';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NovoUsuarioModal } from './NovoUsuarioModal';

interface Usuario {
  id: number;
  nome: string;
  sobrenome?: string;
  email: string;
  tipo_usuario: string;
  areas_atuacao: string[];
  senha_padrao: boolean;
  ativo: boolean;
  ultimo_login?: string;
}

export function AdminUsuarios() {
  const { data: usuarios, isLoading, refetch } = useUsuarios();
  const { data: carteiras = [] } = useCarteiras();
  const { resetarSenha } = useUsuariosOperations();
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [usuarioFormulario, setUsuarioFormulario] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    tipo_usuario: 'Editor',
    areas_atuacao: [] as string[]
  });
  const [carregando, setCarregando] = useState(false);

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioFormulario({
      nome: usuario.nome,
      sobrenome: usuario.sobrenome || '',
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      areas_atuacao: usuario.areas_atuacao || []
    });
    setEditandoId(usuario.id);
  };

  const handleSalvarEdicao = async () => {
    if (!usuarioFormulario.nome || !usuarioFormulario.email || !usuarioFormulario.tipo_usuario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setCarregando(true);
    try {
      console.log('Salvando usuário:', editandoId, usuarioFormulario);

      // Dados completos (já compatíveis com a estrutura nova)
      const dadosCompletos: any = {
        nome: usuarioFormulario.nome,
        email: usuarioFormulario.email.toLowerCase(),
        tipo_usuario: usuarioFormulario.tipo_usuario, // agora enum novo
      };

      // Incluir sempre os campos extras, mesmo se vazios
      dadosCompletos.sobrenome = usuarioFormulario.sobrenome || null;
      dadosCompletos.areas_atuacao = usuarioFormulario.areas_atuacao;

      // 1ª tentativa: salvar tudo direto
      let updateError = null;
      const { error: erroCompleto } = await supabase
        .from('usuarios')
        .update(dadosCompletos)
        .eq('id', editandoId);

      if (erroCompleto) {
        console.warn('Erro na atualização completa, tentando fallback:', erroCompleto.message);
        updateError = erroCompleto;
      }

      if (updateError) {
        // 2ª tentativa: remover campos extras se deu erro (ex.: coluna faltando)
        const dadosBasicos: any = {
          nome: usuarioFormulario.nome,
          email: usuarioFormulario.email.toLowerCase(),
          tipo_usuario: usuarioFormulario.tipo_usuario as any,
        };

        const { error: erroBasico } = await supabase
          .from('usuarios')
          .update(dadosBasicos)
          .eq('id', editandoId);

        if (erroBasico) {
          console.error('Erro no update básico:', erroBasico);
          throw erroBasico;
        }

        // Tentar salvar extras separadamente se colunas existirem
        const extras: any = {
          sobrenome: usuarioFormulario.sobrenome || null,
          areas_atuacao: usuarioFormulario.areas_atuacao,
        };
        const { error: erroExtras } = await supabase
          .from('usuarios')
          .update(extras as any)
          .eq('id', editandoId);
        if (erroExtras) {
          console.warn('Não foi possível salvar campos extras:', erroExtras.message);
        }
      }

      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso.",
      });

      setEditandoId(null);
      refetch();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleResetarSenha = async (usuarioId: number) => {
    try {
      await resetarSenha.mutateAsync(usuarioId);
      refetch();
    } catch (error: any) {
      // O erro já é tratado no hook
      console.error('Erro ao resetar senha:', error);
    }
  };

  const handleToggleAreaAtuacao = (area: string) => {
    setUsuarioFormulario(prev => ({
      ...prev,
      areas_atuacao: prev.areas_atuacao.includes(area)
        ? prev.areas_atuacao.filter(a => a !== area)
        : [...prev.areas_atuacao, area]
    }));
  };

  const getNomeCompleto = (usuario: Usuario) => {
    if (usuario.sobrenome) {
      return `${usuario.nome} ${usuario.sobrenome}`;
    }
    return usuario.nome;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h2>
          <p className="text-gray-600 mt-1">
            Gerencie usuários, permissões e áreas de atuação por carteiras
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {usuarios?.length || 0} usuários
          </Badge>
          <Button onClick={() => setModalNovoAberto(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>
      </div>

      {/* Seção de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovadores</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {usuarios?.filter(u => u.tipo_usuario === 'Aprovador').length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Editores</p>
                <p className="text-2xl font-bold text-blue-600">
                  {usuarios?.filter(u => u.tipo_usuario === 'Editor').length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leitores</p>
                <p className="text-2xl font-bold text-green-600">
                  {usuarios?.filter(u => u.tipo_usuario === 'Leitor').length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios && usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <div 
                  key={usuario.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => editandoId !== usuario.id && handleEditarUsuario(usuario)}
                >
                  {editandoId === usuario.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Nome</Label>
                          <Input
                            value={usuarioFormulario.nome}
                            onChange={(e) => setUsuarioFormulario(prev => ({ ...prev, nome: e.target.value }))}
                            placeholder="Nome"
                          />
                        </div>
                        
                        <div>
                          <Label>Sobrenome</Label>
                          <Input
                            value={usuarioFormulario.sobrenome}
                            onChange={(e) => setUsuarioFormulario(prev => ({ ...prev, sobrenome: e.target.value }))}
                            placeholder="Sobrenome"
                          />
                        </div>
                        
                        <div>
                          <Label>E-mail</Label>
                          <Input
                            value={usuarioFormulario.email}
                            onChange={(e) => setUsuarioFormulario(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="E-mail"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Tipo de Usuário</Label>
                        <Select value={usuarioFormulario.tipo_usuario} onValueChange={(value) => setUsuarioFormulario(prev => ({ ...prev, tipo_usuario: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de usuário" />
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
                        <Label>Carteiras de Atuação</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-3">
                          {carteiras.map((carteira) => (
                            <div key={carteira} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-carteira-${carteira}`}
                                checked={usuarioFormulario.areas_atuacao.includes(carteira)}
                                onCheckedChange={() => handleToggleAreaAtuacao(carteira)}
                              />
                              <Label htmlFor={`edit-carteira-${carteira}`} className="text-sm cursor-pointer">
                                {carteira}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSalvarEdicao} 
                          disabled={carregando}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                        <Button 
                          onClick={() => setEditandoId(null)} 
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-lg">{getNomeCompleto(usuario)}</h3>
                          <Badge variant="outline">{usuario.tipo_usuario}</Badge>
                          {(usuario.senha_padrao === true || usuario.senha_padrao === 'true') && (
                            <Badge variant="destructive" className="text-xs">
                              Senha Padrão
                            </Badge>
                          )}
                          {!usuario.ativo && (
                            <Badge variant="secondary" className="text-xs">
                              Inativo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{usuario.email}</p>
                        <div className="flex flex-wrap gap-1">
                          {usuario.areas_atuacao?.length > 0 ? (
                            usuario.areas_atuacao.map((area) => (
                              <Badge key={area} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Nenhuma carteira definida
                            </Badge>
                          )}
                        </div>
                        {usuario.ultimo_login && (
                          <p className="text-xs text-gray-500 mt-1">
                            Último login: {new Date(usuario.ultimo_login).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetarSenha(usuario.id);
                          }}
                          size="sm"
                          variant="outline"
                          disabled={carregando}
                          title="Resetar senha para 123asa"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                <p className="text-gray-600">Comece criando o primeiro usuário do sistema.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para Novo Usuário */}
      <NovoUsuarioModal
        aberto={modalNovoAberto}
        onFechar={() => setModalNovoAberto(false)}
        onSucesso={() => refetch()}
      />
    </div>
  );
}
