
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Plus, Search, Edit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMudancasList } from '@/hooks/useMudancasList';
import { CriarMudancaModal } from '@/components/forms/CriarMudancaModal';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function Mudancas() {
  const { usuario, isLoading } = useAuth();
  const { data: mudancas, isLoading: mudancasLoading, error: mudancasError } = useMudancasList();
  const [termoBusca, setTermoBusca] = useState('');
  const queryClient = useQueryClient();

  const handleMudancaCriada = () => {
    queryClient.invalidateQueries({ queryKey: ['mudancas-list'] });
  };

  const mudancasFiltradas = mudancas?.filter(mudanca =>
    mudanca.projeto?.nome_projeto.toLowerCase().includes(termoBusca.toLowerCase()) ||
    mudanca.tipo_mudanca.toLowerCase().includes(termoBusca.toLowerCase()) ||
    mudanca.solicitante.toLowerCase().includes(termoBusca.toLowerCase())
  ) || [];

  const getStatusMudancaColor = (status: string) => {
    switch (status) {
      case 'Aprovada': return 'text-pmo-success bg-pmo-success/10';
      case 'Em Análise': return 'text-blue-600 bg-blue-100';
      case 'Rejeitada': return 'text-pmo-danger bg-pmo-danger/10';
      case 'Pendente': return 'text-pmo-warning bg-pmo-warning/10';
      default: return 'text-pmo-gray bg-gray-100';
    }
  };

  const getTipoMudancaColor = (tipo: string) => {
    switch (tipo) {
      case 'Correção Bug': return 'text-red-600 bg-red-100';
      case 'Melhoria': return 'text-green-600 bg-green-100';
      case 'Mudança Escopo': return 'text-purple-600 bg-purple-100';
      case 'Novo Requisito': return 'text-blue-600 bg-blue-100';
      case 'Replanejamento Cronograma': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">Mudanças</h1>
            <p className="text-pmo-gray mt-2">Gestão de change requests</p>
          </div>
          <CriarMudancaModal onMudancaCriada={handleMudancaCriada} />
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pmo-gray" />
            <Input 
              placeholder="Buscar mudanças..." 
              className="pl-10"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-pmo-warning">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-warning">
                {mudancas?.filter(m => m.status_aprovacao === 'Pendente').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Em Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mudancas?.filter(m => m.status_aprovacao === 'Em Análise').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-success">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-success">
                {mudancas?.filter(m => m.status_aprovacao === 'Aprovada').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-danger">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rejeitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-danger">
                {mudancas?.filter(m => m.status_aprovacao === 'Rejeitada').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Lista de Mudanças
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mudancasError && (
              <div className="text-center py-8 text-red-600">
                <p>Erro ao carregar mudanças: {mudancasError.message}</p>
              </div>
            )}
            
            {mudancasLoading ? (
              <div className="text-center py-8 text-pmo-gray">
                <div>Carregando mudanças...</div>
              </div>
            ) : mudancasFiltradas && mudancasFiltradas.length > 0 ? (
              <div className="divide-y">
                {mudancasFiltradas.map((mudanca) => (
                  <div 
                    key={mudanca.id} 
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => {
                      if (mudanca.status_aprovacao !== 'Aprovada') {
                        // TODO: Implementar modal ou página de edição da mudança
                        console.log('Editando mudança:', mudanca.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-xl text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                            {mudanca.projeto?.nome_projeto}
                          </h3>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {mudanca.projeto?.area_responsavel}
                          </Badge>
                          <Badge className={getTipoMudancaColor(mudanca.tipo_mudanca)}>
                            {mudanca.tipo_mudanca}
                          </Badge>
                          <Badge className={getStatusMudancaColor(mudanca.status_aprovacao)}>
                            {mudanca.status_aprovacao}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-pmo-gray">Solicitante:</span>
                            <div className="font-medium">{mudanca.solicitante}</div>
                          </div>
                          <div>
                            <span className="text-pmo-gray">Data Solicitação:</span>
                            <div className="font-medium">
                              {mudanca.data_solicitacao.toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <div>
                            <span className="text-pmo-gray">Impacto (dias):</span>
                            <div className="font-medium">{mudanca.impacto_prazo_dias}</div>
                          </div>
                          {mudanca.data_aprovacao && (
                            <div>
                              <span className="text-pmo-gray">Data Aprovação:</span>
                              <div className="font-medium">
                                {mudanca.data_aprovacao.toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-pmo-gray mb-1">Descrição:</div>
                          <p className="text-sm text-gray-700 mb-2">
                            {mudanca.descricao}
                          </p>
                          <div className="text-sm font-medium text-pmo-gray mb-1">Justificativa:</div>
                          <p className="text-sm text-gray-700">
                            {mudanca.justificativa_negocio}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {mudanca.status_aprovacao !== 'Aprovada' && (
                          <Edit className="h-4 w-4 text-pmo-gray group-hover:text-pmo-primary transition-colors" />
                        )}
                        <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-pmo-gray">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">
                  {termoBusca ? 'Nenhuma mudança encontrada para sua busca' : 'Nenhuma mudança encontrada'}
                </p>
                <p className="text-sm">
                  {termoBusca ? 'Tente alterar os termos da busca' : 'Comece criando sua primeira solicitação de mudança'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
