import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Mudanca {
  id: number;
  titulo: string;
  descricao: string;
  impacto: string;
  risco: string;
  data_implementacao: string;
  status_aprovacao: string;
  criado_por: string;
  aprovado_por: string;
  motivo_rejeicao: string;
  detalhes_infra: string;
  plano_rollback: string;
  observacoes: string;
}

export default function MudancaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isAdmin } = useAuth();
  const { toast } = useToast();

  const [mudanca, setMudanca] = useState<Mudanca | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isFetching, error } = useQuery({
    queryKey: ['mudanca', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID da mudança não fornecido');
      }

      const { data, error } = await supabase
        .from('mudancas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar detalhes da mudança:', error);
        throw new Error('Erro ao carregar detalhes da mudança');
      }

      setMudanca(data);
      return data;
    },
  });

  const aprovarMudanca = async () => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID da mudança não especificado.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('mudancas')
      .update({ status_aprovacao: 'Aprovada', aprovado_por: usuario?.nome })
      .eq('id', id);

    if (error) {
      console.error('Erro ao aprovar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar a mudança. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Mudança aprovada com sucesso!",
      });
      navigate('/mudancas');
    }
  };

  const rejeitarMudanca = async () => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID da mudança não especificado.",
        variant: "destructive",
      });
      return;
    }

    const motivo = prompt('Por favor, insira o motivo da rejeição:');
    if (!motivo) {
      toast({
        title: "Atenção",
        description: "Motivo da rejeição não fornecido.",
      });
      return;
    }

    const { error } = await supabase
      .from('mudancas')
      .update({ status_aprovacao: 'Rejeitada', aprovado_por: usuario?.nome, motivo_rejeicao: motivo })
      .eq('id', id);

    if (error) {
      console.error('Erro ao rejeitar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao rejeitar a mudança. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Mudança rejeitada com sucesso!",
      });
      navigate('/mudancas');
    }
  };

  if (isFetching) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!mudanca) return <div>Mudança não encontrada</div>;

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate('/mudancas')} className="mb-4">
        Voltar para a lista
      </Button>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Detalhes da Mudança
            </h2>
            {usuario && isAdmin() && mudanca?.status_aprovacao === 'Pendente' && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={aprovarMudanca}>Aprovar</Button>
                <Button variant="destructive" onClick={rejeitarMudanca}>Rejeitar</Button>
              </div>
            )}
          </div>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{mudanca.titulo}</CardTitle>
            <CardDescription>
              <div className="flex items-center space-x-2">
                <span>Data de Implementação:</span>
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(mudanca.data_implementacao), "PPP", { locale: ptBR })}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Descrição</h3>
              <p className="text-gray-600">{mudanca.descricao}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Impacto</h3>
              <p className="text-gray-600">{mudanca.impacto}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Risco</h3>
              <p className="text-gray-600">{mudanca.risco}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Detalhes da Infraestrutura</h3>
              <p className="text-gray-600">{mudanca.detalhes_infra}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Plano de Rollback</h3>
              <p className="text-gray-600">{mudanca.plano_rollback}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-gray-600">{mudanca.observacoes}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Status de Aprovação</h3>
              <Badge variant="secondary">{mudanca.status_aprovacao}</Badge>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Criado por</h3>
              <p className="text-gray-600">{mudanca.criado_por}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Aprovado por</h3>
              <p className="text-gray-600">{mudanca.aprovado_por || 'Pendente'}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Motivo da Rejeição</h3>
              <p className="text-gray-600">{mudanca.motivo_rejeicao || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
