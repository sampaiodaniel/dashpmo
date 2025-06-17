
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResponsaveisASAHierarquia } from '@/hooks/useResponsaveisASAHierarquia';

const CARTEIRAS = [
  'Cadastro',
  'Canais', 
  'Core Bancário',
  'Crédito',
  'Cripto',
  'Empréstimos',
  'Fila Rápida',
  'Investimentos 1',
  'Investimentos 2',
  'Onboarding',
  'Open Finance'
];

interface IncidentesFiltersCompactProps {
  responsavelSelecionado: string;
  carteiraSelecionada: string;
  onResponsavelChange: (responsavel: string) => void;
  onCarteiraChange: (carteira: string) => void;
}

export function IncidentesFiltersCompact({ 
  responsavelSelecionado, 
  carteiraSelecionada,
  onResponsavelChange, 
  onCarteiraChange 
}: IncidentesFiltersCompactProps) {
  const { data: responsaveisASA, isLoading } = useResponsaveisASAHierarquia();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-pmo-gray mb-2 block">Filtrar por Carteira</label>
            <Select value={carteiraSelecionada} onValueChange={onCarteiraChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as carteiras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as carteiras</SelectItem>
                {CARTEIRAS.map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-pmo-gray mb-2 block">Filtrar por Responsável ASA</label>
            <Select value={responsavelSelecionado} onValueChange={onResponsavelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os responsáveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os responsáveis</SelectItem>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : (
                  responsaveisASA?.filter(responsavel => responsavel && responsavel.nome && responsavel.nome.trim() !== '').map((responsavel) => (
                    <SelectItem key={responsavel.id} value={responsavel.nome}>
                      {responsavel.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
