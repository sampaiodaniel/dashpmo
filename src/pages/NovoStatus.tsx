
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { useNavigate } from 'react-router-dom';
import { useNovoStatusForm } from '@/hooks/useNovoStatusForm';
import { InformacoesBasicasSection } from '@/components/forms/InformacoesBasicasSection';
import { ResponsaveisSection } from '@/components/forms/ResponsaveisSection';
import { StatusRiscosSection } from '@/components/forms/StatusRiscosSection';
import { ProximasEntregasSection } from '@/components/forms/ProximasEntregasSection';
import { OutrasInformacoesSection } from '@/components/forms/OutrasInformacoesSection';

export default function NovoStatus() {
  const { usuario, isLoading: authLoading } = useAuth();
  const { salvarStatus, isLoading } = useStatusOperations();
  const navigate = useNavigate();
  
  const {
    // Basic info
    carteiraSelecionada,
    projetoId,
    progressoEstimado,
    projetosFiltrados,
    handleCarteiraChange,
    setProjetoId,
    setProgressoEstimado,
    
    // Responsáveis
    responsavelCwi,
    gpResponsavelCwi,
    responsavelAsa,
    setResponsavelCwi,
    setGpResponsavelCwi,
    setResponsavelAsa,
    
    // Status e riscos
    statusGeral,
    statusVisaoGp,
    impactoRiscos,
    probabilidadeRiscos,
    setStatusGeral,
    setStatusVisaoGp,
    setImpactoRiscos,
    setProbabilidadeRiscos,
    
    // Entregas
    nomeEntrega1,
    escopoEntrega1,
    dataEntrega1,
    nomeEntrega2,
    escopoEntrega2,
    dataEntrega2,
    nomeEntrega3,
    escopoEntrega3,
    dataEntrega3,
    setNomeEntrega1,
    setEscopoEntrega1,
    setDataEntrega1,
    setNomeEntrega2,
    setEscopoEntrega2,
    setDataEntrega2,
    setNomeEntrega3,
    setEscopoEntrega3,
    setDataEntrega3,
    
    // Outras informações
    realizadoSemana,
    backlog,
    bloqueios,
    observacoesPontosAtencao,
    setRealizadoSemana,
    setBacklog,
    setBloqueios,
    setObservacoesPontosAtencao,
    
    // Methods
    getFormData,
    isFormValid,
  } = useNovoStatusForm();

  if (authLoading) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }

    const status = await salvarStatus(getFormData());

    if (status) {
      navigate('/projetos');
    }
  };

  const handleCancel = () => {
    navigate('/projetos');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Status Semanal</h1>
          <p className="text-pmo-gray mt-2">Cadastrar atualização de status semanal do projeto</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Atualização de Status Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <InformacoesBasicasSection
                carteiraSelecionada={carteiraSelecionada}
                projetoId={projetoId}
                progressoEstimado={progressoEstimado}
                projetosFiltrados={projetosFiltrados}
                onCarteiraChange={handleCarteiraChange}
                onProjetoChange={setProjetoId}
                onProgressoChange={setProgressoEstimado}
              />

              <ResponsaveisSection
                responsavelCwi={responsavelCwi}
                gpResponsavelCwi={gpResponsavelCwi}
                responsavelAsa={responsavelAsa}
                onResponsavelCwiChange={setResponsavelCwi}
                onGpResponsavelCwiChange={setGpResponsavelCwi}
                onResponsavelAsaChange={setResponsavelAsa}
              />

              <StatusRiscosSection
                statusGeral={statusGeral}
                statusVisaoGp={statusVisaoGp}
                impactoRiscos={impactoRiscos}
                probabilidadeRiscos={probabilidadeRiscos}
                onStatusGeralChange={setStatusGeral}
                onStatusVisaoGpChange={setStatusVisaoGp}
                onImpactoRiscosChange={setImpactoRiscos}
                onProbabilidadeRiscosChange={setProbabilidadeRiscos}
              />

              <ProximasEntregasSection
                entrega1={{
                  nome: nomeEntrega1,
                  escopo: escopoEntrega1,
                  data: dataEntrega1,
                }}
                entrega2={{
                  nome: nomeEntrega2,
                  escopo: escopoEntrega2,
                  data: dataEntrega2,
                }}
                entrega3={{
                  nome: nomeEntrega3,
                  escopo: escopoEntrega3,
                  data: dataEntrega3,
                }}
                onEntrega1Change={(field, value) => {
                  if (field === 'nome') setNomeEntrega1(value);
                  if (field === 'escopo') setEscopoEntrega1(value);
                  if (field === 'data') setDataEntrega1(value);
                }}
                onEntrega2Change={(field, value) => {
                  if (field === 'nome') setNomeEntrega2(value);
                  if (field === 'escopo') setEscopoEntrega2(value);
                  if (field === 'data') setDataEntrega2(value);
                }}
                onEntrega3Change={(field, value) => {
                  if (field === 'nome') setNomeEntrega3(value);
                  if (field === 'escopo') setEscopoEntrega3(value);
                  if (field === 'data') setDataEntrega3(value);
                }}
              />

              <OutrasInformacoesSection
                realizadoSemana={realizadoSemana}
                backlog={backlog}
                bloqueios={bloqueios}
                observacoesPontosAtencao={observacoesPontosAtencao}
                onRealizadoSemanaChange={setRealizadoSemana}
                onBacklogChange={setBacklog}
                onBloqueiosChange={setBloqueios}
                onObservacoesChange={setObservacoesPontosAtencao}
              />

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="bg-pmo-primary hover:bg-pmo-primary/90"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : 'Salvar Status Semanal'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
