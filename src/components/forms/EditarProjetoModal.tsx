
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';
import { Projeto } from '@/types/pmo';
import { EditarProjetoForm } from './EditarProjetoForm';

interface EditarProjetoModalProps {
  projeto: Projeto;
  aberto: boolean;
  onFechar: () => void;
}

export function EditarProjetoModal({ projeto, aberto, onFechar }: EditarProjetoModalProps) {
  const { atualizarProjeto, isLoading } = useProjetosOperations();

  const handleSuccess = () => {
    onFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        
        <EditarProjetoForm
          projeto={projeto}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
