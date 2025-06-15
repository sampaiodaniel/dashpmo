
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { useProjetos } from '@/hooks/useProjetos';
import { useNavigate } from 'react-router-dom';

export default function NovoStatus() {
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: projetos } = useProjetos();
  const { salvarStatus, isLoading } = useStatusOperations();
  const navigate = useNavigate();

  const [projetoId, setProjetoId] = useState('');
  const [statusGeral, setStatusGeral] = useState<string>('');
  const [statusVisaoGp, setStatusVisaoGp] = useState<string>('');
  const [impactoRiscos, setImpactoRiscos] = useState<string>('');
  const [probabilidadeRiscos, setProbabilidadeRiscos] = useState<string>('');
  const [realizadoSemana, setRealizadoSemana] = useState('');
  const [bloqueios, setBloqueios] = useState('');

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
    
    if (!projetoId || !statusGeral || !statusVisaoGp || !impactoRiscos || !probabilidadeRiscos) {
      return;
    }

    const status = await salvarStatus({
      projeto_id: parseInt(projetoId),
      status_geral: statusGeral as any,
      status_visao_gp: statusVisaoGp as any,
      impacto_riscos: impactoRiscos as any,
      probabilidade_riscos: probabilidadeRiscos as any,
      realizado_semana_atual: realizadoSemana,
      bloqueios_atuais: bloqueios,
    });

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
          <h1 className="text-3xl font-bold text-pmo-primary">Novo Status</h1>
          <p className="text-pmo-gray mt-2">Cadastrar atualização de status do projeto</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Atualização de Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projeto">Projeto *</Label>
                <Select value={projetoId} onValueChange={setProjetoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o projeto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projetos?.map((projeto) => (
                      <SelectItem key={projeto.id} value={projeto.id.toString()}>
                        {projeto.nome_projeto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status-geral">Status Geral *</Label>
                <Select value={statusGeral} onValueChange={setStatusGeral}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                    <SelectItem value="Aguardando Homologação">Aguardando Homologação</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Em Especificação">Em Especificação</SelectItem>
                    <SelectItem value="Pausado">Pausado</SelectItem>
                    <SelectItem value="Planejamento">Planejamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-visao">Visão GP *</Label>
                <Select value={statusVisaoGp} onValueChange={setStatusVisaoGp}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a visão..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verde">Verde</SelectItem>
                    <SelectItem value="Amarelo">Amarelo</SelectItem>
                    <SelectItem value="Vermelho">Vermelho</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="impacto">Impacto Riscos *</Label>
                  <Select value={impactoRiscos} onValueChange={setImpactoRiscos}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixo">Baixo</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Alto">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="probabilidade">Probabilidade Riscos *</Label>
                  <Select value={probabilidadeRiscos} onValueChange={setProbabilidadeRiscos}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixo">Baixo</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Alto">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="realizado">Realizado na Semana</Label>
                <Textarea 
                  id="realizado" 
                  placeholder="Descreva as atividades realizadas..." 
                  rows={4}
                  value={realizadoSemana}
                  onChange={(e) => setRealizadoSemana(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloqueios">Bloqueios/Impedimentos</Label>
                <Textarea 
                  id="bloqueios" 
                  placeholder="Descreva os bloqueios encontrados..." 
                  rows={3}
                  value={bloqueios}
                  onChange={(e) => setBloqueios(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="bg-pmo-primary hover:bg-pmo-primary/90"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : 'Salvar Status'}
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
