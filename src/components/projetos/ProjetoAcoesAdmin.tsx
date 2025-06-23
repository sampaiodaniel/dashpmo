import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreVertical, Archive, Trash2, X, ArchiveRestore, RefreshCw } from 'lucide-react';
import { Projeto } from '@/types/pmo';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProjetoAcoesAdminProps {
  projeto: Projeto;
  onProjetoAtualizado?: () => void;
}

export function ProjetoAcoesAdmin({ projeto, onProjetoAtualizado }: ProjetoAcoesAdminProps) {
  const [alertAberto, setAlertAberto] = useState<'fechar' | 'arquivar' | 'excluir' | 'reabrir' | 'desarquivar' | null>(null);
  const [dadosVinculados, setDadosVinculados] = useState<{
    totalStatus: number;
    totalMudancas: number;
    totalLicoes: number;
    totalDependencias: number;
    carregando: boolean;
  }>({
    totalStatus: 0,
    totalMudancas: 0,
    totalLicoes: 0,
    totalDependencias: 0,
    carregando: false
  });
  
  const { atualizarProjeto, apagarProjeto, isLoading } = useProjetosOperations();
  const navigate = useNavigate();

  const buscarDadosVinculados = async () => {
    if (!alertAberto || alertAberto !== 'excluir') {
      return;
    }

    setDadosVinculados(prev => ({ ...prev, carregando: true }));

    try {
      const [statusResult, mudancasResult, licoesResult, dependenciasResult] = await Promise.all([
        supabase.from('status_projeto').select('id').eq('projeto_id', projeto.id),
        supabase.from('mudancas_replanejamento').select('id').eq('projeto_id', projeto.id),
        supabase.from('licoes_aprendidas').select('id').eq('projeto_id', projeto.id),
        supabase.from('dependencias').select('id').eq('projeto_id', projeto.id)
      ]);

      setDadosVinculados({
        totalStatus: statusResult.data?.length || 0,
        totalMudancas: mudancasResult.data?.length || 0,
        totalLicoes: licoesResult.data?.length || 0,
        totalDependencias: dependenciasResult.data?.length || 0,
        carregando: false
      });
    } catch (error) {
      console.error('Erro ao buscar dados vinculados:', error);
      setDadosVinculados(prev => ({ ...prev, carregando: false }));
    }
  };

  useEffect(() => {
    buscarDadosVinculados();
  }, [alertAberto]);

  const handleFecharProjeto = async () => {
    const sucesso = await atualizarProjeto(projeto.id, { status_ativo: false });
    if (sucesso) {
      toast({
        title: "Projeto fechado",
        description: "O projeto foi fechado com sucesso. Não será possível adicionar novos status.",
      });
      onProjetoAtualizado?.();
    }
    setAlertAberto(null);
  };

  const handleReabrirProjeto = async () => {
    const sucesso = await atualizarProjeto(projeto.id, { status_ativo: true });
    if (sucesso) {
      toast({
        title: "Projeto reaberto",
        description: "O projeto foi reaberto com sucesso. Agora é possível adicionar novos status.",
      });
      onProjetoAtualizado?.();
    }
    setAlertAberto(null);
  };

  const handleArquivarProjeto = async () => {
    const sucesso = await atualizarProjeto(projeto.id, { arquivado: true, status_ativo: false } as any);
    if (sucesso) {
      toast({
        title: "Projeto arquivado",
        description: "O projeto foi arquivado e removido da visualização padrão.",
      });
      onProjetoAtualizado?.();
      // Se estamos na página de detalhes, voltar para a lista
      if (window.location.pathname.includes('/projetos/')) {
        navigate('/projetos');
      }
    }
    setAlertAberto(null);
  };

  const handleDesarquivarProjeto = async () => {
    const sucesso = await atualizarProjeto(projeto.id, { arquivado: false } as any);
    if (sucesso) {
      toast({
        title: "Projeto desarquivado",
        description: "O projeto foi desarquivado e voltou à visualização padrão.",
      });
      onProjetoAtualizado?.();
    }
    setAlertAberto(null);
  };

  const handleExcluirProjeto = async () => {
    const sucesso = await apagarProjeto(projeto.id);
    if (sucesso) {
      onProjetoAtualizado?.();
      // Se estamos na página de detalhes, voltar para a lista
      if (window.location.pathname.includes('/projetos/')) {
        navigate('/projetos');
      }
    }
    setAlertAberto(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Opções para projetos ativos */}
          {projeto.status_ativo && (
            <>
              <DropdownMenuItem onClick={() => setAlertAberto('fechar')}>
                <X className="h-4 w-4 mr-2" />
                Fechar Projeto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAlertAberto('arquivar')}>
                <Archive className="h-4 w-4 mr-2" />
                Arquivar Projeto
              </DropdownMenuItem>
            </>
          )}
          
          {/* Opções para projetos fechados */}
          {!projeto.status_ativo && (
            <DropdownMenuItem onClick={() => setAlertAberto('reabrir')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reabrir Projeto
            </DropdownMenuItem>
          )}
          
          {/* Opções para projetos arquivados */}
          {projeto.arquivado && (
            <DropdownMenuItem onClick={() => setAlertAberto('desarquivar')}>
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Desarquivar Projeto
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setAlertAberto('excluir')}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Projeto
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertAberto === 'fechar'} onOpenChange={() => setAlertAberto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fechar Projeto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja fechar o projeto "{projeto.nome_projeto}"? 
              Projetos fechados podem ser consultados através de filtros específicos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFecharProjeto} disabled={isLoading}>
              Fechar Projeto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={alertAberto === 'arquivar'} onOpenChange={() => setAlertAberto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivar Projeto</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Tem certeza que deseja arquivar o projeto "{projeto.nome_projeto}"?
              </p>
              <p className="text-sm text-gray-600">
                Projetos arquivados ficam inativos e são ocultados das visualizações padrão, 
                mas podem ser consultados através de filtros específicos.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleArquivarProjeto} disabled={isLoading}>
              Arquivar Projeto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={alertAberto === 'reabrir'} onOpenChange={() => setAlertAberto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reabrir Projeto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reabrir o projeto "{projeto.nome_projeto}"? 
              O projeto voltará a aceitar novos status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReabrirProjeto} disabled={isLoading}>
              Reabrir Projeto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={alertAberto === 'desarquivar'} onOpenChange={() => setAlertAberto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desarquivar Projeto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desarquivar o projeto "{projeto.nome_projeto}"? 
              O projeto voltará a aparecer na visualização padrão.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDesarquivarProjeto} disabled={isLoading}>
              Desarquivar Projeto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={alertAberto === 'excluir'} onOpenChange={() => setAlertAberto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p className="text-red-600 font-medium">ATENÇÃO: Esta ação é irreversível!</p>
              <p>
                Tem certeza que deseja excluir permanentemente o projeto "{projeto.nome_projeto}"?
              </p>
              
              {dadosVinculados.carregando ? (
                <p className="text-sm text-gray-500">Verificando dados vinculados...</p>
              ) : (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-sm font-medium text-red-700 mb-2">Dados que serão excluídos junto:</p>
                  <ul className="text-sm text-red-600 space-y-1">
                    <li>• {dadosVinculados.totalStatus} status</li>
                    <li>• {dadosVinculados.totalMudancas} mudanças/replanejamentos</li>
                    <li>• {dadosVinculados.totalLicoes} lições aprendidas</li>
                    <li>• {dadosVinculados.totalDependencias} dependências</li>
                  </ul>
                  <p className="text-sm text-red-700 mt-2 font-medium">
                    Total: {dadosVinculados.totalStatus + dadosVinculados.totalMudancas + dadosVinculados.totalLicoes + dadosVinculados.totalDependencias} registros serão removidos
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-600">
                Esta operação excluirá o projeto e todos os dados vinculados permanentemente.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExcluirProjeto} 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
