
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useProjetos } from './useProjetos';
import { useIncidentes } from './useIncidentes';
import { useCarteiraOverview } from './useCarteiraOverview';
import { useStatusList } from './useStatusList';
import { CARTEIRAS } from '@/types/pmo';

export interface DadosRelatorioASA {
  carteira: string;
  dataRelatorio: string;
  projetos: any[];
  incidentes: any[];
  resumoCarteira: any;
}

export function useRelatorioASA() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: projetos } = useProjetos();
  const { data: incidentes } = useIncidentes();
  const { data: carteiraOverview } = useCarteiraOverview();
  const { data: statusList } = useStatusList();

  const gerarRelatorioCarteira = async (carteira: string): Promise<DadosRelatorioASA | null> => {
    setIsLoading(true);
    
    try {
      console.log(`Gerando relatório para carteira: ${carteira}`);
      
      // Filtrar projetos da carteira
      const projetosCarteira = projetos?.filter(projeto => 
        projeto.area_responsavel === carteira ||
        projeto.carteira_primaria === carteira ||
        projeto.carteira_secundaria === carteira ||
        projeto.carteira_terciaria === carteira
      ) || [];

      // Buscar status aprovados para cada projeto da carteira
      const projetosComStatus = projetosCarteira.map(projeto => {
        const statusAprovados = statusList?.filter(status => 
          status.projeto?.id === projeto.id && status.aprovado
        ) || [];
        
        // Pegar o último status aprovado
        const ultimoStatus = statusAprovados.sort((a, b) => 
          new Date(b.data_aprovacao).getTime() - new Date(a.data_aprovacao).getTime()
        )[0];

        return {
          ...projeto,
          statusAprovados,
          ultimoStatus
        };
      });

      // Filtrar incidentes da carteira
      const incidentesCarteira = incidentes?.filter(incidente => 
        incidente.carteira === carteira
      ) || [];

      // Buscar dados do overview da carteira
      const dadosCarteira = carteiraOverview?.find(item => item.carteira === carteira);

      const dadosRelatorio: DadosRelatorioASA = {
        carteira,
        dataRelatorio: new Date().toLocaleDateString('pt-BR'),
        projetos: projetosComStatus,
        incidentes: incidentesCarteira,
        resumoCarteira: dadosCarteira
      };

      console.log('Dados do relatório:', dadosRelatorio);
      
      toast({
        title: "Sucesso",
        description: `Relatório da carteira ${carteira} gerado com sucesso!`,
      });

      return dadosRelatorio;
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const gerarRelatorioGeral = async (): Promise<DadosRelatorioASA | null> => {
    setIsLoading(true);
    
    try {
      console.log('Gerando relatório geral');
      
      // Adicionar status aprovados para todos os projetos
      const projetosComStatus = projetos?.map(projeto => {
        const statusAprovados = statusList?.filter(status => 
          status.projeto?.id === projeto.id && status.aprovado
        ) || [];
        
        // Pegar o último status aprovado
        const ultimoStatus = statusAprovados.sort((a, b) => 
          new Date(b.data_aprovacao).getTime() - new Date(a.data_aprovacao).getTime()
        )[0];

        return {
          ...projeto,
          statusAprovados,
          ultimoStatus
        };
      }) || [];

      const dadosRelatorio: DadosRelatorioASA = {
        carteira: 'Geral',
        dataRelatorio: new Date().toLocaleDateString('pt-BR'),
        projetos: projetosComStatus,
        incidentes: incidentes || [],
        resumoCarteira: carteiraOverview
      };

      console.log('Dados do relatório geral:', dadosRelatorio);
      
      toast({
        title: "Sucesso",
        description: "Relatório geral gerado com sucesso!",
      });

      return dadosRelatorio;
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    gerarRelatorioCarteira,
    gerarRelatorioGeral,
    isLoading,
    carteiras: CARTEIRAS
  };
}
