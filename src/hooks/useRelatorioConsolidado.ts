
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  const { data: carteiras } = useQuery({
    queryKey: ['carteiras-consolidado'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projetos')
        .select('carteira_primaria')
        .not('carteira_primaria', 'is', null);
      
      if (error) throw error;
      
      const carteirasUnicas = [...new Set(data.map(p => p.carteira_primaria))].filter(Boolean);
      return carteirasUnicas.sort();
    }
  });

  const { data: responsaveis } = useQuery({
    queryKey: ['responsaveis-consolidado'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projetos')
        .select('responsavel_asa')
        .not('responsavel_asa', 'is', null);
      
      if (error) throw error;
      
      const responsaveisUnicos = [...new Set(data.map(p => p.responsavel_asa))].filter(Boolean);
      return responsaveisUnicos.sort();
    }
  });

  const gerarRelatorioCarteira = async (carteira: string): Promise<DadosRelatorioConsolidado | null> => {
    setIsLoading(true);
    
    try {
      console.log('🔄 Gerando relatório consolidado para carteira:', carteira);

      // Buscar projetos da carteira
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .eq('carteira_primaria', carteira)
        .eq('status_ativo', true);

      if (projetosError) {
        console.error('Erro ao buscar projetos:', projetosError);
        throw projetosError;
      }

      if (!projetos || projetos.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum projeto encontrado para esta carteira",
          variant: "destructive",
        });
        return null;
      }

      // Buscar status dos projetos
      const projetosIds = projetos.map(p => p.id);
      const { data: statusProjetos, error: statusError } = await supabase
        .from('status_projeto')
        .select('*')
        .in('projeto_id', projetosIds)
        .order('data_criacao', { ascending: false });

      if (statusError) {
        console.error('Erro ao buscar status:', statusError);
        throw statusError;
      }

      // Buscar incidentes da carteira
      const { data: incidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select('*')
        .eq('carteira', carteira)
        .order('data_registro', { ascending: false });

      if (incidentesError) {
        console.error('Erro ao buscar incidentes:', incidentesError);
        throw incidentesError;
      }

      const dados: DadosRelatorioConsolidado = {
        carteira,
        projetos: projetos || [],
        statusProjetos: statusProjetos || [],
        incidentes: incidentes || [],
        dataGeracao: new Date()
      };

      console.log('✅ Relatório consolidado gerado:', dados);

      toast({
        title: "Sucesso",
        description: "Relatório consolidado gerado com sucesso!",
      });

      return dados;

    } catch (error) {
      console.error('Erro ao gerar relatório consolidado:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório consolidado",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const gerarRelatorioResponsavel = async (responsavel: string): Promise<DadosRelatorioConsolidado | null> => {
    setIsLoading(true);
    
    try {
      console.log('🔄 Gerando relatório consolidado para responsável:', responsavel);

      // Buscar projetos do responsável
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .eq('responsavel_asa', responsavel)
        .eq('status_ativo', true);

      if (projetosError) {
        console.error('Erro ao buscar projetos:', projetosError);
        throw projetosError;
      }

      if (!projetos || projetos.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum projeto encontrado para este responsável",
          variant: "destructive",
        });
        return null;
      }

      // Buscar status dos projetos
      const projetosIds = projetos.map(p => p.id);
      const { data: statusProjetos, error: statusError } = await supabase
        .from('status_projeto')
        .select('*')
        .in('projeto_id', projetosIds)
        .order('data_criacao', { ascending: false });

      if (statusError) {
        console.error('Erro ao buscar status:', statusError);
        throw statusError;
      }

      // Buscar incidentes das carteiras dos projetos do responsável
      const carteiras = [...new Set(projetos.map(p => p.carteira_primaria))].filter(Boolean);
      const { data: incidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select('*')
        .in('carteira', carteiras)
        .order('data_registro', { ascending: false });

      if (incidentesError) {
        console.error('Erro ao buscar incidentes:', incidentesError);
        throw incidentesError;
      }

      const dados: DadosRelatorioConsolidado = {
        responsavel,
        projetos: projetos || [],
        statusProjetos: statusProjetos || [],
        incidentes: incidentes || [],
        dataGeracao: new Date()
      };

      console.log('✅ Relatório consolidado gerado:', dados);

      toast({
        title: "Sucesso",
        description: "Relatório consolidado gerado com sucesso!",
      });

      return dados;

    } catch (error) {
      console.error('Erro ao gerar relatório consolidado:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório consolidado",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    carteiras: carteiras || [],
    responsaveis: responsaveis || [],
    gerarRelatorioCarteira,
    gerarRelatorioResponsavel,
    isLoading
  };
}
