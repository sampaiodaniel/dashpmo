
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useConfiguracoesSistema, useConfiguracoesSistemaOperations } from '@/hooks/useConfiguracoesSistema';
import { ConfiguracaoModal } from './ConfiguracaoModal';
import { ConfiguracaoSistema, TipoConfiguracao, TIPOS_CONFIGURACAO } from '@/types/admin';

export function AdminConfiguracoes() {
  const [tipoAtivo, setTipoAtivo] = useState<TipoConfiguracao>('responsavel_interno');
  const [modalAberto, setModalAberto] = useState(false);
  const [configuracaoEditando, setConfiguracaoEditando] = useState<ConfiguracaoSistema | null>(null);

  const { data: configuracoes } = useConfiguracoesSistema(tipoAtivo);
  const { deleteConfiguracao } = useConfiguracoesSistemaOperations();

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

  const getTipoLabel = (tipo: TipoConfiguracao) => {
    const labels: Record<TipoConfiguracao, string> = {
      'responsavel_interno': 'Responsáveis Internos',
      'gp_responsavel': 'GPs Responsáveis',
      'carteira_primaria': 'Carteiras Primárias',
      'carteira_secundaria': 'Carteiras Secundárias',
      'carteira_terciaria': 'Carteiras Terciárias'
    };
    return labels[tipo];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tipoAtivo} onValueChange={(value) => setTipoAtivo(value as TipoConfiguracao)}>
            <TabsList className="grid w-full grid-cols-5">
              {TIPOS_CONFIGURACAO.map((tipo) => (
                <TabsTrigger key={tipo} value={tipo} className="text-xs">
                  {getTipoLabel(tipo).split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {TIPOS_CONFIGURACAO.map((tipo) => (
              <TabsContent key={tipo} value={tipo} className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{getTipoLabel(tipo)}</h3>
                  <Button onClick={handleNovo} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-2">
                  {configuracoes?.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {configuracoes?.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Nenhuma configuração encontrada
                    </p>
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
        tipoInicial={tipoAtivo}
      />
    </div>
  );
}
