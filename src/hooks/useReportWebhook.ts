import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import type { Usuario } from '@/hooks/useAuth';

export interface RelatorioCompartilhavel {
  id: string;
  titulo: string;
  tipo: 'visual' | 'asa' | 'consolidado';
  dados: any;
  configuracao: {
    expiraEm: number; // dias
    protegidoPorSenha?: boolean;
    senha?: string;
  };
  metadados: {
    carteira?: string;
    responsavel?: string;
    dataGeracao: string;
    tamanhoMB: number;
  };
  url: string;
  criadoEm: string;
  criadoPor: string;
  acessos: number;
  ultimoAcesso?: string;
}

export interface CriarRelatorioCompartilhavelParams {
  tipo: 'visual' | 'asa' | 'consolidado';
  titulo: string;
  dados: any;
  carteira?: string;
  responsavel?: string;
  expiraEm?: number; // dias, padrão 30
  protegidoPorSenha?: boolean;
  senha?: string;
}

export function useReportWebhook() {
  const [loading, setLoading] = useState(false);
  const [relatoriosCompartilhados, setRelatoriosCompartilhados] = useState<RelatorioCompartilhavel[]>([]);

  // Log para depuração do contexto
  console.log('[useReportWebhook] hook instanciado');

  // Gerar ID seguro para URL
  const gerarIdSeguro = (): string => uuidv4();

  // Calcular tamanho em MB dos dados
  const calcularTamanho = (dados: any): number => {
    try {
      if (!dados) return 0;
      const jsonString = JSON.stringify(dados);
      const bytes = new Blob([jsonString]).size;
      return Math.round((bytes / (1024 * 1024)) * 100) / 100;
    } catch (error) {
      console.warn('Erro ao calcular tamanho dos dados:', error);
      return 0;
    }
  };

  // Criar relatório compartilhável
  const criarRelatorioCompartilhavel = async (
    params: CriarRelatorioCompartilhavelParams,
    userUuid: string,
    usuario: Usuario | null
  ): Promise<RelatorioCompartilhavel | null> => {
    setLoading(true);
    try {
      console.log('[useReportWebhook] criarRelatorioCompartilhavel | userUuid:', userUuid, '| usuario:', usuario);
      if (!userUuid) throw new Error('Usuário não autenticado. UUID não fornecido.');
      if (!params.titulo?.trim()) throw new Error('Título é obrigatório');
      if (!params.dados) throw new Error('Dados do relatório são obrigatórios');

      const id = gerarIdSeguro();
      const agora = new Date();
      const dataExpiracao = new Date();
      dataExpiracao.setDate(agora.getDate() + (params.expiraEm || 30));

      const relatorio: RelatorioCompartilhavel = {
        id,
        titulo: params.titulo,
        tipo: params.tipo,
        dados: params.dados,
        configuracao: {
          expiraEm: params.expiraEm || 30,
          protegidoPorSenha: params.protegidoPorSenha || false,
          senha: params.senha
        },
        metadados: {
          carteira: params.carteira,
          responsavel: params.responsavel,
          dataGeracao: agora.toISOString(),
          tamanhoMB: calcularTamanho(params.dados)
        },
        url: `${window.location.origin}/relatorio-compartilhado/${id}`,
        criadoEm: agora.toISOString(),
        criadoPor: usuario?.nome || usuario?.email || userUuid,
        acessos: 0
      };

      // Persistir no Supabase
      const { error } = await supabase.from('relatorios_usuario').insert([
        {
          id,
          usuario_id: userUuid,
          tipo: params.tipo,
          titulo: params.titulo,
          dados: {
            ...params.dados,
            carteira: params.carteira,
            responsavel: params.responsavel,
            configuracao: relatorio.configuracao,
            metadados: relatorio.metadados
          },
          criado_em: agora.toISOString(),
          expira_em: dataExpiracao.toISOString(),
          protegido_por_senha: params.protegidoPorSenha || false,
          senha_hash: params.senha || null,
          acessos: 0,
          compartilhado: true,
          compartilhado_com: [],
          descricao: params.titulo
        }
      ]);
      if (error) throw new Error('Erro ao salvar relatório no banco: ' + error.message);

      setRelatoriosCompartilhados(prev => [relatorio, ...prev]);
      toast({
        title: "Relatório compartilhável criado!",
        description: `Link gerado com sucesso. Expira em ${params.expiraEm || 30} dias.`,
      });
      return relatorio;
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro desconhecido ao criar relatório compartilhável';
      toast({
        title: "Erro",
        description: mensagemErro,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Listar relatórios compartilhados do usuário
  const listarRelatoriosCompartilhados = async (userUuid: string): Promise<void> => {
    if (!userUuid) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('relatorios_usuario')
        .select('*')
        .eq('usuario_id', userUuid)
        .eq('compartilhado', true)
        .order('criado_em', { ascending: false });
      if (error) throw new Error('Erro ao buscar relatórios: ' + error.message);
      const relatorios = (data || []).map((item: Database['public']['Tables']['relatorios_usuario']['Row']) => {
        let configuracao: RelatorioCompartilhavel['configuracao'] = { expiraEm: 30 };
        let metadados: RelatorioCompartilhavel['metadados'] = { dataGeracao: '', tamanhoMB: 0 };
        if (item.dados && typeof item.dados === 'object' && !Array.isArray(item.dados)) {
          if ('configuracao' in item.dados && typeof item.dados.configuracao === 'object' && !Array.isArray(item.dados.configuracao)) {
            const conf = item.dados.configuracao;
            configuracao = {
              expiraEm: typeof conf.expiraEm === 'number' ? conf.expiraEm : 30,
              protegidoPorSenha: typeof conf.protegidoPorSenha === 'boolean' ? conf.protegidoPorSenha : false,
              senha: typeof conf.senha === 'string' ? conf.senha : undefined
            };
          }
          if ('metadados' in item.dados && typeof item.dados.metadados === 'object' && !Array.isArray(item.dados.metadados)) {
            const meta = item.dados.metadados;
            metadados = {
              carteira: typeof meta.carteira === 'string' ? meta.carteira : undefined,
              responsavel: typeof meta.responsavel === 'string' ? meta.responsavel : undefined,
              dataGeracao: typeof meta.dataGeracao === 'string' ? meta.dataGeracao : '',
              tamanhoMB: typeof meta.tamanhoMB === 'number' ? meta.tamanhoMB : 0
            };
          }
        }
        return {
          id: item.id,
          titulo: item.titulo,
          tipo: (['visual','asa','consolidado'].includes(item.tipo) ? item.tipo : 'visual') as 'visual'|'asa'|'consolidado',
          dados: item.dados,
          configuracao,
          metadados,
          url: `${window.location.origin}/relatorio-compartilhado/${item.id}`,
          criadoEm: item.criado_em,
          criadoPor: item.descricao || 'N/A',
          acessos: item.acessos || 0,
          ultimoAcesso: item.ultimo_acesso
        } as RelatorioCompartilhavel;
      });
      setRelatoriosCompartilhados(relatorios);
    } catch (error) {
          toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao listar relatórios',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Excluir relatório compartilhado
  const excluirRelatorioCompartilhado = async (id: string, userUuid: string): Promise<void> => {
    if (!userUuid) {
      toast({ title: "Erro", description: "Usuário não identificado para exclusão.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('relatorios_usuario')
        .delete()
        .eq('id', id)
        .eq('usuario_id', userUuid);
      if (error) throw new Error('Erro ao excluir relatório: ' + error.message);
      setRelatoriosCompartilhados(prev => prev.filter(r => r.id !== id));
            toast({
        title: "Relatório excluído",
        description: "O relatório compartilhado foi removido com sucesso.",
      });
    } catch (error) {
            toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao excluir relatório',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Copiar link para clipboard
  const copiarLink = async (relatorio: RelatorioCompartilhavel): Promise<void> => {
    try {
      await navigator.clipboard.writeText(relatorio.url);
      toast({
        title: "Link copiado!",
        description: "O link do relatório foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar link",
        variant: "destructive"
      });
    }
  };

  // Registrar acesso ao relatório
  const registrarAcesso = async (id: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('relatorios_usuario')
        .select('acessos')
        .eq('id', id)
        .single();
      if (error) return;
      const acessos = (data?.acessos || 0) + 1;
      await supabase
        .from('relatorios_usuario')
        .update({ acessos, ultimo_acesso: new Date().toISOString() })
        .eq('id', id);
    } catch (error) {
      // Silencioso
    }
  };

  return {
    loading,
    relatoriosCompartilhados,
    criarRelatorioCompartilhavel,
    listarRelatoriosCompartilhados,
    excluirRelatorioCompartilhado,
    copiarLink,
    registrarAcesso
  };
}
