import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNovoStatusForm } from '@/hooks/useNovoStatusForm';
import { CarteiraProjetoSelect } from '@/components/forms/CarteiraProjetoSelect';

export default function NovoStatus() {
  const { usuario, isLoading } = useAuth();
  const { 
    form, 
    isLoading: isSubmitting, 
    onSubmit,
    projetoSelecionado,
    carteiraSelecionada,
    handleCarteiraChange,
    handleProjetoChange
  } = useNovoStatusForm();

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
                  carteiraSelecionada={carteiraSelecionada}
                  projetoSelecionado={projetoSelecionado?.toString() || ''}
                  onCarteiraChange={handleCarteiraChange}
                  onProjetoChange={(value) => handleProjetoChange(Number(value))}
                />
              </CardContent>
            </Card>

            {/* Status Section */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status_geral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Geral</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status_visao_gp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visão GP</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a visão" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Verde">Verde</SelectItem>
                            <SelectItem value="Amarelo">Amarelo</SelectItem>
                            <SelectItem value="Vermelho">Vermelho</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="probabilidade_riscos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Probabilidade de Riscos</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a probabilidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Baixo">Baixo</SelectItem>
                            <SelectItem value="Médio">Médio</SelectItem>
                            <SelectItem value="Alto">Alto</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impacto_riscos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impacto dos Riscos</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o impacto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Baixo">Baixo</SelectItem>
                            <SelectItem value="Médio">Médio</SelectItem>
                            <SelectItem value="Alto">Alto</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Text Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  name="entregas_realizadas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entregas Realizadas</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Lista de entregas realizadas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proximas_entregas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Próximas Entregas</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Próximas entregas planejadas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marcos_projeto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marcos do Projeto</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Marcos importantes do projeto" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="riscos_identificados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Riscos Identificados</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Riscos identificados no projeto" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mudancas_solicitadas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mudanças Solicitadas</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Mudanças solicitadas no projeto" />
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
                      <FormLabel>Observações Gerais</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Observações gerais sobre o projeto" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Marco 1 (Required Fields) */}
            <Card>
              <CardHeader>
                <CardTitle>Marco 1 (Obrigatório)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="marco1_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Marco *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do marco" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marco1_data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marco1_responsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do responsável" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Marco 2 (Optional Fields) */}
            <Card>
              <CardHeader>
                <CardTitle>Marco 2 (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="marco2_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Marco</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do marco" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marco2_data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marco2_responsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do responsável" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Marco 3 (Optional Fields) */}
            <Card>
              <CardHeader>
                <CardTitle>Marco 3 (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="marco3_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Marco</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do marco" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marco3_data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marco3_responsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do responsável" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
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
