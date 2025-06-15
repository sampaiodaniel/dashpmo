
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

  // Campos básicos
  const [statusImport, setStatusImport] = useState('');
  const [projetoId, setProjetoId] = useState('');
  const [progressoEstimado, setProgressoEstimado] = useState('');
  const [responsavelCwi, setResponsavelCwi] = useState('');
  const [gpResponsavelCwi, setGpResponsavelCwi] = useState('');
  const [responsavelAsa, setResponsavelAsa] = useState('');
  
  // Carteiras
  const [carteiraPrimaria, setCarteiraPrimaria] = useState('');
  const [carteiraSecundaria, setCarteiraSecundaria] = useState('');
  const [carteiraTerciaria, setCarteiraTerciaria] = useState('');
  
  // Status e riscos
  const [statusGeral, setStatusGeral] = useState<string>('');
  const [statusVisaoGp, setStatusVisaoGp] = useState<string>('');
  const [impactoRiscos, setImpactoRiscos] = useState<string>('');
  const [probabilidadeRiscos, setProbabilidadeRiscos] = useState<string>('');
  
  // Realizado e planejamento
  const [realizadoSemana, setRealizadoSemana] = useState('');
  
  // Entregáveis e marcos
  const [entregaveis1, setEntregaveis1] = useState('');
  const [entrega1, setEntrega1] = useState('');
  const [dataMarco1, setDataMarco1] = useState('');
  const [entregaveis2, setEntregaveis2] = useState('');
  const [entrega2, setEntrega2] = useState('');
  const [dataMarco2, setDataMarco2] = useState('');
  const [entregaveis3, setEntregaveis3] = useState('');
  const [entrega3, setEntrega3] = useState('');
  const [dataMarco3, setDataMarco3] = useState('');
  
  // Outros campos
  const [finalizacaoPrevista, setFinalizacaoPrevista] = useState('');
  const [backlog, setBacklog] = useState('');
  const [bloqueios, setBloqueios] = useState('');
  const [observacoesPontosAtencao, setObservacoesPontosAtencao] = useState('');
  const [descricaoProjeto, setDescricaoProjeto] = useState('');
  const [equipe, setEquipe] = useState('');

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
      status_import: statusImport || null,
      projeto_id: parseInt(projetoId),
      progresso_estimado: progressoEstimado ? parseInt(progressoEstimado) : null,
      responsavel_cwi: responsavelCwi || null,
      gp_responsavel_cwi: gpResponsavelCwi || null,
      responsavel_asa: responsavelAsa || null,
      carteira_primaria: carteiraPrimaria || null,
      carteira_secundaria: carteiraSecundaria || null,
      carteira_terciaria: carteiraTerciaria || null,
      status_geral: statusGeral as any,
      status_visao_gp: statusVisaoGp as any,
      impacto_riscos: impactoRiscos as any,
      probabilidade_riscos: probabilidadeRiscos as any,
      realizado_semana_atual: realizadoSemana || null,
      entregaveis1: entregaveis1 || null,
      entrega1: entrega1 || null,
      data_marco1: dataMarco1 || null,
      entregaveis2: entregaveis2 || null,
      entrega2: entrega2 || null,
      data_marco2: dataMarco2 || null,
      entregaveis3: entregaveis3 || null,
      entrega3: entrega3 || null,
      data_marco3: dataMarco3 || null,
      finalizacao_prevista: finalizacaoPrevista || null,
      backlog: backlog || null,
      bloqueios_atuais: bloqueios || null,
      observacoes_pontos_atencao: observacoesPontosAtencao || null,
      descricao_projeto: descricaoProjeto || null,
      equipe: equipe || null,
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
          <p className="text-pmo-gray mt-2">Cadastrar atualização completa de status do projeto</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Atualização de Status Completa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Informações Básicas</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status-import">Status Import</Label>
                    <Input 
                      id="status-import" 
                      placeholder="Status de importação..." 
                      value={statusImport}
                      onChange={(e) => setStatusImport(e.target.value)}
                    />
                  </div>
                  
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progresso">Progresso Estimado (%)</Label>
                  <Input 
                    id="progresso" 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="0" 
                    value={progressoEstimado}
                    onChange={(e) => setProgressoEstimado(e.target.value)}
                  />
                </div>
              </div>

              {/* Responsáveis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Responsáveis</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel-cwi">Responsável CWI</Label>
                    <Input 
                      id="responsavel-cwi" 
                      placeholder="Nome do responsável CWI..." 
                      value={responsavelCwi}
                      onChange={(e) => setResponsavelCwi(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gp-responsavel-cwi">GP Responsável CWI</Label>
                    <Input 
                      id="gp-responsavel-cwi" 
                      placeholder="Nome do GP responsável CWI..." 
                      value={gpResponsavelCwi}
                      onChange={(e) => setGpResponsavelCwi(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsavel-asa">Responsável Asa</Label>
                    <Input 
                      id="responsavel-asa" 
                      placeholder="Nome do responsável Asa..." 
                      value={responsavelAsa}
                      onChange={(e) => setResponsavelAsa(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Carteiras */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Carteiras</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carteira-primaria">Carteira Primária</Label>
                    <Input 
                      id="carteira-primaria" 
                      placeholder="Carteira primária..." 
                      value={carteiraPrimaria}
                      onChange={(e) => setCarteiraPrimaria(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carteira-secundaria">Carteira Secundária</Label>
                    <Input 
                      id="carteira-secundaria" 
                      placeholder="Carteira secundária..." 
                      value={carteiraSecundaria}
                      onChange={(e) => setCarteiraSecundaria(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carteira-terciaria">Carteira Terciária</Label>
                    <Input 
                      id="carteira-terciaria" 
                      placeholder="Carteira terciária..." 
                      value={carteiraTerciaria}
                      onChange={(e) => setCarteiraTerciaria(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Status e Riscos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Status e Riscos</h3>
                
                <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Marco 1 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Marco 1</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entregaveis1">Entregáveis 1</Label>
                    <Textarea 
                      id="entregaveis1" 
                      placeholder="Descreva os entregáveis..." 
                      rows={3}
                      value={entregaveis1}
                      onChange={(e) => setEntregaveis1(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="entrega1">Entrega 1</Label>
                    <Input 
                      id="entrega1" 
                      placeholder="Nome da entrega..." 
                      value={entrega1}
                      onChange={(e) => setEntrega1(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-marco1">Data Marco 1</Label>
                    <Input 
                      id="data-marco1" 
                      type="date" 
                      value={dataMarco1}
                      onChange={(e) => setDataMarco1(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Marco 2 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Marco 2</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entregaveis2">Entregáveis 2</Label>
                    <Textarea 
                      id="entregaveis2" 
                      placeholder="Descreva os entregáveis..." 
                      rows={3}
                      value={entregaveis2}
                      onChange={(e) => setEntregaveis2(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="entrega2">Entrega 2</Label>
                    <Input 
                      id="entrega2" 
                      placeholder="Nome da entrega..." 
                      value={entrega2}
                      onChange={(e) => setEntrega2(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-marco2">Data Marco 2</Label>
                    <Input 
                      id="data-marco2" 
                      type="date" 
                      value={dataMarco2}
                      onChange={(e) => setDataMarco2(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Marco 3 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Marco 3</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entregaveis3">Entregáveis 3</Label>
                    <Textarea 
                      id="entregaveis3" 
                      placeholder="Descreva os entregáveis..." 
                      rows={3}
                      value={entregaveis3}
                      onChange={(e) => setEntregaveis3(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="entrega3">Entrega 3</Label>
                    <Input 
                      id="entrega3" 
                      placeholder="Nome da entrega..." 
                      value={entrega3}
                      onChange={(e) => setEntrega3(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-marco3">Data Marco 3</Label>
                    <Input 
                      id="data-marco3" 
                      type="date" 
                      value={dataMarco3}
                      onChange={(e) => setDataMarco3(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Outras Informações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Outras Informações</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finalizacao-prevista">Finalização Prevista</Label>
                    <Input 
                      id="finalizacao-prevista" 
                      type="date" 
                      value={finalizacaoPrevista}
                      onChange={(e) => setFinalizacaoPrevista(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="equipe">Equipe</Label>
                    <Input 
                      id="equipe" 
                      placeholder="Membros da equipe..." 
                      value={equipe}
                      onChange={(e) => setEquipe(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao-projeto">Descrição do Projeto</Label>
                  <Textarea 
                    id="descricao-projeto" 
                    placeholder="Descreva o projeto..." 
                    rows={4}
                    value={descricaoProjeto}
                    onChange={(e) => setDescricaoProjeto(e.target.value)}
                  />
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
                  <Label htmlFor="backlog">Backlog</Label>
                  <Textarea 
                    id="backlog" 
                    placeholder="Itens do backlog..." 
                    rows={3}
                    value={backlog}
                    onChange={(e) => setBacklog(e.target.value)}
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

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações e Pontos de Atenção</Label>
                  <Textarea 
                    id="observacoes" 
                    placeholder="Observações importantes..." 
                    rows={3}
                    value={observacoesPontosAtencao}
                    onChange={(e) => setObservacoesPontosAtencao(e.target.value)}
                  />
                </div>
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
