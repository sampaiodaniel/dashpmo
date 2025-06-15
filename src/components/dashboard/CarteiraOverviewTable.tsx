
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CARTEIRAS } from '@/types/pmo';
import { BarChart3 } from 'lucide-react';

interface CarteiraData {
  carteira: string;
  projetos: number;
  crs: number;
  baixo: number;
  medio: number;
  alto: number;
  saude: number;
  crAtiva: number;
  crAprovada: number;
  projComEntregas: number;
  status: string;
  visaoResponsavel: string;
}

export function CarteiraOverviewTable() {
  const { data: carteiraData, isLoading } = useQuery({
    queryKey: ['carteira-overview'],
    queryFn: async (): Promise<CarteiraData[]> => {
      // Buscar todos os projetos ativos
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .eq('status_ativo', true);

      if (projetosError) throw projetosError;

      // Buscar status dos projetos
      const { data: status, error: statusError } = await supabase
        .from('status_projeto')
        .select('*')
        .order('data_atualizacao', { ascending: false });

      if (statusError) throw statusError;

      // Buscar mudanças ativas
      const { data: mudancas, error: mudancasError } = await supabase
        .from('mudancas_replanejamento')
        .select('*')
        .in('status_aprovacao', ['Pendente', 'Em Análise', 'Aprovada']);

      if (mudancasError) throw mudancasError;

      // Mapear status por projeto (pegar o mais recente)
      const statusPorProjeto = new Map();
      status?.forEach(s => {
        if (!statusPorProjeto.has(s.projeto_id) || 
            new Date(s.data_atualizacao) > new Date(statusPorProjeto.get(s.projeto_id).data_atualizacao)) {
          statusPorProjeto.set(s.projeto_id, s);
        }
      });

      // Calcular dados por carteira
      return CARTEIRAS.map(carteira => {
        const projetosCarteira = projetos?.filter(p => p.area_responsavel === carteira) || [];
        const mudancasCarteira = mudancas?.filter(m => 
          projetosCarteira.some(p => p.id === m.projeto_id)
        ) || [];

        // Calcular riscos
        let baixo = 0, medio = 0, alto = 0;
        let verde = 0, amarelo = 0, vermelho = 0;
        let projComEntregas = 0;

        projetosCarteira.forEach(projeto => {
          const statusProjeto = statusPorProjeto.get(projeto.id);
          if (statusProjeto) {
            // Contar riscos por prob_x_impact
            if (statusProjeto.prob_x_impact === 'Baixo') baixo++;
            else if (statusProjeto.prob_x_impact === 'Médio') medio++;
            else if (statusProjeto.prob_x_impact === 'Alto') alto++;

            // Contar saúde
            if (statusProjeto.status_visao_gp === 'Verde') verde++;
            else if (statusProjeto.status_visao_gp === 'Amarelo') amarelo++;
            else if (statusProjeto.status_visao_gp === 'Vermelho') vermelho++;

            // Verificar se tem entregas próximas (próximos 15 dias)
            const hoje = new Date();
            const em15Dias = new Date();
            em15Dias.setDate(hoje.getDate() + 15);

            const temEntregaProxima = [
              statusProjeto.data_marco1,
              statusProjeto.data_marco2,
              statusProjeto.data_marco3
            ].some(data => {
              if (!data) return false;
              const dataMarco = new Date(data);
              return dataMarco >= hoje && dataMarco <= em15Dias;
            });

            if (temEntregaProxima) projComEntregas++;
          }
        });

        return {
          carteira,
          projetos: projetosCarteira.length,
          crs: mudancasCarteira.length,
          baixo,
          medio,
          alto,
          saude: verde, // Usando apenas verdes como "saúde boa"
          crAtiva: mudancasCarteira.filter(m => m.status_aprovacao === 'Pendente' || m.status_aprovacao === 'Em Análise').length,
          crAprovada: mudancasCarteira.filter(m => m.status_aprovacao === 'Aprovada').length,
          projComEntregas,
          status: vermelho > 0 ? 'Crítico' : amarelo > 0 ? 'Atenção' : 'Normal',
          visaoResponsavel: vermelho > 0 ? 'Vermelho' : amarelo > 0 ? 'Amarelo' : 'Verde'
        };
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overview das Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando dados das carteiras...</div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Crítico': return 'bg-pmo-danger text-white';
      case 'Atenção': return 'bg-pmo-warning text-white';
      case 'Normal': return 'bg-pmo-success text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getVisaoColor = (visao: string) => {
    switch (visao) {
      case 'Vermelho': return 'bg-pmo-danger text-white';
      case 'Amarelo': return 'bg-pmo-warning text-white';
      case 'Verde': return 'bg-pmo-success text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Overview das Carteiras - Último Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 font-medium w-40">Carteira</th>
                <th className="text-center p-2 font-medium">Projetos</th>
                <th className="text-center p-2 font-medium">CRs</th>
                <th className="text-center p-2 font-medium">Baixo</th>
                <th className="text-center p-2 font-medium">Médio</th>
                <th className="text-center p-2 font-medium">Alto</th>
                <th className="text-center p-2 font-medium">Saúde</th>
                <th className="text-center p-2 font-medium">CR Ativa</th>
                <th className="text-center p-2 font-medium">CR Aprovada</th>
                <th className="text-center p-2 font-medium">Proj com entregas próx 15d</th>
                <th className="text-center p-2 font-medium">Status Carteira</th>
                <th className="text-center p-2 font-medium">Visão Responsável</th>
              </tr>
            </thead>
            <tbody>
              {carteiraData?.map((item) => (
                <tr key={item.carteira} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 font-medium w-40">{item.carteira}</td>
                  <td className="text-center p-2">{item.projetos}</td>
                  <td className="text-center p-2">{item.crs}</td>
                  <td className="text-center p-2">{item.baixo}</td>
                  <td className="text-center p-2">{item.medio}</td>
                  <td className="text-center p-2">{item.alto}</td>
                  <td className="text-center p-2">{item.saude}</td>
                  <td className="text-center p-2">{item.crAtiva}</td>
                  <td className="text-center p-2">{item.crAprovada}</td>
                  <td className="text-center p-2">{item.projComEntregas}</td>
                  <td className="text-center p-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="text-center p-2">
                    <Badge className={getVisaoColor(item.visaoResponsavel)}>
                      {item.visaoResponsavel}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
