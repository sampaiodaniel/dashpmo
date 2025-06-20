import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useConfiguracoesSistema, useConfiguracoesSistemaOperations } from '@/hooks/useConfiguracoesSistema';
import { useTiposProjeto, useTiposProjetoOperations } from '@/hooks/useTiposProjeto';
import { ConfiguracaoModal } from './ConfiguracaoModal';
import { TipoProjetoModal } from './TipoProjetoModal';
import { ConfiguracaoSistema } from '@/types/admin';
import { TipoProjeto } from '@/hooks/useTiposProjeto';
import { useQueryClient } from '@tanstack/react-query';

export function AdminConfiguracoes() {
  const [tipoAtivo, setTipoAtivo] = useState<string>('responsavel_cwi');
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoProjetoModalAberto, setTipoProjetoModalAberto] = useState(false);
  const [configuracaoEditando, setConfiguracaoEditando] = useState<ConfiguracaoSistema | null>(null);
  const [tipoProjetoEditando, setTipoProjetoEditando] = useState<TipoProjeto | null>(null);
  const queryClient = useQueryClient();

  const { data: configuracoes, isLoading } = useConfiguracoesSistema(tipoAtivo as any);
  const { data: tiposProjeto, isLoading: isLoadingTipos, refetch: refetchTipos } = useTiposProjeto();
  const { deleteConfiguracao } = useConfiguracoesSistemaOperations();
  const { deleteTipoProjeto } = useTiposProjetoOperations();

  // Todas as listas usadas no sistema - organizadas em 2 linhas
  const tiposConfiguracao = [
    { key: 'responsavel_cwi', label: 'Responsáveis CWI', descricao: 'Gerentes de Projeto e Responsáveis técnicos da CWI' },
    { key: 'carteira', label: 'Carteiras', descricao: 'Carteiras/áreas de negócio (primária, secundária, terciária)' },
    { key: 'status_geral', label: 'Status Geral', descricao: 'Status gerais dos projetos' },
    { key: 'status_visao_gp', label: 'Status Visão GP', descricao: 'Cores de status na visão do GP (Verde, Amarelo, Vermelho)' },
    { key: 'nivel_risco', label: 'Níveis de Risco', descricao: 'Níveis de risco para probabilidade e impacto' },
    { key: 'tipo_mudanca', label: 'Tipos de Mudança', descricao: 'Tipos de mudança/replanejamento' },
    { key: 'categoria_licao', label: 'Categorias de Lição', descricao: 'Categorias para lições aprendidas' },
    { key: 'tipos_projeto', label: 'Tipos de Projeto', descricao: 'Tipos de projeto configuráveis' }
  ];

  const handleEditar = (config: ConfiguracaoSistema) => {
    setConfiguracaoEditando(config);
    setModalAberto(true);
  };

  const handleEditarTipoProjeto = (tipo: TipoProjeto) => {
    setTipoProjetoEditando(tipo);
    setTipoProjetoModalAberto(true);
  };

  const handleNovo = () => {
    if (tipoAtivo === 'tipos_projeto') {
      setTipoProjetoEditando(null);
      setTipoProjetoModalAberto(true);
    } else {
      setConfiguracaoEditando(null);
      setModalAberto(true);
    }
  };

  const handleRemover = (id: number) => {
    if (confirm('Tem certeza que deseja remover esta configuração?')) {
      deleteConfiguracao.mutate(id);
    }
  };

  const handleRemoverTipoProjeto = (id: number) => {
    if (confirm('Tem certeza que deseja remover este tipo de projeto?')) {
      deleteTipoProjeto.mutate(id);
    }
  };

  const handleFecharTipoProjetoModal = () => {
    setTipoProjetoModalAberto(false);
    setTipoProjetoEditando(null);
    // Invalidar cache e refetch para garantir atualização imediata
    queryClient.invalidateQueries({ queryKey: ['tipos-projeto'] });
    refetchTipos();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <p className="text-sm text-gray-600">
            Gerencie todas as listas de valores utilizadas em todo o sistema. 
            Alterações aqui serão refletidas imediatamente nos formulários, filtros e seleções.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={tipoAtivo} onValueChange={setTipoAtivo}>
            <div className="space-y-2 mb-6">
              {/* Primeira linha com 4 tabs */}
              <TabsList className="grid w-full grid-cols-4">
                {tiposConfiguracao.slice(0, 4).map((tipo) => (
                  <TabsTrigger key={tipo.key} value={tipo.key} className="text-xs">
                    {tipo.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Segunda linha com 4 tabs */}
              <TabsList className="grid w-full grid-cols-4">
                {tiposConfiguracao.slice(4).map((tipo) => (
                  <TabsTrigger key={tipo.key} value={tipo.key} className="text-xs">
                    {tipo.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tiposConfiguracao.slice(0, 7).map((tipo) => (
              <TabsContent key={tipo.key} value={tipo.key} className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{tipo.label}</h3>
                      <p className="text-sm text-gray-600">{tipo.descricao}</p>
                    </div>
                    <Button onClick={handleNovo} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Carregando configurações...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {configuracoes?.map((config) => (
                        <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <span className="font-medium">{config.valor}</span>
                            {config.ordem && (
                              <span className="text-sm text-gray-500 ml-2">(Ordem: {config.ordem})</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditar(config)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemover(config.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {configuracoes?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>Nenhuma configuração encontrada</p>
                          <p className="text-sm">Clique em "Adicionar" para criar a primeira configuração</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}

            {/* Aba especial para tipos de projeto */}
            <TabsContent value="tipos_projeto" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Tipos de Projeto</h3>
                    <p className="text-sm text-gray-600">Tipos de projeto configuráveis</p>
                  </div>
                  <Button onClick={handleNovo} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>

                {isLoadingTipos ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Carregando tipos de projeto...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tiposProjeto?.map((tipo) => (
                      <div key={tipo.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <span className="font-medium">{tipo.nome}</span>
                          {tipo.descricao && (
                            <span className="text-sm text-gray-500 ml-2">({tipo.descricao})</span>
                          )}
                          <span className="text-sm text-gray-500 ml-2">(Ordem: {tipo.ordem})</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditarTipoProjeto(tipo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoverTipoProjeto(tipo.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {tiposProjeto?.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhum tipo de projeto encontrado</p>
                        <p className="text-sm">Clique em "Adicionar" para criar o primeiro tipo</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ConfiguracaoModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        configuracao={configuracaoEditando}
        tipoInicial={tipoAtivo as any}
      />

      <TipoProjetoModal
        aberto={tipoProjetoModalAberto}
        onFechar={handleFecharTipoProjetoModal}
        tipo={tipoProjetoEditando}
      />
    </div>
  );
}
