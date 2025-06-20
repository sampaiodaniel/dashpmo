import { useState, useEffect } from 'react';

export interface RelatorioHistorico {
  id: string;
  tipo: 'asa' | 'visual' | 'consolidado';
  filtro: string;
  valor: string;
  dataGeracao: Date;
  nomeArquivo: string;
}

export function useHistoricoRelatorios() {
  const [historico, setHistorico] = useState<RelatorioHistorico[]>([]);

  useEffect(() => {
    // Carregar histórico do localStorage
    const historicoSalvo = localStorage.getItem('historico-relatorios');
    if (historicoSalvo) {
      try {
        const dados = JSON.parse(historicoSalvo);
        // Converter strings de data de volta para objetos Date
        const dadosComDatas = dados.map((item: any) => ({
          ...item,
          dataGeracao: new Date(item.dataGeracao)
        }));
        setHistorico(dadosComDatas);
      } catch (error) {
        console.error('Erro ao carregar histórico de relatórios:', error);
      }
    }
  }, []);

  const adicionarRelatorio = (relatorio: Omit<RelatorioHistorico, 'id' | 'dataGeracao'>) => {
    const novoRelatorio: RelatorioHistorico = {
      ...relatorio,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dataGeracao: new Date()
    };

    const novoHistorico = [novoRelatorio, ...historico].slice(0, 10); // Manter apenas os 10 mais recentes
    setHistorico(novoHistorico);
    
    // Salvar no localStorage
    localStorage.setItem('historico-relatorios', JSON.stringify(novoHistorico));
  };

  const removerRelatorio = (id: string) => {
    const novoHistorico = historico.filter(r => r.id !== id);
    setHistorico(novoHistorico);
    localStorage.setItem('historico-relatorios', JSON.stringify(novoHistorico));
  };

  const limparHistorico = () => {
    setHistorico([]);
    localStorage.removeItem('historico-relatorios');
  };

  return {
    historico,
    adicionarRelatorio,
    removerRelatorio,
    limparHistorico
  };
} 