import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ArrowLeft, Save, Info, AlertTriangle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNovoStatusForm } from '@/hooks/useNovoStatusForm';
import { ProjetoInformacaoSection } from '@/components/forms/status/ProjetoInformacaoSection';
import { StatusInformacaoSection } from '@/components/forms/status/StatusInformacaoSection';
import { DetalhesStatusSection } from '@/components/forms/status/DetalhesStatusSection';
import { EntregasDinamicasNovo } from '@/components/forms/EntregasDinamicasNovo';
import { calcularMatrizRisco } from '@/utils/riskMatrixCalculator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function NovoStatus() {
  const { usuario, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const projetoIdFromUrl = searchParams.get('projeto');
  
  let formData;
  try {
    formData = useNovoStatusForm();
  } catch (error) {
    console.error('Erro ao carregar hook useNovoStatusForm:', error);
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar formulário</h1>
            <p className="text-pmo-gray mb-6">
              Ocorreu um erro ao carregar o formulário de novo status. Isso pode ser um problema temporário.
            </p>
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()} variant="outline">
                Recarregar Página
              </Button>
              <Link to="/status">
                <Button variant="default">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const { 
    form, 
    isLoading: isSubmitting, 
    isLoadingListas,
    onSubmit,
    projetoSelecionado,
    carteiraSelecionada,
    progressoEstimado,
    entregas,
    setEntregas,
    handleCarteiraChange,
    handleProjetoChange,
    handleProgressoChange,
    temStatusNaoValidado,
    ultimoStatus
  } = formData;

  // Valores atuais dos campos de risco para calcular a matriz
  const impactoAtual = form.watch('impacto_riscos');
  const probabilidadeAtual = form.watch('probabilidade_riscos');
  const matrizRisco = calcularMatrizRisco(impactoAtual, probabilidadeAtual);

  if (isLoading || isLoadingListas) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <img 
              src="/lovable-uploads/DashPMO_Icon_recortado.png" 
              alt="DashPMO" 
              className="w-12 h-12" 
            />
          </div>
            <div className="text-pmo-gray mb-4">
            {isLoadingListas ? 'Carregando configurações...' : 'Carregando...'}
            </div>
            <div className="text-sm text-gray-500">
              Se demorar muito, pode ser um problema de cache.{' '}
              <button 
                onClick={() => window.location.reload()} 
                className="text-blue-600 underline hover:text-blue-800"
              >
                Clique aqui para recarregar
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/status">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-pmo-primary">Novo Status</h1>
            <p className="text-pmo-gray mt-2">Criar novo status de projeto</p>
          </div>
        </div>

        {/* Alerta para status não validado */}
        {temStatusNaoValidado && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>⚠️ Status anterior não validado:</strong> Existe um status de{' '}
              {ultimoStatus?.data_atualizacao && new Date(ultimoStatus.data_atualizacao).toLocaleDateString('pt-BR')}{' '}
              que ainda não foi revisado pela equipe. Ao criar este novo status, ele se tornará o último status ativo do projeto, 
              enquanto o anterior permanecerá como "Em Revisão" no histórico.
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta informativo quando dados são pré-preenchidos */}
        {(projetoIdFromUrl || projetoSelecionado) && !temStatusNaoValidado && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>📋 Dados pré-preenchidos:</strong> Os campos foram automaticamente preenchidos com base no último status deste projeto. 
              Você pode editar qualquer informação conforme necessário. Os campos "Itens Trabalhados na Semana" e "Bloqueios Atuais" foram limpos para nova atualização.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProjetoInformacaoSection
              carteiraSelecionada={carteiraSelecionada}
              projetoSelecionado={projetoSelecionado}
              onCarteiraChange={handleCarteiraChange}
              onProjetoChange={(value) => handleProjetoChange(Number(value))}
              form={form}
            />

            <StatusInformacaoSection
              form={form}
              progressoEstimado={progressoEstimado}
              onProgressoChange={handleProgressoChange}
              matrizRisco={matrizRisco}
            />

            <DetalhesStatusSection form={form} />

            <EntregasDinamicasNovo
              form={form}
              entregas={entregas}
              onEntregasChange={setEntregas}
            />

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
      </ErrorBoundary>
    </Layout>
  );
}
