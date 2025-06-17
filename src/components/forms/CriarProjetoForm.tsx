
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';
import { CARTEIRAS } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CriarProjetoFormProps {
  formData: any;
  onInputChange: (field: string, value: string | Date | null | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function CriarProjetoForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  onCancel
}: CriarProjetoFormProps) {
  const { data: responsaveisASA } = useResponsaveisASADropdown();
  const [dataTBD, setDataTBD] = useState(false);

  const handleDataToggle = (isTBD: boolean) => {
    setDataTBD(isTBD);
    if (isTBD) {
      onInputChange('finalizacao_prevista', null);
      onInputChange('finalizacao_tbd', true);
    } else {
      onInputChange('finalizacao_tbd', false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome_projeto">Nome do Projeto *</Label>
            <Input
              id="nome_projeto"
              value={formData.nome_projeto}
              onChange={(e) => onInputChange('nome_projeto', e.target.value)}
              placeholder="Digite o nome do projeto..."
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao_projeto">Descrição do Projeto *</Label>
            <Textarea
              id="descricao_projeto"
              value={formData.descricao_projeto}
              onChange={(e) => onInputChange('descricao_projeto', e.target.value)}
              placeholder="Descrição do projeto..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="finalizacao_prevista">Finalização Prevista *</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!dataTBD ? "default" : "outline"}
                  onClick={() => handleDataToggle(false)}
                  className="flex-1"
                >
                  Data Específica
                </Button>
                <Button
                  type="button"
                  variant={dataTBD ? "default" : "outline"}
                  onClick={() => handleDataToggle(true)}
                  className="flex-1"
                >
                  TBD (A definir)
                </Button>
              </div>
              
              {!dataTBD && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.finalizacao_prevista && "text-muted-foreground"
                      )}
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.finalizacao_prevista ? (
                        format(formData.finalizacao_prevista, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.finalizacao_prevista}
                      onSelect={(date) => onInputChange('finalizacao_prevista', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              )}
              
              {dataTBD && (
                <div className="p-3 bg-gray-100 rounded border text-center text-gray-600">
                  Data a ser definida (TBD)
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="equipe">Equipe</Label>
            <Textarea
              id="equipe"
              value={formData.equipe}
              onChange={(e) => onInputChange('equipe', e.target.value)}
              placeholder="Membros da equipe separados por vírgula"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Responsáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Responsáveis</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="responsavel_asa">Responsável ASA *</Label>
            <Select value={formData.responsavel_asa} onValueChange={(value) => onInputChange('responsavel_asa', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável ASA..." />
              </SelectTrigger>
              <SelectContent>
                {responsaveisASA?.map((nome) => (
                  <SelectItem key={nome} value={nome}>
                    {nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="gp_responsavel_cwi">Chefe do Projeto *</Label>
            <Input
              id="gp_responsavel_cwi"
              value={formData.gp_responsavel_cwi}
              onChange={(e) => onInputChange('gp_responsavel_cwi', e.target.value)}
              placeholder="Digite o nome do chefe do projeto..."
              required
            />
          </div>

          <div>
            <Label htmlFor="responsavel_cwi">Responsável</Label>
            <Input
              id="responsavel_cwi"
              value={formData.responsavel_cwi}
              onChange={(e) => onInputChange('responsavel_cwi', e.target.value)}
              placeholder="Digite o nome do responsável..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Carteiras */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Carteiras</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="carteira_primaria">Carteira Primária *</Label>
            <Select value={formData.carteira_primaria} onValueChange={(value) => onInputChange('carteira_primaria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a carteira primária..." />
              </SelectTrigger>
              <SelectContent>
                {CARTEIRAS.map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="carteira_secundaria">Carteira Secundária</Label>
            <Select value={formData.carteira_secundaria} onValueChange={(value) => onInputChange('carteira_secundaria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma carteira..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {CARTEIRAS.map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="carteira_terciaria">Carteira Terciária</Label>
            <Select value={formData.carteira_terciaria} onValueChange={(value) => onInputChange('carteira_terciaria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma carteira..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {CARTEIRAS.map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          className="bg-pmo-primary hover:bg-pmo-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Criando...' : 'Criar Projeto'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
