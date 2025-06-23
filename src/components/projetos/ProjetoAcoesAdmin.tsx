
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreVertical, Archive, Trash2, X, ArchiveRestore, RefreshCw } from 'lucide-react';
import { Projeto } from '@/types/pmo';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ProjetoAcoesAdminProps {
  projeto: Projeto;
  onProjetoAtualizado?: () => void;
}

export function ProjetoAcoesAdmin({ projeto, onProjetoAtualizado }: ProjetoAcoesAdminProps) {
  const [alertAberto, setAlertAberto] = useState<'fechar' | 'arquivar' | 'apagar' | 'reabrir' | 'desarquivar' | null>(null);
  const { atualizarProjeto, apagarProjeto, isLoading } = useProjetosOperations();
  const navigate = useNavigate();

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

  const handleApagarProjeto = async () => {
    const sucesso = await apagarProjeto(projeto.id);
    if (sucesso) {
      toast({
        title: "Projeto apagado",
        description: "O projeto foi removido permanentemente do sistema.",
      });
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
          {projeto.status_ativo && !projeto.arquivado && (
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
          
          {/* Opções para projetos fechados mas não arquivados */}
          {!projeto.status_ativo && !projeto.arquivado && (
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
            onClick={() => setAlertAberto('apagar')}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Apagar Projeto
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
            <AlertDialogDescription>
              Tem certeza que deseja arquivar o projeto "{projeto.nome_projeto}"? 
              Projetos arquivados podem ser consultados através de filtros específicos.
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

      <AlertDialog open={alertAberto === 'apagar'} onOpenChange={() => setAlertAberto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar Projeto</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="text-red-600 font-medium">ATENÇÃO: Esta ação é irreversível!</p>
              <p>
                Tem certeza que deseja apagar permanentemente o projeto "{projeto.nome_projeto}"?
              </p>
              <p className="text-sm text-gray-600">
                Só é possível apagar projetos que não possuem status vinculados.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApagarProjeto} 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              Apagar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
