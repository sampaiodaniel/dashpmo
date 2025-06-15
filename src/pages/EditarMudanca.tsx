
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useMudancasList } from '@/hooks/useMudancasList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMudancasOperations } from '@/hooks/useMudancasOperations';

export default function EditarMudanca() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading } = useAuth();
  const { data: mudancas, isLoading: mudancasLoading } = useMudancasList();
  const { atualizarMudanca, isLoading: atualizandoMudanca } = useMudancasOperations();

  const mudanca = mudancas?.find(m => m.id === Number(id));

  const [solicitante, setSolicitante] = useState('');
  const [tipoMudanca, setTipoMudanca] = useState('');
  const [descricao, setDescricao] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [impactoPrazo, setImpactoPrazo] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const tiposMudanca = [
    'Correção Bug',
    'Melhoria', 
    'Mudança Escopo',
    'Novo Requisito',
    'Replanejamento Cronograma'
  ];

  useEffect(() => {
    if (mudanca) {
      setSolicitante(mudanca.solicitante);
      setTipoMudanca(mudanca.tipo_mudanca);
      setDescricao(mudanca.descricao);
      setJustificativa(mudanca.justificativa_negocio);
      setImpactoPrazo(mudanca.impacto_prazo_dias.toString());
      setObservacoes(mudanca.observacoes || '');
    }
  }, [mudanca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mudanca || !solicitante || !tipoMudanca || !descricao || !justificativa || !impactoPrazo) {
      return;
    }

    const success = await atualizarMudanca(mudanca.id, {
      solicitante,
      tipo_mudanca: tipoMudanca as any,
      descricao,
      justificativa_negocio: justificativa,
      impacto_prazo_dias: parseInt(impactoPrazo),
      observacoes: observacoes || undefined
    });

    if (success) {
      navigate(`/mudancas/${mudanca.id}`);
    }
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

  if (mudancasLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando mudança...</div>
        </div>
      </Layout>
    );
  }

  if (!mudanca) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">Mudança não encontrada</div>
          <Button onClick={() => navigate('/mudancas')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Mudanças
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/mudancas/${mudanca.id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-pmo-primary">
            Editar Mudança - {mudanca.projeto?.nome_projeto}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="solicitante">Solicitante *</Label>
              <Input 
                id="solicitante" 
                placeholder="Nome do solicitante..." 
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo da Mudança *</Label>
                <Select value={tipoMudanca} onValueChange={setTipoMudanca}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMudanca.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impacto">Impacto no Cronograma (dias) *</Label>
                <Input 
                  id="impacto" 
                  type="number"
                  placeholder="0" 
                  value={impactoPrazo}
                  onChange={(e) => setImpactoPrazo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição da Mudança *</Label>
              <Textarea 
                id="descricao" 
                placeholder="Descreva detalhadamente a mudança solicitada..." 
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa de Negócio *</Label>
              <Textarea 
                id="justificativa" 
                placeholder="Explique a justificativa de negócio para esta mudança..." 
                rows={4}
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea 
                id="observacoes" 
                placeholder="Observações ou informações complementares..." 
                rows={3}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="bg-pmo-primary hover:bg-pmo-primary/90"
                disabled={atualizandoMudanca}
              >
                <Save className="h-4 w-4 mr-2" />
                {atualizandoMudanca ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(`/mudancas/${mudanca.id}`)}
                disabled={atualizandoMudanca}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
