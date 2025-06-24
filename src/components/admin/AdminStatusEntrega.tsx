import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical, Save, X, AlertTriangle, Database, CheckCircle } from 'lucide-react';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';
import { supabase } from '@/integrations/supabase/client';

export function AdminStatusEntrega() {
  const {
    statusEntrega,
    isLoading,
    carregando,
    criarStatusEntrega,
    atualizarStatusEntrega,
    deletarStatusEntrega,
    reordenarStatusEntrega,
  } = useStatusEntrega();

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [novoStatus, setNovoStatus] = useState({
    nome: '',
    cor: '#10B981',
    descricao: '',
    ordem: statusEntrega.length + 1
  });
  const [statusFormulario, setStatusFormulario] = useState({
    nome: '',
    cor: '#10B981',
    descricao: ''
  });
  const [migracaoStatus, setMigracaoStatus] = useState<{
    camposExistem: boolean;
    tabelaExiste: boolean;
    verificando: boolean;
    erro?: string;
  }>({
    camposExistem: false,
    tabelaExiste: false,
    verificando: true
  });

  // Verificar status da migração
  useEffect(() => {
    const verificarMigracao = async () => {
      try {
        setMigracaoStatus(prev => ({ ...prev, verificando: true }));

        // Verificar se campos existem na tabela status_projeto
        const { data: camposData, error: camposError } = await supabase
          .from('status_projeto')
          .select('status_entrega1_id')
          .limit(1);

        const camposExistem = !camposError || !camposError.message?.includes('column');

        // Verificar se tabela tipos_status_entrega existe
        const { data: tabelaData, error: tabelaError } = await supabase
          .from('tipos_status_entrega' as any)
          .select('id')
          .limit(1);

        const tabelaExiste = !tabelaError;

        setMigracaoStatus({
          camposExistem,
          tabelaExiste,
          verificando: false
        });

      } catch (error) {
        console.error('Erro ao verificar migração:', error);
        setMigracaoStatus({
          camposExistem: false,
          tabelaExiste: false,
          verificando: false,
          erro: 'Erro ao verificar status da migração'
        });
      }
    };

    verificarMigracao();
  }, []);

  const handleSalvarNovo = async () => {
    if (!novoStatus.nome.trim()) return;

    try {
      await criarStatusEntrega.mutate({
        nome: novoStatus.nome,
        cor: novoStatus.cor,
        descricao: novoStatus.descricao,
        ordem: novoStatus.ordem
      });

      setNovoStatus({
        nome: '',
        cor: '#10B981',
        descricao: '',
        ordem: statusEntrega.length + 2
      });
    } catch (error) {
      console.error('Erro ao criar status:', error);
    }
  };

  const handleIniciarEdicao = (status: any) => {
    setEditandoId(status.id);
    setStatusFormulario({
      nome: status.nome,
      cor: status.cor,
      descricao: status.descricao || ''
    });
  };

  const handleSalvarEdicao = async () => {
    if (!editandoId || !statusFormulario.nome.trim()) return;

    try {
      await atualizarStatusEntrega.mutate({
        id: editandoId,
        dados: statusFormulario
      });

      setEditandoId(null);
      setStatusFormulario({ nome: '', cor: '#10B981', descricao: '' });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setStatusFormulario({ nome: '', cor: '#10B981', descricao: '' });
  };

  const handleDeletar = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este status?')) {
      try {
        await deletarStatusEntrega.mutate(id);
      } catch (error) {
        console.error('Erro ao deletar status:', error);
      }
    }
  };

  if (isLoading || migracaoStatus.verificando) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pmo-primary">Status de Entrega</h2>
        <p className="text-gray-600 mt-2">
          Gerencie os tipos de status que podem ser atribuídos às entregas dos projetos.
        </p>
      </div>

      {/* Status da Migração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status da Migração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {migracaoStatus.tabelaExiste ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <span className="font-medium">Tabela tipos_status_entrega:</span>
              </div>
              <Badge variant={migracaoStatus.tabelaExiste ? "secondary" : "outline"}>
                {migracaoStatus.tabelaExiste ? "Existe" : "Não existe"}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {migracaoStatus.camposExistem ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <span className="font-medium">Campos no banco:</span>
              </div>
              <Badge variant={migracaoStatus.camposExistem ? "secondary" : "outline"}>
                {migracaoStatus.camposExistem ? "Existem" : "Não existem"}
              </Badge>
            </div>
          </div>

          {migracaoStatus.erro && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {migracaoStatus.erro}
              </AlertDescription>
            </Alert>
          )}

          {!migracaoStatus.camposExistem && !migracaoStatus.tabelaExiste && (
            <Alert className="mt-4 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>⚠️ Migração não aplicada:</strong> O sistema está funcionando com cache local.
                Para persistir os dados no banco, aplique a migração usando os scripts fornecidos.
              </AlertDescription>
            </Alert>
          )}

          {migracaoStatus.camposExistem && migracaoStatus.tabelaExiste && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>✅ Migração aplicada:</strong> Todos os dados serão salvos diretamente no banco de dados.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Criar Novo Status */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="novo-nome">Nome do Status</Label>
              <Input
                id="novo-nome"
                value={novoStatus.nome}
                onChange={(e) => setNovoStatus(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Em Andamento"
              />
            </div>
            
            <div>
              <Label htmlFor="nova-cor">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="nova-cor"
                  type="color"
                  value={novoStatus.cor}
                  onChange={(e) => setNovoStatus(prev => ({ ...prev, cor: e.target.value }))}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={novoStatus.cor}
                  onChange={(e) => setNovoStatus(prev => ({ ...prev, cor: e.target.value }))}
                  placeholder="#10B981"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="nova-descricao">Descrição (opcional)</Label>
            <Textarea
              id="nova-descricao"
              value={novoStatus.descricao}
              onChange={(e) => setNovoStatus(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição do status..."
              rows={2}
            />
          </div>
          
          <Button 
            onClick={handleSalvarNovo} 
            disabled={!novoStatus.nome.trim() || criarStatusEntrega.isPending}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {criarStatusEntrega.isPending ? 'Criando...' : 'Criar Status'}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Status Existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Status Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          {statusEntrega.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum status configurado ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {statusEntrega.map((status) => (
                <div key={status.id} className="border rounded-lg p-4">
                  {editandoId === status.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nome</Label>
                          <Input
                            value={statusFormulario.nome}
                            onChange={(e) => setStatusFormulario(prev => ({ ...prev, nome: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label>Cor</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={statusFormulario.cor}
                              onChange={(e) => setStatusFormulario(prev => ({ ...prev, cor: e.target.value }))}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={statusFormulario.cor}
                              onChange={(e) => setStatusFormulario(prev => ({ ...prev, cor: e.target.value }))}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={statusFormulario.descricao}
                          onChange={(e) => setStatusFormulario(prev => ({ ...prev, descricao: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSalvarEdicao}
                          disabled={!statusFormulario.nome.trim() || atualizarStatusEntrega.isPending}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                        <Button
                          onClick={handleCancelarEdicao}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: status.cor }}
                          />
                          <div>
                            <p className="font-medium">{status.nome}</p>
                            {status.descricao && (
                              <p className="text-sm text-gray-600">{status.descricao}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleIniciarEdicao(status)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeletar(status.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 