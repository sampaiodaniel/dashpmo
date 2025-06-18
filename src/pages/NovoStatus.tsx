
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNovoStatusForm } from '@/hooks/useNovoStatusForm';
import { ProjetoInformacaoSection } from '@/components/forms/status/ProjetoInformacaoSection';
import { StatusInformacaoSection } from '@/components/forms/status/StatusInformacaoSection';
import { DetalhesStatusSection } from '@/components/forms/status/DetalhesStatusSection';
import { ProximasEntregasForm } from '@/components/forms/status/ProximasEntregasForm';
import { calcularMatrizRisco } from '@/utils/riskMatrixCalculator';

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
            <ProjetoInformacaoSection
              carteiraSelecionada={carteiraSelecionada}
              projetoSelecionado={projetoSelecionado}
              onCarteiraChange={handleCarteiraChange}
              onProjetoChange={(value) => handleProjetoChange(Number(value))}
            />

            <StatusInformacaoSection
              form={form}
              progressoEstimado={progressoEstimado}
              onProgressoChange={handleProgressoChange}
              matrizRisco={matrizRisco}
            />

            <DetalhesStatusSection form={form} />

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
