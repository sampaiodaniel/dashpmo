
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConfiguracoesSistemaOperations } from '@/hooks/useConfiguracoesSistema';
import { ConfiguracaoSistema, TIPOS_CONFIGURACAO } from '@/types/admin';

interface ConfiguracaoModalProps {
  aberto: boolean;
  onFechar: () => void;
  configuracao: ConfiguracaoSistema | null;
  tipoInicial: string;
}

export function ConfiguracaoModal({ aberto, onFechar, configuracao, tipoInicial }: ConfiguracaoModalProps) {
  const [formData, setFormData] = useState({
    tipo: tipoInicial,
    valor: '',
    ordem: 0,
    criado_por: 'Admin'
  });

  const { createConfiguracao, updateConfiguracao } = useConfiguracoesSistemaOperations();

  useEffect(() => {
    if (configuracao) {
      setFormData({
        tipo: configuracao.tipo,
        valor: configuracao.valor,
        ordem: configuracao.ordem || 0,
        criado_por: configuracao.criado_por
      });
    } else {
      setFormData({
        tipo: tipoInicial,
        valor: '',
        ordem: 0,
        criado_por: 'Admin'
      });
    }
  }, [configuracao, tipoInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (configuracao) {
      updateConfiguracao.mutate({ 
        id: configuracao.id, 
        ...formData,
        ativo: true
      });
    } else {
      createConfiguracao.mutate({
        ...formData,
        ativo: true
      });
    }
    
    onFechar();
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'gp_responsavel_cwi': 'GPs CWI',
      'responsavel_cwi': 'Responsáveis CWI',
      'carteira': 'Carteiras',
      'status_geral': 'Status Geral',
      'status_visao_gp': 'Status Visão GP',
      'nivel_risco': 'Níveis de Risco',
      'tipo_mudanca': 'Tipos de Mudança',
      'categoria_licao': 'Categorias de Lição'
    };
    return labels[tipo] || tipo;
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {configuracao ? 'Editar Configuração' : 'Nova Configuração'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_CONFIGURACAO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {getTipoLabel(tipo)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              required
              placeholder="Digite o valor da configuração"
            />
          </div>

          <div>
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              type="number"
              value={formData.ordem}
              onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
              placeholder="Ordem de exibição (opcional)"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFechar}>
              Cancelar
            </Button>
            <Button type="submit">
              {configuracao ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
