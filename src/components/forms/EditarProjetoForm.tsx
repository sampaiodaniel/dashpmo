
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Projeto, CARTEIRAS } from '@/types/pmo';
import { useQueryClient } from '@tanstack/react-query';
import { useResponsaveisASA } from '@/hooks/useResponsaveisASA';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';

interface EditarProjetoFormProps {
  projeto: Projeto;
  onSuccess: () => void;
}

// Lista fixa de GPs
const GPS_RESPONSAVEIS = [
  'Camila',
  'Elias', 
  'Fabiano',
  'Fred',
  'Marco',
  'Rafael',
  'Jefferson'
];

export function EditarProjetoForm({ projeto, onSuccess }: EditarProjetoFormProps) {
  console.log('📋 EditarProjetoForm iniciado com projeto:', projeto);
  
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);
  
  // Buscar apenas responsáveis ASA (superintendentes)
  const { data: responsaveisASA } = useResponsaveisASA();
  const { data: tiposProjeto } = useTiposProjeto();
  
  console.log('📊 Dados carregados:', { responsaveisASA, tiposProjeto });
  
  // Filtrar apenas superintendentes
  const superintendentes = responsaveisASA?.filter(resp => resp.nivel === 'Superintendente') || [];
  
  const [formData, setFormData] = useState({
    nome_projeto: projeto.nome_projeto || '',
    tipo_projeto_id: projeto.tipo_projeto_id || null,
    descricao_projeto: projeto.descricao_projeto || '',
    responsavel_asa: projeto.responsavel_asa || 'none',
    gp_responsavel_cwi: projeto.gp_responsavel_cwi || 'none',
    responsavel_cwi: projeto.responsavel_cwi || 'none',
    carteira_primaria: projeto.carteira_primaria || 'none',
    carteira_secundaria: projeto.carteira_secundaria || 'none',
    carteira_terciaria: projeto.carteira_terciaria || 'none',
    equipe: projeto.equipe || '',
    finalizacao_prevista: projeto.finalizacao_prevista && projeto.finalizacao_prevista !== 'TBD' ? projeto.finalizacao_prevista : '',
  });

  console.log('📝 FormData inicial:', formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Enviando formulário:', formData);
    setCarregando(true);

    try {
      // Convert "none" back to null/empty string for database
      const dataToSubmit = {
        nome_projeto: formData.nome_projeto,
        tipo_projeto_id: formData.tipo_projeto_id,
        descricao_projeto: formData.descricao_projeto,
        responsavel_asa: formData.responsavel_asa === 'none' ? '' : formData.responsavel_asa,
        gp_responsavel_cwi: formData.gp_responsavel_cwi === 'none' ? '' : formData.gp_responsavel_cwi,
        responsavel_cwi: formData.responsavel_cwi === 'none' ? '' : formData.responsavel_cwi,
        carteira_primaria: formData.carteira_primaria === 'none' ? '' : formData.carteira_primaria,
        carteira_secundaria: formData.carteira_secundaria === 'none' ? '' : formData.carteira_secundaria,
        carteira_terciaria: formData.carteira_terciaria === 'none' ? '' : formData.carteira_terciaria,
        equipe: formData.equipe,
        // Usar null quando for vazio, senão usar a data formatada
        finalizacao_prevista: formData.finalizacao_prevista || null,
        // Manter os campos obrigatórios do banco com valores derivados dos novos campos
        area_responsavel: (formData.carteira_primaria === 'none' ? 'Cadastro' : formData.carteira_primaria) as typeof CARTEIRAS[number],
        responsavel_interno: formData.responsavel_asa === 'none' ? 'Admin' : formData.responsavel_asa,
        gp_responsavel: formData.gp_responsavel_cwi === 'none' ? 'Admin' : formData.gp_responsavel_cwi
      };

      console.log('📝 Dados sendo enviados para atualização:', dataToSubmit);

      const { error } = await supabase
        .from('projetos')
        .update(dataToSubmit)
        .eq('id', projeto.id);

      if (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar projeto",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Projeto atualizado com sucesso');
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      onSuccess();
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar projeto",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (field: string, value: string | Date | null | boolean | number) => {
    console.log('🔄 Campo alterado:', { field, value });
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!projeto) {
    console.error('❌ Projeto não encontrado no EditarProjetoForm');
    return <div>Projeto não encontrado</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome_projeto">Nome do Projeto</Label>
            <Input
              id="nome_projeto"
              value={formData.nome_projeto}
              onChange={(e) => handleInputChange('nome_projeto', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="tipo_projeto_id">Tipo de Projeto</Label>
            <Select 
              value={formData.tipo_projeto_id?.toString() || ''} 
              onValueChange={(value) => handleInputChange('tipo_projeto_id', value ? parseInt(value) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nenhum">Nenhum</SelectItem>
                {tiposProjeto?.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="descricao_projeto">Descrição do Projeto</Label>
            <Textarea
              id="descricao_projeto"
              value={formData.descricao_projeto}
              onChange={(e) => handleInputChange('descricao_projeto', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="finalizacao_prevista">Finalização Prevista</Label>
            <Input
              id="finalizacao_prevista"
              type="date"
              value={formData.finalizacao_prevista}
              onChange={(e) => handleInputChange('finalizacao_prevista', e.target.value)}
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
              onChange={(e) => handleInputChange('equipe', e.target.value)}
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
            <Label htmlFor="responsavel_asa">Responsável ASA</Label>
            <Select value={formData.responsavel_asa} onValueChange={(value) => handleInputChange('responsavel_asa', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável ASA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {superintendentes.map((responsavel) => (
                  <SelectItem key={responsavel.id} value={responsavel.nome}>
                    {responsavel.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="gp_responsavel_cwi">Chefe do Projeto</Label>
            <Select value={formData.gp_responsavel_cwi} onValueChange={(value) => handleInputChange('gp_responsavel_cwi', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um chefe do projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {GPS_RESPONSAVEIS.map((gp) => (
                  <SelectItem key={gp} value={gp}>
                    {gp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="responsavel_cwi">Responsável</Label>
            <Select value={formData.responsavel_cwi} onValueChange={(value) => handleInputChange('responsavel_cwi', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {GPS_RESPONSAVEIS.map((responsavel) => (
                  <SelectItem key={responsavel} value={responsavel}>
                    {responsavel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Carteiras</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="carteira_primaria">Carteira Primária</Label>
            <Select value={formData.carteira_primaria} onValueChange={(value) => handleInputChange('carteira_primaria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma carteira" />
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
            <Label htmlFor="carteira_secundaria">Carteira Secundária</Label>
            <Select value={formData.carteira_secundaria} onValueChange={(value) => handleInputChange('carteira_secundaria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma carteira" />
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
            <Select value={formData.carteira_terciaria} onValueChange={(value) => handleInputChange('carteira_terciaria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma carteira" />
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

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
