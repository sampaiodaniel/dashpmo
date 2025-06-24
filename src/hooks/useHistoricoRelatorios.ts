import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  const { usuario } = useAuth();

  // Buscar histórico do banco ao logar
  useEffect(() => {
    const fetchHistorico = async () => {
      if (!usuario?.id) return;
      const { data, error } = await supabase
        .from('relatorios_usuario')
        .select('*')
        .eq('usuario_id', usuario.id)
        .order('criado_em', { ascending: false });
      if (error) {
        console.error('Erro ao buscar histórico de relatórios:', error);
        return;
      }
      const historicoDb = (data || []).map((item: any) => ({
        id: item.id,
        tipo: item.tipo,
        filtro: item.dados?.filtro || '',
        valor: item.dados?.valor || '',
        dataGeracao: item.criado_em ? new Date(item.criado_em) : new Date(),
        nomeArquivo: item.dados?.nomeArquivo || ''
      }));
      setHistorico(historicoDb);
    };
    fetchHistorico();
  }, [usuario?.id]);

  // Adicionar relatório ao histórico (e ao banco)
  const adicionarRelatorio = async (relatorio: Omit<RelatorioHistorico, 'id' | 'dataGeracao'>) => {
    if (!usuario?.id) return;
    const novoRelatorio = {
      usuario_id: usuario.id,
      tipo: relatorio.tipo,
      titulo: relatorio.nomeArquivo,
      dados: {
        filtro: relatorio.filtro,
        valor: relatorio.valor,
        nomeArquivo: relatorio.nomeArquivo
      },
      criado_em: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('relatorios_usuario')
      .insert([novoRelatorio])
      .select();
    if (error) {
      console.error('Erro ao adicionar relatório:', error);
      return;
    }
    if (data && data[0]) {
      setHistorico(prev => [{
        id: data[0].id,
        tipo: data[0].tipo,
        filtro: data[0].dados?.filtro || '',
        valor: data[0].dados?.valor || '',
        dataGeracao: data[0].criado_em ? new Date(data[0].criado_em) : new Date(),
        nomeArquivo: data[0].dados?.nomeArquivo || ''
      }, ...prev]);
    }
  };

  // Remover relatório do histórico (e do banco)
  const removerRelatorio = async (id: string) => {
    const { error } = await supabase
      .from('relatorios_usuario')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Erro ao remover relatório:', error);
      return;
    }
    setHistorico(prev => prev.filter(r => r.id !== id));
  };

  // Limpar histórico do usuário (deleta todos do banco)
  const limparHistorico = async () => {
    if (!usuario?.id) return;
    const { error } = await supabase
      .from('relatorios_usuario')
      .delete()
      .eq('usuario_id', usuario.id);
    if (error) {
      console.error('Erro ao limpar histórico:', error);
      return;
    }
    setHistorico([]);
  };

  return {
    historico,
    adicionarRelatorio,
    removerRelatorio,
    limparHistorico
  };
} 