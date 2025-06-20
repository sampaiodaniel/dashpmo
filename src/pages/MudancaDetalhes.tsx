import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatarData } from '@/utils/dateFormatting';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface Mudanca {
  id: number;
  projeto_id: number;
  tipo_mudanca: string;
  solicitante: string;
  descricao: string;
  justificativa_negocio: string;
  impacto_prazo_dias: number;
  data_solicitacao: string;
  status_aprovacao: string;
  responsavel_aprovacao: string;
  data_aprovacao: string;
  observacoes: string;
  criado_por: string;
  data_criacao: string;
}

export default function MudancaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, isAdmin } = useAuth();
  
  useScrollToTop();
  const { toast } = useToast();
  const [mudanca, setMudanca] = useState<Mudanca | null>(null);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['mudanca-detalhes', id],
    queryFn: async () => {
      console.log('Fazendo consulta para mudança com ID:', id);
      
      if (!id) {
        throw new Error('ID da mudança não especificado');
      }

      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) {
        console.error('Erro ao buscar detalhes da mudança:', error);
        throw new Error('Erro ao carregar detalhes da mudança');
      }

      setMudanca(data as Mudanca);
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
      .from('mudancas_replanejamento')
      .update({ 
        status_aprovacao: 'Aprovada', 
        responsavel_aprovacao: usuario?.nome,
        data_aprovacao: new Date().toISOString().split('T')[0]
      })
      .eq('id', parseInt(id));

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
      .from('mudancas_replanejamento')
      .update({ 
        status_aprovacao: 'Rejeitada', 
        responsavel_aprovacao: usuario?.nome, 
        observacoes: motivo,
        data_aprovacao: new Date().toISOString().split('T')[0]
      })
      .eq('id', parseInt(id));

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
            <CardTitle>{mudanca.tipo_mudanca}</CardTitle>
            <CardDescription>
              <div className="flex items-center space-x-2">
                <span>Data de Solicitação:</span>
                <Calendar className="h-4 w-4" />
                <span>
                  {formatarData(mudanca.data_solicitacao)}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Solicitante</h3>
              <p className="text-gray-600">{mudanca.solicitante}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Descrição</h3>
              <p className="text-gray-600">{mudanca.descricao}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Justificativa de Negócio</h3>
              <p className="text-gray-600">{mudanca.justificativa_negocio}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Impacto no Prazo (dias)</h3>
              <p className="text-gray-600">{mudanca.impacto_prazo_dias}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Status de Aprovação</h3>
              <Badge variant="secondary">{mudanca.status_aprovacao}</Badge>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Responsável pela Aprovação</h3>
              <p className="text-gray-600">{mudanca.responsavel_aprovacao || 'Pendente'}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Data da Aprovação</h3>
              <p className="text-gray-600">
                {mudanca.data_aprovacao 
                  ? formatarData(mudanca.data_aprovacao)
                  : 'Pendente'
                }
              </p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-gray-600">{mudanca.observacoes || 'N/A'}</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Criado por</h3>
              <p className="text-gray-600">{mudanca.criado_por}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
