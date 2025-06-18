
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarteiraProjetoSelect } from '@/components/forms/CarteiraProjetoSelect';

interface ProjetoInformacaoSectionProps {
  carteiraSelecionada: string;
  projetoSelecionado: number | null;
  onCarteiraChange: (carteira: string) => void;
  onProjetoChange: (projeto: string) => void;
}

export function ProjetoInformacaoSection({
  carteiraSelecionada,
  projetoSelecionado,
  onCarteiraChange,
  onProjetoChange,
}: ProjetoInformacaoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CarteiraProjetoSelect
          carteira={carteiraSelecionada}
          projeto={projetoSelecionado?.toString() || ''}
          onCarteiraChange={onCarteiraChange}
          onProjetoChange={onProjetoChange}
          required
        />
      </CardContent>
    </Card>
  );
}
