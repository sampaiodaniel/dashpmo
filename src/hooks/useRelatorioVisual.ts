
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export function useRelatorioVisual() {
  const [isLoading, setIsLoading] = useState(false);

  // Buscar carteiras disponíveis
  const { data: carteiras = [] } = useQuery({
    queryKey: ['carteiras-relatorio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projetos')
        .select('carteira_primaria')
        .not('carteira_primaria', 'is', null);

      if (error) throw error;

      const carteirasUnicas = [...new Set(data.map(p => p.carteira_primaria))];
      return carteirasUnicas.sort();
    },
  });

  // Buscar responsáveis ASA do painel de administração
  const { data: responsaveis = [] } = useQuery({
    queryKey: ['responsaveis-asa-relatorio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('responsaveis_asa')
        .select('nome')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;

      return data.map(r => r.nome);
    },
  });

  const gerarRelatorioCarteira = async (carteira: string): Promise<DadosRelatorioVisual | null> => {
    setIsLoading(true);
    try {
      console.log('🔍 Gerando relatório visual para carteira:', carteira);

      // Buscar projetos da carteira
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .eq('carteira_primaria', carteira)
        .eq('status_ativo', true)
        .order('nome_projeto', { ascending: true });

      if (projetosError) throw projetosError;

      if (!projetos || projetos.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum projeto encontrado para esta carteira",
          variant: "destructive",
        });
        return null;
      }

      const projetoIds = projetos.map(p => p.id);

      // Buscar status mais recentes dos projetos
      const { data: statusProjetos, error: statusError } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos(id, nome_projeto)
        `)
        .in('projeto_id', projetoIds)
        .order('data_criacao', { ascending: false });

      if (statusError) throw statusError;

      // Buscar entregas para cada status apenas da tabela entregas_status (não duplicar com campos legados)
      if (statusProjetos && statusProjetos.length > 0) {
        const statusIds = statusProjetos.map(s => s.id);
        
        const { data: todasEntregas, error: entregasError } = await supabase
          .from('entregas_status')
          .select('*')
          .in('status_id', statusIds)
          .order('ordem', { ascending: true });

        if (entregasError) {
          console.error('Erro ao buscar entregas:', entregasError);
        } else {
          // Anexar entregas a cada status
          statusProjetos.forEach((status: any) => {
            const entregasDoStatus = todasEntregas?.filter(e => e.status_id === status.id) || [];
            
            // Só usar entregas da tabela nova se existirem, senão usar campos legados
            if (entregasDoStatus.length > 0) {
              status.entregasExtras = entregasDoStatus;
            } else {
              // Migrar campos legados apenas se não há entregas na tabela nova
              const entregasLegadas = [];
              
              if (status.entrega1) {
                entregasLegadas.push({
                  id: `legado-${status.id}-1`,
                  status_id: status.id,
                  ordem: 1,
                  nome_entrega: status.entrega1,
                  data_entrega: status.data_marco1,
                  entregaveis: status.entregaveis1,
                  status_entrega_id: status.status_entrega1_id
                });
              }

              if (status.entrega2) {
                entregasLegadas.push({
                  id: `legado-${status.id}-2`,
                  status_id: status.id,
                  ordem: 2,
                  nome_entrega: status.entrega2,
                  data_entrega: status.data_marco2,
                  entregaveis: status.entregaveis2,
                  status_entrega_id: status.status_entrega2_id
                });
              }

              if (status.entrega3) {
                entregasLegadas.push({
                  id: `legado-${status.id}-3`,
                  status_id: status.id,
                  ordem: 3,
                  nome_entrega: status.entrega3,
                  data_entrega: status.data_marco3,
                  entregaveis: status.entregaveis3,
                  status_entrega_id: status.status_entrega3_id
                });
              }

              status.entregasExtras = entregasLegadas;
            }
          });
        }
      }

      // Buscar incidentes da carteira
      const { data: incidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select('*')
        .eq('carteira', carteira)
        .order('data_registro', { ascending: false });

      if (incidentesError) throw incidentesError;

      const dados: DadosRelatorioVisual = {
        carteira,
        projetos,
        statusProjetos: statusProjetos || [],
        incidentes: incidentes || [],
        dataGeracao: new Date()
      };

      console.log('✅ Relatório visual gerado:', dados);
      return dados;

    } catch (error) {
      console.error('❌ Erro ao gerar relatório visual:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório visual",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const gerarRelatorioResponsavel = async (responsavel: string): Promise<DadosRelatorioVisual | null> => {
    setIsLoading(true);
    try {
      console.log('🔍 Gerando relatório visual para responsável:', responsavel);

      // Buscar projetos do responsável
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .or(`responsavel_asa.eq.${responsavel},responsavel_cwi.eq.${responsavel},gp_responsavel_cwi.eq.${responsavel}`)
        .eq('status_ativo', true)
        .order('nome_projeto', { ascending: true });

      if (projetosError) throw projetosError;

      if (!projetos || projetos.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum projeto encontrado para este responsável",
          variant: "destructive",
        });
        return null;
      }

      const projetoIds = projetos.map(p => p.id);
      const carteiras = [...new Set(projetos.map(p => p.carteira_primaria).filter(Boolean))];

      // Buscar status mais recentes dos projetos
      const { data: statusProjetos, error: statusError } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos(id, nome_projeto)
        `)
        .in('projeto_id', projetoIds)
        .order('data_criacao', { ascending: false });

      if (statusError) throw statusError;

      // Buscar entregas para cada status apenas da tabela entregas_status (não duplicar com campos legados)
      if (statusProjetos && statusProjetos.length > 0) {
        const statusIds = statusProjetos.map(s => s.id);
        
        const { data: todasEntregas, error: entregasError } = await supabase
          .from('entregas_status')
          .select('*')
          .in('status_id', statusIds)
          .order('ordem', { ascending: true });

        if (entregasError) {
          console.error('Erro ao buscar entregas:', entregasError);
        } else {
          // Anexar entregas a cada status
          statusProjetos.forEach((status: any) => {
            const entregasDoStatus = todasEntregas?.filter(e => e.status_id === status.id) || [];
            
            // Só usar entregas da tabela nova se existirem, senão usar campos legados
            if (entregasDoStatus.length > 0) {
              status.entregasExtras = entregasDoStatus;
            } else {
              // Migrar campos legados apenas se não há entregas na tabela nova
              const entregasLegadas = [];
              
              if (status.entrega1) {
                entregasLegadas.push({
                  id: `legado-${status.id}-1`,
                  status_id: status.id,
                  ordem: 1,
                  nome_entrega: status.entrega1,
                  data_entrega: status.data_marco1,
                  entregaveis: status.entregaveis1,
                  status_entrega_id: status.status_entrega1_id
                });
              }

              if (status.entrega2) {
                entregasLegadas.push({
                  id: `legado-${status.id}-2`,
                  status_id: status.id,
                  ordem: 2,
                  nome_entrega: status.entrega2,
                  data_entrega: status.data_marco2,
                  entregaveis: status.entregaveis2,
                  status_entrega_id: status.status_entrega2_id
                });
              }

              if (status.entrega3) {
                entregasLegadas.push({
                  id: `legado-${status.id}-3`,
                  status_id: status.id,
                  ordem: 3,
                  nome_entrega: status.entrega3,
                  data_entrega: status.data_marco3,
                  entregaveis: status.entregaveis3,
                  status_entrega_id: status.status_entrega3_id
                });
              }

              status.entregasExtras = entregasLegadas;
            }
          });
        }
      }

      // Buscar incidentes das carteiras relacionadas
      const { data: incidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select('*')
        .in('carteira', carteiras)
        .order('data_registro', { ascending: false });

      if (incidentesError) throw incidentesError;

      const dados: DadosRelatorioVisual = {
        responsavel,
        projetos,
        statusProjetos: statusProjetos || [],
        incidentes: incidentes || [],
        dataGeracao: new Date()
      };

      console.log('✅ Relatório visual gerado:', dados);
      return dados;

    } catch (error) {
      console.error('❌ Erro ao gerar relatório visual:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório visual",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    carteiras,
    responsaveis,
    gerarRelatorioCarteira,
    gerarRelatorioResponsavel,
    isLoading,
  };
}
