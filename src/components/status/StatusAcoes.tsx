
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Archive, Trash2 } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface StatusAcoesProps {
  status: StatusProjeto;
  onStatusUpdate: () => void;
}

export function StatusAcoes({ status, onStatusUpdate }: StatusAcoesProps) {
  const navigate = useNavigate();
  const [excluirDialogOpen, setExcluirDialogOpen] = useState(false);
  const [arquivarDialogOpen, setArquivarDialogOpen] = useState(false);

  const handleEdit = () => {
    navigate(`/status/${status.id}/editar`);
  };

  const handleArchive = () => {
    // TODO: Implementar arquivamento
    console.log('Arquivar status:', status.id);
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O arquivamento de status será implementado em breve.",
    });
    setArquivarDialogOpen(false);
  };

  const handleDelete = () => {
    // TODO: Implementar exclusão
    console.log('Excluir status:', status.id);
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de status será implementada em breve.",
      variant: "destructive",
    });
    setExcluirDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!status.aprovado && (
            <>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => setArquivarDialogOpen(true)}>
            <Archive className="h-4 w-4 mr-2" />
            Arquivar
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setExcluirDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de confirmação para arquivar */}
      <AlertDialog open={arquivarDialogOpen} onOpenChange={setArquivarDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivar Status</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja arquivar este status? Esta ação pode ser desfeita posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              Arquivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={excluirDialogOpen} onOpenChange={setExcluirDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Status</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este status? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
