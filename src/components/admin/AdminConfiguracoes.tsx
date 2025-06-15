
import { useState } from 'react';
import { useConfiguracoesSistema, useConfiguracoesSistemaOperations } from '@/hooks/useConfiguracoesSistema';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ConfiguracaoModal } from './ConfiguracaoModal';
import { ConfiguracaoSistema, TIPOS_CONFIGURACAO } from '@/types/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminConfiguracoes() {
  const [modalAberto, setModalAberto] = useState(false);
  const [configuracaoEditando, setConfiguracaoEditando] = useState<ConfiguracaoSistema | null>(null);
  const [tipoSelecionado, setTipoSelecionado] = useState(TIPOS_CONFIGURACAO[0]);
  
  const { data: configuracoes, isLoading } = useConfiguracoesSistema();
  const { deleteConfiguracao } = useConfiguracoesSistemaOperations();

  const handleEditar = (configuracao: ConfiguracaoSistema) => {
    setConfiguracaoEditando(configuracao);
    setModalAberto(true);
  };

  const handleNovo = (tipo: string) => {
    setTipoSelecionado(tipo);
    setConfiguracaoEditando(null);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setConfiguracaoEditando(null);
  };

  const handleRemover = (id: number) => {
    if (confirm('Tem certeza que deseja remover esta configuração?')) {
      deleteConfiguracao.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const getConfigsPorTipo = (tipo: string) => {
    return configuracoes?.filter(c => c.tipo === tipo) || [];
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'responsavel_interno': 'Responsáveis Internos',
      'gp_responsavel': 'GPs Responsáveis',
      'carteira_primaria': 'Carteiras Primárias',
      'carteira_secundaria': 'Carteiras Secundárias',
      'carteira_terciaria': 'Carteiras Terciárias'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Configurações do Sistema</h2>
      </div>

      <Tabs defaultValue={TIPOS_CONFIGURACAO[0]} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {TIPOS_CONFIGURACAO.map((tipo) => (
            <TabsTrigger key={tipo} value={tipo} className="text-xs">
              {getTipoLabel(tipo)}
            </TabsTrigger>
          ))}
        </TabsList>

        {TIPOS_CONFIGURACAO.map((tipo) => (
          <TabsContent key={tipo} value={tipo}>
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">{getTipoLabel(tipo)}</h3>
                <Button size="sm" onClick={() => handleNovo(tipo)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getConfigsPorTipo(tipo).map((config) => (
                    <TableRow key={config.id}>
                      <TableCell>{config.valor}</TableCell>
                      <TableCell>{config.ordem || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEditar(config)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRemover(config.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ConfiguracaoModal
        aberto={modalAberto}
        onFechar={handleFecharModal}
        configuracao={configuracaoEditando}
        tipoInicial={tipoSelecionado}
      />
    </div>
  );
}
