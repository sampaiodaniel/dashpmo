
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';
import { useProjetos } from '@/hooks/useProjetos';
import { useQueryClient } from '@tanstack/react-query';

export function AtualizarProjetosTipo() {
  const [loading, setLoading] = useState(false);
  const { data: tiposProjeto } = useTiposProjeto();
  const { data: projetos } = useProjetos({});
  const queryClient = useQueryClient();

  // Pegar o primeiro tipo (Projetos Estratégicos)
  const primeiroTipo = tiposProjeto?.[0];
  
  // Contar projetos sem tipo
  const projetosSemTipo = projetos?.filter(p => !p.tipo_projeto_id)?.length || 0;

  const atualizarProjetos = async () => {
    if (!primeiroTipo) {
      toast({
        title: "Erro",
        description: "Tipo de projeto não encontrado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('projetos')
        .update({ tipo_projeto_id: primeiroTipo.id })
        .is('tipo_projeto_id', null);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${projetosSemTipo} projetos atualizados com o tipo "${primeiroTipo.valor}"`,
      });

      queryClient.invalidateQueries({ queryKey: ['projetos'] });
    } catch (error) {
      console.error('Erro ao atualizar projetos:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (projetosSemTipo === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="h-5 w-5" />
          Atualização de Tipos de Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-orange-700">
          Foram encontrados <strong>{projetosSemTipo} projetos</strong> sem tipo definido. 
          Deseja atualizar todos para o tipo "{primeiroTipo?.valor}"?
        </p>
        
        <Button 
          onClick={atualizarProjetos}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Projetos
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
