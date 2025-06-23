
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DadosRelatorioConsolidado {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export function useRelatorioConsolidado() {
  const [isLoading, setIsLoading] = useState(false);

  // Buscar carteiras disponíveis
  const { data: carteiras = [] } = useQuery({
    queryKey: ['carteiras-relatorio-consolidado'],
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
    queryKey: ['responsaveis-asa-relatorio-consolidado'],
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

  const gerarRelatorioCarteira = async (carteira: string): Promise<DadosRelatorioConsolidado | null> => {
    setIsLoading(true);
    try {
      console.log('🔍 Gerando relatório consolidado para carteira:', carteira);

      // Buscar projetos da carteira
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .eq('carteira_primaria', carteira)
        .eq('status_ativo', true)
        .order('nome_projeto', { ascending: true });

      if (projetosError) throw projetosError;

      if (!projetos || projetos.length === 0) {
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

      // Buscar incidentes da carteira
      const { data: incidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select('*')
        .eq('carteira', carteira)
        .order('data_registro', { ascending: false });

      if (incidentesError) throw incidentesError;

      const dados: DadosRelatorioConsolidado = {
        carteira,
        projetos,
        statusProjetos: statusProjetos || [],
        incidentes: incidentes || [],
        dataGeracao: new Date()
      };

      console.log('✅ Relatório consolidado gerado:', dados);
      return dados;

    } catch (error) {
      console.error('❌ Erro ao gerar relatório consolidado:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const gerarRelatorioResponsavel = async (responsavel: string): Promise<DadosRelatorioConsolidado | null> => {
    setIsLoading(true);
    try {
      console.log('🔍 Gerando relatório consolidado para responsável:', responsavel);

      // Buscar projetos do responsável
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .or(`responsavel_asa.eq.${responsavel},responsavel_cwi.eq.${responsavel},gp_responsavel_cwi.eq.${responsavel}`)
        .eq('status_ativo', true)
        .order('nome_projeto', { ascending: true });

      if (projetosError) throw projetosError;

      if (!projetos || projetos.length === 0) {
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

      // Buscar incidentes das carteiras relacionadas
      const { data: incidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select('*')
        .in('carteira', carteiras)
        .order('data_registro', { ascending: false });

      if (incidentesError) throw incidentesError;

      const dados: DadosRelatorioConsolidado = {
        responsavel,
        projetos,
        statusProjetos: statusProjetos || [],
        incidentes: incidentes || [],
        dataGeracao: new Date()
      };

      console.log('✅ Relatório consolidado gerado:', dados);
      return dados;

    } catch (error) {
      console.error('❌ Erro ao gerar relatório consolidado:', error);
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
