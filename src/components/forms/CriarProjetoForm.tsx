
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';
import { CARTEIRAS } from '@/types/pmo';

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
  const { data: tiposProjeto } = useTiposProjeto();

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
            <Label htmlFor="tipo_projeto_id">Tipo de Projeto *</Label>
            <Select 
              value={formData.tipo_projeto_id?.toString() || ''} 
              onValueChange={(value) => onInputChange('tipo_projeto_id', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de projeto..." />
              </SelectTrigger>
              <SelectContent>
                {tiposProjeto?.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="finalizacao_prevista">Finalização Prevista</Label>
            <Input
              id="finalizacao_prevista"
              type="date"
              value={formData.finalizacao_prevista || ''}
              onChange={(e) => onInputChange('finalizacao_prevista', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe em branco se a data ainda for indefinida (TBD)
            </p>
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
