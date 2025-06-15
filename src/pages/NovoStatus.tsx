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
import { useState, useMemo } from 'react';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { useProjetos } from '@/hooks/useProjetos';
import { useNavigate } from 'react-router-dom';
import { useCarteiras } from '@/hooks/useListaValores';

export default function NovoStatus() {
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: carteiras } = useCarteiras();
  const { salvarStatus, isLoading } = useStatusOperations();
  const navigate = useNavigate();

  // Campos básicos - declarar carteiraSelecionada primeiro
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('');
  
  // Agora posso usar carteiraSelecionada no hook
  const { data: todosProjetos } = useProjetos({ incluirFechados: true, area: carteiraSelecionada || undefined });
  
  const [projetoId, setProjetoId] = useState('');
  const [progressoEstimado, setProgressoEstimado] = useState('');
  const [responsavelCwi, setResponsavelCwi] = useState('');
  const [gpResponsavelCwi, setGpResponsavelCwi] = useState('');
  const [responsavelAsa, setResponsavelAsa] = useState('');
  
  // Status e riscos
  const [statusGeral, setStatusGeral] = useState<string>('');
  const [statusVisaoGp, setStatusVisaoGp] = useState<string>('');
  const [impactoRiscos, setImpactoRiscos] = useState<string>('');
  const [probabilidadeRiscos, setProbabilidadeRiscos] = useState<string>('');
  
  // Realizado e planejamento
  const [realizadoSemana, setRealizadoSemana] = useState('');
  
  // Próximas entregas
  const [nomeEntrega1, setNomeEntrega1] = useState('');
  const [escopoEntrega1, setEscopoEntrega1] = useState('');
  const [dataEntrega1, setDataEntrega1] = useState('');
  const [nomeEntrega2, setNomeEntrega2] = useState('');
  const [escopoEntrega2, setEscopoEntrega2] = useState('');
  const [dataEntrega2, setDataEntrega2] = useState('');
  const [nomeEntrega3, setNomeEntrega3] = useState('');
  const [escopoEntrega3, setEscopoEntrega3] = useState('');
  const [dataEntrega3, setDataEntrega3] = useState('');
  
  // Outros campos
  const [backlog, setBacklog] = useState('');
  const [bloqueios, setBloqueios] = useState('');
  const [observacoesPontosAtencao, setObservacoesPontosAtencao] = useState('');

  // Listas de opções
  const responsaveisCwi = ['Camila', 'Elias', 'Fabiano', 'Fred', 'Marco', 'Rafael', 'Jefferson'];
  const responsaveisAsa = ['Dapper', 'Pitta', 'Judice', 'Thadeus', 'André Simões', 'Júlio', 'Mello', 'Rebonatto', 'Mickey', 'Armelin'];

  // Filtrar projetos pela carteira selecionada não é mais necessário pois já vem filtrado do hook
  const projetosFiltrados = useMemo(() => {
    return todosProjetos || [];
  }, [todosProjetos]);

  // Gerar opções de progresso de 5 em 5
  const progressoOpcoes = Array.from({ length: 21 }, (_, i) => i * 5);

  // Resetar projeto quando carteira muda
  const handleCarteiraChange = (novaCarteira: string) => {
    setCarteiraSelecionada(novaCarteira);
    setProjetoId(''); // Limpar projeto selecionado
  };

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
      progresso_estimado: progressoEstimado ? parseInt(progressoEstimado) : null,
      responsavel_cwi: responsavelCwi || null,
      gp_responsavel_cwi: gpResponsavelCwi || null,
      responsavel_asa: responsavelAsa || null,
      carteira_primaria: null,
      carteira_secundaria: null,
      carteira_terciaria: null,
      status_geral: statusGeral as any,
      status_visao_gp: statusVisaoGp as any,
      impacto_riscos: impactoRiscos as any,
      probabilidade_riscos: probabilidadeRiscos as any,
      realizado_semana_atual: realizadoSemana || null,
      entregaveis1: escopoEntrega1 || null,
      entrega1: nomeEntrega1 || null,
      data_marco1: dataEntrega1 || null,
      entregaveis2: escopoEntrega2 || null,
      entrega2: nomeEntrega2 || null,
      data_marco2: dataEntrega2 || null,
      entregaveis3: escopoEntrega3 || null,
      entrega3: nomeEntrega3 || null,
      data_marco3: dataEntrega3 || null,
      backlog: backlog || null,
      bloqueios_atuais: bloqueios || null,
      observacoes_pontos_atencao: observacoesPontosAtencao || null,
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
              
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Informações Básicas</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carteira">Carteira *</Label>
                    <Select value={carteiraSelecionada} onValueChange={handleCarteiraChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a carteira..." />
                      </SelectTrigger>
                      <SelectContent>
                        {carteiras?.map((carteira) => (
                          <SelectItem key={carteira} value={carteira}>
                            {carteira}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projeto">Projeto *</Label>
                    <Select 
                      value={projetoId} 
                      onValueChange={setProjetoId}
                      disabled={!carteiraSelecionada}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={carteiraSelecionada ? "Selecione o projeto..." : "Selecione uma carteira primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {projetosFiltrados?.map((projeto) => (
                          <SelectItem key={projeto.id} value={projeto.id.toString()}>
                            {projeto.nome_projeto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="progresso">Progresso Estimado (%)</Label>
                    <Select value={progressoEstimado} onValueChange={setProgressoEstimado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o progresso..." />
                      </SelectTrigger>
                      <SelectContent>
                        {progressoOpcoes.map((valor) => (
                          <SelectItem key={valor} value={valor.toString()}>
                            {valor}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Responsáveis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Responsáveis</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel-cwi">Responsável CWI</Label>
                    <Select value={responsavelCwi} onValueChange={setResponsavelCwi}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {responsaveisCwi.map((nome) => (
                          <SelectItem key={nome} value={nome}>
                            {nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gp-responsavel-cwi">GP Responsável CWI</Label>
                    <Select value={gpResponsavelCwi} onValueChange={setGpResponsavelCwi}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {responsaveisCwi.map((nome) => (
                          <SelectItem key={nome} value={nome}>
                            {nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsavel-asa">Responsável Asa</Label>
                    <Select value={responsavelAsa} onValueChange={setResponsavelAsa}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {responsaveisAsa.map((nome) => (
                          <SelectItem key={nome} value={nome}>
                            {nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

              {/* Próximas Entregas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Próximas Entregas</h3>
                
                <div className="space-y-6">
                  {/* Entrega 1 */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome-entrega1">Nome da Entrega</Label>
                        <Input 
                          id="nome-entrega1" 
                          placeholder="Nome da entrega..." 
                          value={nomeEntrega1}
                          onChange={(e) => setNomeEntrega1(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="data-entrega1">Data da Entrega</Label>
                        <Input 
                          id="data-entrega1" 
                          type="date" 
                          value={dataEntrega1}
                          onChange={(e) => setDataEntrega1(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="escopo-entrega1">Escopo (Entregáveis)</Label>
                      <Textarea 
                        id="escopo-entrega1" 
                        placeholder="Descreva o escopo da entrega..." 
                        rows={3}
                        value={escopoEntrega1}
                        onChange={(e) => setEscopoEntrega1(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Entrega 2 */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome-entrega2">Nome da Entrega</Label>
                        <Input 
                          id="nome-entrega2" 
                          placeholder="Nome da entrega..." 
                          value={nomeEntrega2}
                          onChange={(e) => setNomeEntrega2(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="data-entrega2">Data da Entrega</Label>
                        <Input 
                          id="data-entrega2" 
                          type="date" 
                          value={dataEntrega2}
                          onChange={(e) => setDataEntrega2(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="escopo-entrega2">Escopo (Entregáveis)</Label>
                      <Textarea 
                        id="escopo-entrega2" 
                        placeholder="Descreva o escopo da entrega..." 
                        rows={3}
                        value={escopoEntrega2}
                        onChange={(e) => setEscopoEntrega2(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Entrega 3 */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome-entrega3">Nome da Entrega</Label>
                        <Input 
                          id="nome-entrega3" 
                          placeholder="Nome da entrega..." 
                          value={nomeEntrega3}
                          onChange={(e) => setNomeEntrega3(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="data-entrega3">Data da Entrega</Label>
                        <Input 
                          id="data-entrega3" 
                          type="date" 
                          value={dataEntrega3}
                          onChange={(e) => setDataEntrega3(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="escopo-entrega3">Escopo (Entregáveis)</Label>
                      <Textarea 
                        id="escopo-entrega3" 
                        placeholder="Descreva o escopo da entrega..." 
                        rows={3}
                        value={escopoEntrega3}
                        onChange={(e) => setEscopoEntrega3(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Outras Informações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Outras Informações</h3>
                
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
