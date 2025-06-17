
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
  const [formData, setFormData] = useState({
    nome_projeto: '',
    tipo_projeto_id: null as number | null,
    descricao_projeto: '',
    responsavel_asa: '',
    gp_responsavel_cwi: '',
    responsavel_cwi: '',
    carteira_primaria: '',
    carteira_secundaria: 'none',
    carteira_terciaria: 'none',
    equipe: '',
    finalizacao_prevista: '',
  });
  
  const { editarProjeto, isLoading } = useProjetosOperations();

  // Carregar dados do projeto quando o modal abrir
  useEffect(() => {
    if (aberto && projeto) {
      setFormData({
        nome_projeto: projeto.nome_projeto || '',
        tipo_projeto_id: projeto.tipo_projeto_id || null,
        descricao_projeto: projeto.descricao_projeto || projeto.descricao || '',
        responsavel_asa: projeto.responsavel_asa || '',
        gp_responsavel_cwi: projeto.gp_responsavel_cwi || projeto.gp_responsavel || '',
        responsavel_cwi: projeto.responsavel_cwi || '',
        carteira_primaria: projeto.area_responsavel || '',
        carteira_secundaria: projeto.carteira_secundaria || 'none',
        carteira_terciaria: projeto.carteira_terciaria || 'none',
        equipe: projeto.equipe || '',
        finalizacao_prevista: projeto.finalizacao_prevista || '',
      });
    }
  }, [aberto, projeto]);

  const handleInputChange = (field: string, value: string | Date | null | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_projeto || !formData.descricao_projeto || !formData.carteira_primaria || !formData.responsavel_asa || !formData.gp_responsavel_cwi || !formData.tipo_projeto_id) {
      return;
    }

    // Formatar data para string no formato ISO ou null se vazio
    const finalizacaoPrevista = formData.finalizacao_prevista 
      ? formData.finalizacao_prevista
      : null;

    const projetoAtualizado = await editarProjeto(projeto.id, {
      nome_projeto: formData.nome_projeto,
      tipo_projeto_id: formData.tipo_projeto_id,
      descricao_projeto: formData.descricao_projeto || null,
      area_responsavel: formData.carteira_primaria as any,
      carteira_primaria: formData.carteira_primaria || null,
      carteira_secundaria: formData.carteira_secundaria === 'none' ? null : formData.carteira_secundaria || null,
      carteira_terciaria: formData.carteira_terciaria === 'none' ? null : formData.carteira_terciaria || null,
      responsavel_interno: formData.responsavel_asa,
      responsavel_asa: formData.responsavel_asa || null,
      gp_responsavel: formData.gp_responsavel_cwi,
      gp_responsavel_cwi: formData.gp_responsavel_cwi || null,
      responsavel_cwi: formData.responsavel_cwi || null,
      finalizacao_prevista: finalizacaoPrevista,
      equipe: formData.equipe || null,
    });

    if (projetoAtualizado) {
      onFechar();
    }
  };

  const handleCancel = () => {
    onFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        
        <EditarProjetoForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
