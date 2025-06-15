
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useQueryClient } from '@tanstack/react-query';

interface EditarStatusFormProps {
  status: StatusProjeto;
  onSuccess: () => void;
}

const STATUS_GERAL_OPTIONS = ['Planejamento', 'Em Andamento', 'Concluído', 'Cancelado', 'Em Espera'];
const STATUS_VISAO_GP_OPTIONS = ['Verde', 'Amarelo', 'Vermelho'];
const NIVEL_RISCO_OPTIONS = ['Baixo', 'Médio', 'Alto'];

export function EditarStatusForm({ status, onSuccess }: EditarStatusFormProps) {
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);
  
  const [formData, setFormData] = useState({
    status_geral: status.status_geral,
    status_visao_gp: status.status_visao_gp,
    impacto_riscos: status.impacto_riscos,
    probabilidade_riscos: status.probabilidade_riscos,
    realizado_semana_atual: status.realizado_semana_atual || '',
    backlog: status.backlog || '',
    bloqueios_atuais: status.bloqueios_atuais || '',
    observacoes_pontos_atencao: status.observacoes_pontos_atencao || '',
    entregaveis1: status.entregaveis1 || '',
    entrega1: status.entrega1 || '',
    data_marco1: status.data_marco1 ? status.data_marco1.toISOString().split('T')[0] : '',
    entregaveis2: status.entregaveis2 || '',
    entrega2: status.entrega2 || '',
    data_marco2: status.data_marco2 ? status.data_marco2.toISOString().split('T')[0] : '',
    entregaveis3: status.entregaveis3 || '',
    entrega3: status.entrega3 || '',
    data_marco3: status.data_marco3 ? status.data_marco3.toISOString().split('T')[0] : '',
    progresso_estimado: status.progresso_estimado || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const dataToUpdate = {
        status_geral: formData.status_geral as typeof STATUS_GERAL_OPTIONS[number],
        status_visao_gp: formData.status_visao_gp as typeof STATUS_VISAO_GP_OPTIONS[number],
        impacto_riscos: formData.impacto_riscos as typeof NIVEL_RISCO_OPTIONS[number],
        probabilidade_riscos: formData.probabilidade_riscos as typeof NIVEL_RISCO_OPTIONS[number],
        realizado_semana_atual: formData.realizado_semana_atual,
        backlog: formData.backlog,
        bloqueios_atuais: formData.bloqueios_atuais,
        observacoes_pontos_atencao: formData.observacoes_pontos_atencao,
        entregaveis1: formData.entregaveis1,
        entrega1: formData.entrega1,
        data_marco1: formData.data_marco1 || null,
        entregaveis2: formData.entregaveis2,
        entrega2: formData.entrega2,
        data_marco2: formData.data_marco2 || null,
        entregaveis3: formData.entregaveis3,
        entrega3: formData.entrega3,
        data_marco3: formData.data_marco3 || null,
        progresso_estimado: formData.progresso_estimado,
        data_atualizacao: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('status_projeto')
        .update(dataToUpdate)
        .eq('id', status.id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="status_geral">Status Geral</Label>
            <Select value={formData.status_geral} onValueChange={(value) => handleInputChange('status_geral', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status geral" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_GERAL_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status_visao_gp">Visão GP</Label>
            <Select value={formData.status_visao_gp} onValueChange={(value) => handleInputChange('status_visao_gp', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a visão GP" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_VISAO_GP_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="progresso_estimado">Progresso Estimado (%)</Label>
            <Input
              id="progresso_estimado"
              type="number"
              min="0"
              max="100"
              value={formData.progresso_estimado}
              onChange={(e) => handleInputChange('progresso_estimado', Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gestão de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gestão de Riscos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="impacto_riscos">Impacto dos Riscos</Label>
            <Select value={formData.impacto_riscos} onValueChange={(value) => handleInputChange('impacto_riscos', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o impacto" />
              </SelectTrigger>
              <SelectContent>
                {NIVEL_RISCO_OPTIONS.map((nivel) => (
                  <SelectItem key={nivel} value={nivel}>
                    {nivel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="probabilidade_riscos">Probabilidade dos Riscos</Label>
            <Select value={formData.probabilidade_riscos} onValueChange={(value) => handleInputChange('probabilidade_riscos', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a probabilidade" />
              </SelectTrigger>
              <SelectContent>
                {NIVEL_RISCO_OPTIONS.map((nivel) => (
                  <SelectItem key={nivel} value={nivel}>
                    {nivel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Atividades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="realizado_semana_atual">Realizado na Semana Atual</Label>
            <Textarea
              id="realizado_semana_atual"
              value={formData.realizado_semana_atual}
              onChange={(e) => handleInputChange('realizado_semana_atual', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="backlog">Backlog</Label>
            <Textarea
              id="backlog"
              value={formData.backlog}
              onChange={(e) => handleInputChange('backlog', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Marcos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Marcos e Entregáveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Marco 1 */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-pmo-primary mb-4">Marco 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="entregaveis1">Entregáveis</Label>
                <Textarea
                  id="entregaveis1"
                  value={formData.entregaveis1}
                  onChange={(e) => handleInputChange('entregaveis1', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="entrega1">Entrega</Label>
                <Input
                  id="entrega1"
                  value={formData.entrega1}
                  onChange={(e) => handleInputChange('entrega1', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="data_marco1">Data do Marco</Label>
                <Input
                  id="data_marco1"
                  type="date"
                  value={formData.data_marco1}
                  onChange={(e) => handleInputChange('data_marco1', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Marco 2 */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-pmo-primary mb-4">Marco 2</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="entregaveis2">Entregáveis</Label>
                <Textarea
                  id="entregaveis2"
                  value={formData.entregaveis2}
                  onChange={(e) => handleInputChange('entregaveis2', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="entrega2">Entrega</Label>
                <Input
                  id="entrega2"
                  value={formData.entrega2}
                  onChange={(e) => handleInputChange('entrega2', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="data_marco2">Data do Marco</Label>
                <Input
                  id="data_marco2"
                  type="date"
                  value={formData.data_marco2}
                  onChange={(e) => handleInputChange('data_marco2', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Marco 3 */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-pmo-primary mb-4">Marco 3</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="entregaveis3">Entregáveis</Label>
                <Textarea
                  id="entregaveis3"
                  value={formData.entregaveis3}
                  onChange={(e) => handleInputChange('entregaveis3', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="entrega3">Entrega</Label>
                <Input
                  id="entrega3"
                  value={formData.entrega3}
                  onChange={(e) => handleInputChange('entrega3', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="data_marco3">Data do Marco</Label>
                <Input
                  id="data_marco3"
                  type="date"
                  value={formData.data_marco3}
                  onChange={(e) => handleInputChange('data_marco3', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observações e Bloqueios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bloqueios_atuais">Bloqueios Atuais</Label>
            <Textarea
              id="bloqueios_atuais"
              value={formData.bloqueios_atuais}
              onChange={(e) => handleInputChange('bloqueios_atuais', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="observacoes_pontos_atencao">Pontos de Atenção</Label>
            <Textarea
              id="observacoes_pontos_atencao"
              value={formData.observacoes_pontos_atencao}
              onChange={(e) => handleInputChange('observacoes_pontos_atencao', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
