
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNovoStatusForm } from '@/hooks/useNovoStatusForm';
import { CarteiraProjetoSelect } from '@/components/forms/CarteiraProjetoSelect';
import { ProximasEntregasForm } from '@/components/forms/status/ProximasEntregasForm';
import { StatusGeralSelect } from '@/components/forms/StatusGeralSelect';
import { StatusVisaoGPSelect } from '@/components/forms/StatusVisaoGPSelect';
import { NivelRiscoSelect } from '@/components/forms/NivelRiscoSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export default function NovoStatus() {
  const { usuario, isLoading } = useAuth();
  const { 
    form, 
    isLoading: isSubmitting, 
    onSubmit,
    projetoSelecionado,
    carteiraSelecionada,
    progressoEstimado,
    handleCarteiraChange,
    handleProjetoChange,
    handleProgressoChange
  } = useNovoStatusForm();

  // Valores atuais dos campos de risco para calcular a matriz
  const impactoAtual = form.watch('impacto_riscos');
  const probabilidadeAtual = form.watch('probabilidade_riscos');
  const matrizRisco = calcularMatrizRisco(impactoAtual, probabilidadeAtual);

  // Gerar opções de progresso de 5 em 5%
  const progressoOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/status">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">Novo Status</h1>
            <p className="text-pmo-gray mt-2">Criar novo status de projeto</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Projeto Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CarteiraProjetoSelect
                  carteira={carteiraSelecionada}
                  projeto={projetoSelecionado?.toString() || ''}
                  onCarteiraChange={handleCarteiraChange}
                  onProjetoChange={(value) => handleProjetoChange(Number(value))}
                  required
                />
              </CardContent>
            </Card>

            {/* Status Section */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="status_geral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Geral *</FormLabel>
                        <FormControl>
                          <StatusGeralSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Selecione o status"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status_visao_gp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visão GP *</FormLabel>
                        <FormControl>
                          <StatusVisaoGPSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Selecione a visão"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label htmlFor="progresso">Progresso Estimado (%) *</Label>
                    <Select 
                      value={progressoEstimado.toString()} 
                      onValueChange={(value) => handleProgressoChange(Number(value))} 
                      required
                    >
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
                  <FormField
                    control={form.control}
                    name="probabilidade_riscos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Probabilidade de Riscos *</FormLabel>
                        <FormControl>
                          <NivelRiscoSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Selecione a probabilidade"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impacto_riscos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impacto dos Riscos *</FormLabel>
                        <FormControl>
                          <NivelRiscoSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Selecione o impacto"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                <FormField
                  control={form.control}
                  name="entregas_realizadas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itens Trabalhados na Semana *</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descreva os itens trabalhados na semana" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backlog"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backlog</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Resumo do backlog" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloqueios_atuais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloqueios Atuais</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descreva os bloqueios atuais" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes_gerais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações ou Pontos de Atenção</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Observações ou pontos de atenção sobre o projeto" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Próximas Entregas */}
            <ProximasEntregasForm form={form} />

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || !projetoSelecionado}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Salvando...' : 'Salvar Status'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
