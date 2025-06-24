import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RelatorioSalvo } from '@/integrations/supabase/types';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface FiltrosRelatorio {
  tipo?: 'asa' | 'visual' | 'consolidado' | 'todos';
  publico?: boolean;
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
}

export function useRelatoriosSalvos() {
  const [relatorios, setRelatorios] = useState<RelatorioSalvo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    tipo: 'todos'
  });
  
  const { toast } = useToast();

  // Carregar relatórios com paginação e filtros
  const carregarRelatorios = async (page: number = 1, filtrosPagina?: FiltrosRelatorio) => {
    try {
      setIsLoading(true);
      
      const filtrosAtivos = filtrosPagina || filtros;
      const offset = (page - 1) * pagination.itemsPerPage;
      
      let query = supabase
        .from('relatorios_salvos')
        .select('*', { count: 'exact' })
        .eq('ativo', true)
        .order('data_geracao', { ascending: false })
        .range(offset, offset + pagination.itemsPerPage - 1);

      // Aplicar filtros
      if (filtrosAtivos.tipo && filtrosAtivos.tipo !== 'todos') {
        query = query.eq('tipo_relatorio', filtrosAtivos.tipo);
      }

      if (filtrosAtivos.publico !== undefined) {
        query = query.eq('publico', filtrosAtivos.publico);
      }

      if (filtrosAtivos.dataInicio) {
        query = query.gte('data_geracao', filtrosAtivos.dataInicio);
      }

      if (filtrosAtivos.dataFim) {
        query = query.lte('data_geracao', filtrosAtivos.dataFim);
      }

      if (filtrosAtivos.busca) {
        query = query.or(`titulo.ilike.%${filtrosAtivos.busca}%,descricao.ilike.%${filtrosAtivos.busca}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Erro ao carregar relatórios:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar relatórios salvos",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Relatórios carregados:', data?.length || 0);
      setRelatorios(data || []);
      
      // Atualizar informações de paginação
      const totalItems = count || 0;
      const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
      
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages,
        totalItems
      }));

    } catch (error) {
      console.error('❌ Erro inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar novo relatório
  const salvarRelatorio = async (relatorio: Omit<RelatorioSalvo, 'id' | 'criado_em' | 'atualizado_em' | 'visualizacoes'>) => {
    try {
      setCarregando(true);
      
      const { data, error } = await supabase
        .from('relatorios_salvos')
        .insert(relatorio)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar relatório:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar relatório: " + error.message,
          variant: "destructive",
        });
        return null;
      }

      console.log('✅ Relatório salvo:', data);
      
      // Recarregar lista se estivermos na primeira página
      if (pagination.currentPage === 1) {
        await carregarRelatorios(1);
      }
      
      toast({
        title: "Sucesso",
        description: "Relatório salvo com sucesso!",
      });

      return data;

    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar relatório",
        variant: "destructive",
      });
      return null;
    } finally {
      setCarregando(false);
    }
  };

  // Atualizar relatório
  const atualizarRelatorio = async (id: number, dados: Partial<RelatorioSalvo>) => {
    try {
      setCarregando(true);
      
      const { data, error } = await supabase
        .from('relatorios_salvos')
        .update(dados)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar relatório:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar relatório: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Relatório atualizado:', data);
      
      // Atualizar na lista local
      setRelatorios(prev => 
        prev.map(r => r.id === id ? data : r)
      );
      
      toast({
        title: "Sucesso",
        description: "Relatório atualizado com sucesso!",
      });

    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar relatório",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  // Deletar relatório (marcar como inativo)
  const deletarRelatorio = async (id: number) => {
    try {
      setCarregando(true);
      
      const { error } = await supabase
        .from('relatorios_salvos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao deletar relatório:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar relatório: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Relatório deletado (marcado como inativo)');
      
      // Remover da lista local
      setRelatorios(prev => prev.filter(r => r.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Relatório removido com sucesso!",
      });

    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao deletar relatório",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  // Incrementar visualizações
  const incrementarVisualizacoes = async (id: number) => {
    try {
      const { error } = await supabase
        .from('relatorios_salvos')
        .update({ 
          visualizacoes: supabase.sql`visualizacoes + 1` 
        })
        .eq('id', id);

      if (error) {
        console.error('⚠️ Erro ao incrementar visualizações:', error);
      }
    } catch (error) {
      console.error('⚠️ Erro inesperado ao incrementar visualizações:', error);
    }
  };

  // Gerar link compartilhável único
  const gerarLinkCompartilhavel = (relatorioId: number): string => {
    const baseUrl = window.location.origin;
    const token = btoa(`${relatorioId}-${Date.now()}`);
    return `${baseUrl}/relatorio-compartilhado/${token}`;
  };

  // Buscar relatório por token de compartilhamento
  const buscarPorToken = async (token: string): Promise<RelatorioSalvo | null> => {
    try {
      // Decodificar token para extrair ID
      const decoded = atob(token);
      const relatorioId = parseInt(decoded.split('-')[0]);
      
      const { data, error } = await supabase
        .from('relatorios_salvos')
        .select('*')
        .eq('id', relatorioId)
        .eq('ativo', true)
        .single();

      if (error || !data) {
        return null;
      }

      // Incrementar visualizações
      await incrementarVisualizacoes(relatorioId);

      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar relatório por token:', error);
      return null;
    }
  };

  // Navegar para página
  const irParaPagina = (page: number) => {
    carregarRelatorios(page);
  };

  // Aplicar filtros
  const aplicarFiltros = (novosFiltros: FiltrosRelatorio) => {
    setFiltros(novosFiltros);
    carregarRelatorios(1, novosFiltros);
  };

  // Limpar filtros
  const limparFiltros = () => {
    const filtrosLimpos = { tipo: 'todos' as const };
    setFiltros(filtrosLimpos);
    carregarRelatorios(1, filtrosLimpos);
  };

  // Carregar ao montar o componente
  useEffect(() => {
    carregarRelatorios();
  }, []);

  return {
    relatorios,
    isLoading,
    carregando,
    pagination,
    filtros,
    salvarRelatorio,
    atualizarRelatorio,
    deletarRelatorio,
    incrementarVisualizacoes,
    gerarLinkCompartilhavel,
    buscarPorToken,
    irParaPagina,
    aplicarFiltros,
    limparFiltros,
    recarregar: () => carregarRelatorios(pagination.currentPage)
  };
} 