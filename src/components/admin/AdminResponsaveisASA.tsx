
import { useState } from 'react';
import { useResponsaveisASA, useResponsaveisASAOperations } from '@/hooks/useResponsaveisASA';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ResponsavelASAModal } from './ResponsavelASAModal';
import { ResponsavelASA } from '@/types/admin';

export function AdminResponsaveisASA() {
  const [modalAberto, setModalAberto] = useState(false);
  const [responsavelEditando, setResponsavelEditando] = useState<ResponsavelASA | null>(null);
  
  const { data: responsaveis, isLoading } = useResponsaveisASA();
  const { deleteResponsavel } = useResponsaveisASAOperations();

  const handleEditar = (responsavel: ResponsavelASA) => {
    setResponsavelEditando(responsavel);
    setModalAberto(true);
  };

  const handleNovo = () => {
    setResponsavelEditando(null);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setResponsavelEditando(null);
  };

  const handleRemover = (id: number) => {
    if (confirm('Tem certeza que deseja remover este responsável?')) {
      deleteResponsavel.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const heads = responsaveis?.filter(r => r.nivel === 'Head') || [];
  const superintendentes = responsaveis?.filter(r => r.nivel === 'Superintendente') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Responsáveis ASA</h2>
        <Button onClick={handleNovo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Responsável
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Head</TableHead>
              <TableHead>Carteiras</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {heads.map((head) => (
              <>
                <TableRow key={head.id} className="bg-blue-50">
                  <TableCell className="font-medium">{head.nome}</TableCell>
                  <TableCell>
                    <Badge variant="default">{head.nivel}</Badge>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {head.carteiras?.map((carteira) => (
                        <Badge key={carteira} variant="outline" className="text-xs">
                          {carteira}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditar(head)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRemover(head.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {superintendentes
                  .filter(s => s.head_id === head.id)
                  .map((superintendente) => (
                    <TableRow key={superintendente.id}>
                      <TableCell className="pl-8">{superintendente.nome}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{superintendente.nivel}</Badge>
                      </TableCell>
                      <TableCell>{head.nome}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {superintendente.carteiras?.map((carteira) => (
                            <Badge key={carteira} variant="outline" className="text-xs">
                              {carteira}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEditar(superintendente)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRemover(superintendente.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <ResponsavelASAModal
        aberto={modalAberto}
        onFechar={handleFecharModal}
        responsavel={responsavelEditando}
      />
    </div>
  );
}
