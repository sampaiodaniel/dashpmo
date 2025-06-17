
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';
import { CARTEIRAS } from '@/types/pmo';
import { format } from 'date-fns';
import { CriarProjetoForm } from './CriarProjetoForm';

interface CriarProjetoModalProps {
  onProjetoCriado?: () => void;
}

export function CriarProjetoModal({ onProjetoCriado }: CriarProjetoModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome_projeto: '',
    descricao_projeto: '',
    responsavel_asa: '',
    gp_responsavel_cwi: '',
    responsavel_cwi: '',
    carteira_primaria: '',
    carteira_secundaria: 'none',
    carteira_terciaria: 'none',
    equipe: '',
    finalizacao_prevista: null as Date | null,
    finalizacao_tbd: false
  });
  
  const { criarProjeto, isLoading } = useProjetosOperations();

  const handleInputChange = (field: string, value: string | Date | null | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_projeto || !formData.descricao_projeto || !formData.carteira_primaria || !formData.responsavel_asa || !formData.gp_responsavel_cwi) {
      return;
    }

    // Se não é TBD, a data é obrigatória
    if (!formData.finalizacao_tbd && !formData.finalizacao_prevista) {
      return;
    }

    // Formatar data para string no formato ISO ou manter como TBD
    const finalizacaoPrevista = formData.finalizacao_tbd 
      ? 'TBD'
      : formData.finalizacao_prevista 
        ? format(formData.finalizacao_prevista, 'yyyy-MM-dd')
        : null;

    const projeto = await criarProjeto({
      nome_projeto: formData.nome_projeto,
      descricao_projeto: formData.descricao_projeto || null,
      area_responsavel: formData.carteira_primaria as typeof CARTEIRAS[number],
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

    if (projeto) {
      setOpen(false);
      setFormData({
        nome_projeto: '',
        descricao_projeto: '',
        responsavel_asa: '',
        gp_responsavel_cwi: '',
        responsavel_cwi: '',
        carteira_primaria: '',
        carteira_secundaria: 'none',
        carteira_terciaria: 'none',
        equipe: '',
        finalizacao_prevista: null,
        finalizacao_tbd: false
      });
      onProjetoCriado?.();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        
        <CriarProjetoForm
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
