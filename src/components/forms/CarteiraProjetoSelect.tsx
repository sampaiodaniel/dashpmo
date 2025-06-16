
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CARTEIRAS } from '@/types/pmo';
import { useProjetos } from '@/hooks/useProjetos';
import { useMemo } from 'react';

interface CarteiraProjetoSelectProps {
  carteira: string;
  projeto: string;
  onCarteiraChange: (value: string) => void;
  onProjetoChange: (value: string) => void;
  required?: boolean;
}

export function CarteiraProjetoSelect({
  carteira,
  projeto,
  onCarteiraChange,
  onProjetoChange,
  required = false
}: CarteiraProjetoSelectProps) {
  const { data: projetos } = useProjetos();

  const projetosFiltrados = useMemo(() => {
    if (!projetos || !carteira) return [];
    
    return projetos
      .filter(p => p.area_responsavel === carteira)
      .sort((a, b) => a.nome_projeto.localeCompare(b.nome_projeto));
  }, [projetos, carteira]);

  const handleCarteiraChange = (value: string) => {
    onCarteiraChange(value);
    // Limpar projeto quando carteira mudar
    if (projeto) {
      onProjetoChange('');
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="carteira">Carteira {required && '*'}</Label>
        <Select value={carteira} onValueChange={handleCarteiraChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a carteira..." />
          </SelectTrigger>
          <SelectContent>
            {CARTEIRAS.map((cart) => (
              <SelectItem key={cart} value={cart}>
                {cart}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projeto">Projeto {required && '*'}</Label>
        <Select 
          value={projeto} 
          onValueChange={onProjetoChange}
          disabled={!carteira}
        >
          <SelectTrigger>
            <SelectValue placeholder={carteira ? "Selecione o projeto..." : "Selecione uma carteira primeiro"} />
          </SelectTrigger>
          <SelectContent>
            {projetosFiltrados.map((proj) => (
              <SelectItem key={proj.id} value={proj.id.toString()}>
                {proj.nome_projeto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
