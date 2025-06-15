
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ResponsaveisSectionProps {
  responsavelCwi: string;
  gpResponsavelCwi: string;
  responsavelAsa: string;
  onResponsavelCwiChange: (value: string) => void;
  onGpResponsavelCwiChange: (value: string) => void;
  onResponsavelAsaChange: (value: string) => void;
}

export function ResponsaveisSection({
  responsavelCwi,
  gpResponsavelCwi,
  responsavelAsa,
  onResponsavelCwiChange,
  onGpResponsavelCwiChange,
  onResponsavelAsaChange,
}: ResponsaveisSectionProps) {
  // Listas de opções
  const responsaveisCwi = ['Camila', 'Elias', 'Fabiano', 'Fred', 'Marco', 'Rafael', 'Jefferson'];
  const responsaveisAsa = ['Dapper', 'Pitta', 'Judice', 'Thadeus', 'André Simões', 'Júlio', 'Mello', 'Rebonatto', 'Mickey', 'Armelin'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Responsáveis</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="responsavel-cwi">Responsável CWI</Label>
          <Select value={responsavelCwi} onValueChange={onResponsavelCwiChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {responsaveisCwi.map((nome) => (
                <SelectItem key={nome} value={nome}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gp-responsavel-cwi">GP Responsável CWI</Label>
          <Select value={gpResponsavelCwi} onValueChange={onGpResponsavelCwiChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {responsaveisCwi.map((nome) => (
                <SelectItem key={nome} value={nome}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="responsavel-asa">Responsável Asa</Label>
          <Select value={responsavelAsa} onValueChange={onResponsavelAsaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {responsaveisAsa.map((nome) => (
                <SelectItem key={nome} value={nome}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
