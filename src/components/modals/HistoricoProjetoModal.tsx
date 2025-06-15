
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { getStatusColor, getStatusGeralColor, StatusProjeto } from '@/types/pmo';
import { Calendar, User, CheckCircle, XCircle } from 'lucide-react';

interface HistoricoProjetoModalProps {
  projetoId: number;
  nomeProjeto: string;
  aberto: boolean;
  onFechar: () => void;
}

export function HistoricoProjetoModal({ projetoId, nomeProjeto, aberto, onFechar }: HistoricoProjetoModalProps) {
  const { data: historico, isLoading } = useQuery({
    queryKey: ['historico-projeto', projetoId],
    queryFn: async (): Promise<StatusProjeto[]> => {
      const { data, error } = await supabase
        .from('status_projeto')
        .select('*')
        .eq('projeto_id', projetoId)
        .order('data_atualizacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar histórico:', error);
        throw error;
      }

      return data?.map(status => ({
        ...status,
        data_atualizacao: new Date(status.data_atualizacao),
        data_criacao: new Date(status.data_criacao),
        data_marco1: status.data_marco1 ? new Date(status.data_marco1) : undefined,
        data_marco2: status.data_marco2 ? new Date(status.data_marco2) : undefined,
        data_marco3: status.data_marco3 ? new Date(status.data_marco3) : undefined,
        data_aprovacao: status.data_aprovacao ? new Date(status.data_aprovacao) : undefined
      })) || [];
    },
    enabled: aberto
  });

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Status - {nomeProjeto}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="text-center py-8 text-pmo-gray">
            Carregando histórico...
          </div>
        ) : historico && historico.length > 0 ? (
          <div className="space-y-4">
            {historico.map((status, index) => (
              <div key={status.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      #{historico.length - index}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-pmo-gray">
                      <Calendar className="h-4 w-4" />
                      {status.data_atualizacao.toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-pmo-gray">
                      <User className="h-4 w-4" />
                      {status.criado_por}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.aprovado ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {status.aprovado ? 'Aprovado' : 'Não aprovado'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-pmo-gray">Status Geral:</span>
                    <div className="mt-1">
                      <Badge className={getStatusGeralColor(status.status_geral)}>
                        {status.status_geral}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-pmo-gray">Visão GP:</span>
                    <div className="mt-1">
                      <Badge className={getStatusColor(status.status_visao_gp)}>
                        {status.status_visao_gp}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-pmo-gray">Riscos:</span>
                    <div className="mt-1 flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        P: {status.probabilidade_riscos}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        I: {status.impacto_riscos}
                      </Badge>
                    </div>
                  </div>
                </div>

                {status.realizado_semana_atual && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-pmo-gray">Realizado na Semana:</span>
                    <p className="text-sm text-gray-700 mt-1">{status.realizado_semana_atual}</p>
                  </div>
                )}

                {status.bloqueios_atuais && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-pmo-gray">Bloqueios:</span>
                    <p className="text-sm text-gray-700 mt-1">{status.bloqueios_atuais}</p>
                  </div>
                )}

                {status.observacoes_pontos_atencao && (
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Observações:</span>
                    <p className="text-sm text-gray-700 mt-1">{status.observacoes_pontos_atencao}</p>
                  </div>
                )}

                {status.aprovado && status.aprovado_por && (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-pmo-gray">
                    Aprovado por {status.aprovado_por} em {status.data_aprovacao?.toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-pmo-gray">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum status encontrado para este projeto.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
