
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCarteiras } from '@/hooks/useListaValores';

interface InformacoesBasicasSectionProps {
  carteiraSelecionada: string;
  projetoId: string;
  progressoEstimado: string;
  projetosFiltrados: any[];
  onCarteiraChange: (carteira: string) => void;
  onProjetoChange: (projeto: string) => void;
  onProgressoChange: (progresso: string) => void;
}

export function InformacoesBasicasSection({
  carteiraSelecionada,
  projetoId,
  progressoEstimado,
  projetosFiltrados,
  onCarteiraChange,
  onProjetoChange,
  onProgressoChange,
}: InformacoesBasicasSectionProps) {
  const { data: carteiras } = useCarteiras();

  // Gerar opções de progresso de 5 em 5
  const progressoOpcoes = Array.from({ length: 21 }, (_, i) => i * 5);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Informações Básicas</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="carteira">Carteira *</Label>
          <Select value={carteiraSelecionada} onValueChange={onCarteiraChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a carteira..." />
            </SelectTrigger>
            <SelectContent>
              {carteiras?.map((carteira) => (
                <SelectItem key={carteira} value={carteira}>
                  {carteira}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projeto">Projeto *</Label>
          <Select 
            value={projetoId} 
            onValueChange={onProjetoChange}
            disabled={!carteiraSelecionada}
          >
            <SelectTrigger>
              <SelectValue placeholder={carteiraSelecionada ? "Selecione o projeto..." : "Selecione uma carteira primeiro"} />
            </SelectTrigger>
            <SelectContent>
              {projetosFiltrados?.map((projeto) => (
                <SelectItem key={projeto.id} value={projeto.id.toString()}>
                  {projeto.nome_projeto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="progresso">Progresso Estimado (%)</Label>
          <Select value={progressoEstimado} onValueChange={onProgressoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o progresso..." />
            </SelectTrigger>
            <SelectContent>
              {progressoOpcoes.map((valor) => (
                <SelectItem key={valor} value={valor.toString()}>
                  {valor}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
