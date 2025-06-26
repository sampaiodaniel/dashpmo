
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History, Trash2, MoreVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useProjetos } from '@/hooks/useProjetos';
import { ProjetoInfoGerais } from '@/components/projetos/ProjetoInfoGerais';
import { ProjetoStatus } from '@/components/projetos/ProjetoStatus';
import { ProjetoAcoes } from '@/components/projetos/ProjetoAcoes';
import { ProjetoAcoesAdmin } from '@/components/projetos/ProjetoAcoesAdmin';
import { HistoricoProjetoModal } from '@/components/modals/HistoricoProjetoModal';
import { useState } from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading, isAdmin } = useAuth();
  const { data: projetos, isLoading: projetosLoading, refetch } = useProjetos();
  const { data: tiposProjeto } = useTiposProjeto();
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
  
  useScrollToTop();

  const projeto = projetos?.find(p => p.id === Number(id));

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading || projetosLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/DashPMO_Icon_recortado.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <div className="text-pmo-gray">Carregando detalhes do projeto...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (!projeto) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/DashPMO_Icon_recortado.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <h1 className="text-2xl font-bold text-pmo-primary mb-4">Projeto não encontrado</h1>
            <p className="text-pmo-gray mb-6">O projeto solicitado não existe ou foi removido.</p>
            <Button onClick={() => navigate('/projetos')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Projetos
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Buscar o nome do tipo de projeto
  const tipoProjeto = tiposProjeto?.find(tipo => tipo.id === projeto.tipo_projeto_id);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/projetos')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{projeto.nome_projeto}</h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-pmo-gray">Detalhes do projeto</p>
                {projeto.status_ativo && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Ativo
                  </Badge>
                )}
                {!projeto.status_ativo && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Inativo
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-2">
              <Button 
                onClick={() => setIsHistoricoOpen(true)}
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <History className="h-4 w-4 mr-1" />
                Histórico
              </Button>
              
              <ProjetoAcoes projeto={projeto} onRefresh={handleRefresh} />
              
              {isAdmin() && (
                <ProjetoAcoesAdmin projeto={projeto} onRefresh={handleRefresh} />
              )}
            </div>
            
            {/* Menu mobile */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsHistoricoOpen(true)}>
                    <History className="h-4 w-4 mr-2" />
                    Histórico
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate(`/novo-status?projeto=${projeto.id}`)}>
                    Novo Status
                  </DropdownMenuItem>
                  
                  {isAdmin() && (
                    <>
                      <DropdownMenuItem onClick={() => navigate(`/nova-mudanca?projeto=${projeto.id}`)}>
                        Nova Mudança
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Projeto
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <ProjetoInfoGerais projeto={projeto} />
          
          <Separator />
          
          <ProjetoStatus projeto={projeto} />
        </div>
      </div>

      <HistoricoProjetoModal 
        projetoId={projeto.id}
        nomeProjeto={projeto.nome_projeto}
        aberto={isHistoricoOpen}
        onFechar={() => setIsHistoricoOpen(false)}
      />
    </Layout>
  );
}
