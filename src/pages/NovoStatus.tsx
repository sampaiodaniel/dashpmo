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
import { StatusGeralSelect } from '@/components/forms/StatusGeralSelect';
import { StatusVisaoGPSelect } from '@/components/forms/StatusVisaoGPSelect';
import { NivelRiscoSelect } from '@/components/forms/NivelRiscoSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateFieldWithTBD } from '@/components/forms/DateFieldWithTBD';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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

  // Estados para controlar TBD nos marcos
  const [marco1TBD, setMarco1TBD] = useState(false);
  const [marco2TBD, setMarco2TBD] = useState(false);
  const [marco3TBD, setMarco3TBD] = useState(false);

  // Estados para as datas dos marcos
  const [dataMarco1, setDataMarco1] = useState<Date | null>(null);
  const [dataMarco2, setDataMarco2] = useState<Date | null>(null);
  const [dataMarco3, setDataMarco3] = useState<Date | null>(null);

  // Valores atuais dos campos de risco para calcular a matriz
  const impactoAtual = form.watch('impacto_riscos');
  const probabilidadeAtual = form.watch('probabilidade_riscos');
  const matrizRisco = calcularMatrizRisco(impactoAtual, probabilidadeAtual);

  // Gerar opções de progresso de 5 em 5%
  const progressoOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  // Funções para lidar com mudanças de data dos marcos
  const handleMarco1DateChange = (date: Date | null) => {
    setDataMarco1(date);
    if (marco1TBD) {
      form.setValue('marco1_data', 'TBD');
    } else {
      form.setValue('marco1_data', date ? date.toISOString().split('T')[0] : '');
    }
  };

  const handleMarco1TBDChange = (isTBD: boolean) => {
    setMarco1TBD(isTBD);
    if (isTBD) {
      form.setValue('marco1_data', 'TBD');
      setDataMarco1(null);
    }
  };

  const handleMarco2DateChange = (date: Date | null) => {
    setDataMarco2(date);
    if (marco2TBD) {
      form.setValue('marco2_data', 'TBD');
    } else {
      form.setValue('marco2_data', date ? date.toISOString().split('T')[0] : '');
    }
  };

  const handleMarco2TBDChange = (isTBD: boolean) => {
    setMarco2TBD(isTBD);
    if (isTBD) {
      form.setValue('marco2_data', 'TBD');
      setDataMarco2(null);
    }
  };

  const handleMarco3DateChange = (date: Date | null) => {
    setDataMarco3(date);
    if (marco3TBD) {
      form.setValue('marco3_data', 'TBD');
    } else {
      form.setValue('marco3_data', date ? date.toISOString().split('T')[0] : '');
    }
  };

  const handleMarco3TBDChange = (isTBD: boolean) => {
    setMarco3TBD(isTBD);
    if (isTBD) {
      form.setValue('marco3_data', 'TBD');
      setDataMarco3(null);
    }
  };

  // Função customizada para submit que lida com TBD
  const handleFormSubmit = async (data: any) => {
    // Processar dados dos marcos com TBD
    const processedData = {
      ...data,
      marco1_data: marco1TBD ? 'TBD' : (dataMarco1 ? dataMarco1.toISOString().split('T')[0] : ''),
      marco2_data: marco2TBD ? 'TBD' : (dataMarco2 ? dataMarco2.toISOString().split('T')[0] : ''),
      marco3_data: marco3TBD ? 'TBD' : (dataMarco3 ? dataMarco3.toISOString().split('T')[0] : ''),
    };

    console.log('Dados do formulário processados:', processedData);
    await onSubmit(processedData);
  };

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
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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

            {/* Próximas Entregas com DateFieldWithTBD */}
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
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="entregaveis1">Entregáveis *</Label>
                          <FormField
                            control={form.control}
                            name="marco1_responsavel"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea {...field} placeholder="Descreva os entregáveis..." rows={4} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="entrega1">Nome da Entrega *</Label>
                        <FormField
                          control={form.control}
                          name="marco1_nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Nome da entrega" className="bg-white" required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DateFieldWithTBD
                        label="Data de Entrega"
                        value={dataMarco1}
                        onChange={handleMarco1DateChange}
                        onTBDChange={handleMarco1TBDChange}
                        isTBD={marco1TBD}
                        required
                        placeholder="Selecione a data"
                      />
                    </div>
                  </div>
                </div>

                {/* Marco 2 */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-pmo-primary">Marco 2</h4>
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div className="col-span-2">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="entregaveis2">Entregáveis</Label>
                          <FormField
                            control={form.control}
                            name="marco2_responsavel"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea {...field} placeholder="Descreva os entregáveis..." rows={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="entrega2">Nome da Entrega</Label>
                        <FormField
                          control={form.control}
                          name="marco2_nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Nome da entrega" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DateFieldWithTBD
                        label="Data de Entrega"
                        value={dataMarco2}
                        onChange={handleMarco2DateChange}
                        onTBDChange={handleMarco2TBDChange}
                        isTBD={marco2TBD}
                        placeholder="Selecione a data"
                      />
                    </div>
                  </div>
                </div>

                {/* Marco 3 */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-pmo-primary">Marco 3</h4>
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div className="col-span-2">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="entregaveis3">Entregáveis</Label>
                          <FormField
                            control={form.control}
                            name="marco3_responsavel"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea {...field} placeholder="Descreva os entregáveis..." rows={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="entrega3">Nome da Entrega</Label>
                        <FormField
                          control={form.control}
                          name="marco3_nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Nome da entrega" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DateFieldWithTBD
                        label="Data de Entrega"
                        value={dataMarco3}
                        onChange={handleMarco3DateChange}
                        onTBDChange={handleMarco3TBDChange}
                        isTBD={marco3TBD}
                        placeholder="Selecione a data"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
