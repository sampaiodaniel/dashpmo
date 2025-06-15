
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useConfiguracoesSistema, useConfiguracoesSistemaOperations } from '@/hooks/useConfiguracoesSistema';
import { ConfiguracaoModal } from './ConfiguracaoModal';
import { ConfiguracaoSistema } from '@/types/admin';

export function AdminConfiguracoes() {
  const [tipoAtivo, setTipoAtivo] = useState<string>('responsavel_cwi');
  const [modalAberto, setModalAberto] = useState(false);
  const [configuracaoEditando, setConfiguracaoEditando] = useState<ConfiguracaoSistema | null>(null);

  const { data: configuracoes, isLoading } = useConfiguracoesSistema(tipoAtivo as any);
  const { deleteConfiguracao } = useConfiguracoesSistemaOperations();

  // Todas as listas usadas no sistema - organizadas em 2 linhas
  const tiposConfiguracao = [
    { key: 'responsavel_cwi', label: 'Responsáveis CWI', descricao: 'Gerentes de Projeto e Responsáveis técnicos da CWI' },
    { key: 'carteira', label: 'Carteiras', descricao: 'Carteiras/áreas de negócio (primária, secundária, terciária)' },
    { key: 'status_geral', label: 'Status Geral', descricao: 'Status gerais dos projetos' },
    { key: 'status_visao_gp', label: 'Status Visão GP', descricao: 'Cores de status na visão do GP (Verde, Amarelo, Vermelho)' },
    { key: 'nivel_risco', label: 'Níveis de Risco', descricao: 'Níveis de risco para probabilidade e impacto' },
    { key: 'tipo_mudanca', label: 'Tipos de Mudança', descricao: 'Tipos de mudança/replanejamento' },
    { key: 'categoria_licao', label: 'Categorias de Lição', descricao: 'Categorias para lições aprendidas' }
  ];

  const handleEditar = (config: ConfiguracaoSistema) => {
    setConfiguracaoEditando(config);
    setModalAberto(true);
  };

  const handleNovo = () => {
    setConfiguracaoEditando(null);
    setModalAberto(true);
  };

  const handleRemover = (id: number) => {
    if (confirm('Tem certeza que deseja remover esta configuração?')) {
      deleteConfiguracao.mutate(id);
    }
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
            <TabsList className="grid w-full grid-cols-4 gap-2 h-auto mb-6">
              <div className="grid grid-cols-4 gap-2 w-full">
                {tiposConfiguracao.slice(0, 4).map((tipo) => (
                  <TabsTrigger key={tipo.key} value={tipo.key} className="text-xs px-2 py-2">
                    {tipo.label}
                  </TabsTrigger>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {tiposConfiguracao.slice(4).map((tipo) => (
                  <TabsTrigger key={tipo.key} value={tipo.key} className="text-xs px-2 py-2">
                    {tipo.label}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>

            {tiposConfiguracao.map((tipo) => (
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
          </Tabs>
        </CardContent>
      </Card>

      <ConfiguracaoModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        configuracao={configuracaoEditando}
        tipoInicial={tipoAtivo as any}
      />
    </div>
  );
}
