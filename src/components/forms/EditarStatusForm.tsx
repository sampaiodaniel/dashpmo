
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Função para calcular o risco baseado na fórmula do Excel
function calcularMatrizRisco(impacto: string, probabilidade: string): { nivel: string; cor: string } {
  if (!impacto || !probabilidade) {
    return { nivel: '', cor: '' };
  }

  const impactoValor = impacto === 'Baixo' ? 1 : impacto === 'Médio' ? 2 : 3;
  const probabilidadeValor = probabilidade === 'Baixo' ? 1 : probabilidade === 'Médio' ? 2 : 3;
  const risco = impactoValor * probabilidadeValor;

  if (risco <= 2) {
    return { nivel: 'Baixo', cor: 'bg-green-100 text-green-700 border-green-200' };
  } else if (risco <= 4) {
    return { nivel: 'Médio', cor: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  } else {
    return { nivel: 'Alto', cor: 'bg-red-100 text-red-700 border-red-200' };
  }
}

interface EditarStatusFormProps {
  status: StatusProjeto;
  onSuccess: () => void;
}

export function EditarStatusForm({ status, onSuccess }: EditarStatusFormProps) {
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);
  const [openPopovers, setOpenPopovers] = useState<{[key: string]: boolean}>({
    marco1: false,
    marco2: false,
    marco3: false,
  });
  
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
    progresso_estimado: (status as any).progresso_estimado || 0
  });

  const handleDateSelect = (date: Date | undefined, fieldName: string, marcoKey: string) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      setFormData(prev => ({ ...prev, [fieldName]: dateString }));
      
      // Fechar o popover após seleção
      setOpenPopovers(prev => ({ ...prev, [marcoKey]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const dataToUpdate = {
        status_geral: formData.status_geral,
        status_visao_gp: formData.status_visao_gp,
        impacto_riscos: formData.impacto_riscos,
        probabilidade_riscos: formData.probabilidade_riscos,
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

  // Valores atuais dos campos de risco para calcular a matriz
  const matrizRisco = calcularMatrizRisco(formData.impacto_riscos, formData.probabilidade_riscos);

  // Gerar opções de progresso de 5 em 5%
  const progressoOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status do Projeto */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status_geral">Status Geral *</Label>
              <Select value={formData.status_geral} onValueChange={(value) => handleInputChange('status_geral', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planejamento">Planejamento</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Pausado">Pausado</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Em Especificação">Em Especificação</SelectItem>
                  <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                  <SelectItem value="Aguardando Homologação">Aguardando Homologação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status_visao_gp">Visão GP *</Label>
              <Select value={formData.status_visao_gp} onValueChange={(value) => handleInputChange('status_visao_gp', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a visão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Verde">Verde</SelectItem>
                  <SelectItem value="Amarelo">Amarelo</SelectItem>
                  <SelectItem value="Vermelho">Vermelho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="progresso">Progresso Estimado (%) *</Label>
              <Select value={formData.progresso_estimado.toString()} onValueChange={(value) => handleInputChange('progresso_estimado', Number(value))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o progresso" />
                </SelectTrigger>
                <SelectContent>
                  {progressoOptions.map((progress) => (
                    <SelectItem key={progress} value={progress.toString()}>
                      {progress}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="probabilidade_riscos">Probabilidade de Riscos *</Label>
              <Select value={formData.probabilidade_riscos} onValueChange={(value) => handleInputChange('probabilidade_riscos', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a probabilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="impacto_riscos">Impacto dos Riscos *</Label>
              <Select value={formData.impacto_riscos} onValueChange={(value) => handleInputChange('impacto_riscos', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o impacto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {matrizRisco.nivel && (
              <div>
                <Label>Matriz de Risco (Prob x Impacto)</Label>
                <Badge className={`${matrizRisco.cor} mt-2 block w-fit`}>
                  {matrizRisco.nivel}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Status */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="realizado_semana_atual">Itens Trabalhados na Semana *</Label>
            <Textarea 
              value={formData.realizado_semana_atual} 
              onChange={(e) => handleInputChange('realizado_semana_atual', e.target.value)} 
              placeholder="Descreva os itens trabalhados na semana"
              required
            />
          </div>

          <div>
            <Label htmlFor="backlog">Backlog</Label>
            <Textarea 
              value={formData.backlog} 
              onChange={(e) => handleInputChange('backlog', e.target.value)} 
              placeholder="Resumo do backlog"
            />
          </div>

          <div>
            <Label htmlFor="bloqueios_atuais">Bloqueios Atuais</Label>
            <Textarea 
              value={formData.bloqueios_atuais} 
              onChange={(e) => handleInputChange('bloqueios_atuais', e.target.value)} 
              placeholder="Descreva os bloqueios atuais"
            />
          </div>

          <div>
            <Label htmlFor="observacoes_pontos_atencao">Observações ou Pontos de Atenção</Label>
            <Textarea 
              value={formData.observacoes_pontos_atencao} 
              onChange={(e) => handleInputChange('observacoes_pontos_atencao', e.target.value)} 
              placeholder="Observações ou pontos de atenção sobre o projeto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Próximas Entregas */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Entregas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Marco 1 */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-pmo-primary">Marco 1</h4>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <Label htmlFor="entregaveis1">Entregáveis *</Label>
                <Textarea 
                  value={formData.entregaveis1} 
                  onChange={(e) => handleInputChange('entregaveis1', e.target.value)} 
                  placeholder="Descreva os entregáveis..."
                  rows={4}
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entrega1">Nome da Entrega *</Label>
                  <Input 
                    value={formData.entrega1} 
                    onChange={(e) => handleInputChange('entrega1', e.target.value)} 
                    placeholder="Nome da entrega"
                    required
                  />
                </div>

                <div>
                  <Label>Data de Entrega *</Label>
                  <Popover 
                    open={openPopovers.marco1} 
                    onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, marco1: open }))}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formData.data_marco1 && "text-muted-foreground"
                        )}
                        type="button"
                      >
                        {formData.data_marco1 ? (
                          format(new Date(formData.data_marco1 + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.data_marco1 ? new Date(formData.data_marco1 + 'T00:00:00') : undefined}
                        onSelect={(date) => handleDateSelect(date, 'data_marco1', 'marco1')}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Marco 2 */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-pmo-primary">Marco 2</h4>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <Label htmlFor="entregaveis2">Entregáveis</Label>
                <Textarea 
                  value={formData.entregaveis2} 
                  onChange={(e) => handleInputChange('entregaveis2', e.target.value)} 
                  placeholder="Descreva os entregáveis..."
                  rows={4}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entrega2">Nome da Entrega</Label>
                  <Input 
                    value={formData.entrega2} 
                    onChange={(e) => handleInputChange('entrega2', e.target.value)} 
                    placeholder="Nome da entrega"
                  />
                </div>

                <div>
                  <Label>Data de Entrega</Label>
                  <Popover 
                    open={openPopovers.marco2} 
                    onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, marco2: open }))}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formData.data_marco2 && "text-muted-foreground"
                        )}
                        type="button"
                      >
                        {formData.data_marco2 ? (
                          format(new Date(formData.data_marco2 + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.data_marco2 ? new Date(formData.data_marco2 + 'T00:00:00') : undefined}
                        onSelect={(date) => handleDateSelect(date, 'data_marco2', 'marco2')}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Marco 3 */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-pmo-primary">Marco 3</h4>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <Label htmlFor="entregaveis3">Entregáveis</Label>
                <Textarea 
                  value={formData.entregaveis3} 
                  onChange={(e) => handleInputChange('entregaveis3', e.target.value)} 
                  placeholder="Descreva os entregáveis..."
                  rows={4}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entrega3">Nome da Entrega</Label>
                  <Input 
                    value={formData.entrega3} 
                    onChange={(e) => handleInputChange('entrega3', e.target.value)} 
                    placeholder="Nome da entrega"
                  />
                </div>

                <div>
                  <Label>Data de Entrega</Label>
                  <Popover 
                    open={openPopovers.marco3} 
                    onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, marco3: open }))}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formData.data_marco3 && "text-muted-foreground"
                        )}
                        type="button"
                      >
                        {formData.data_marco3 ? (
                          format(new Date(formData.data_marco3 + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.data_marco3 ? new Date(formData.data_marco3 + 'T00:00:00') : undefined}
                        onSelect={(date) => handleDateSelect(date, 'data_marco3', 'marco3')}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Status'}
        </Button>
      </div>
    </form>
  );
}
