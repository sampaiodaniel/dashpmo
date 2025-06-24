import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  // Gerar ID seguro para URL
  const gerarIdSeguro = (): string => {
    const uuid = uuidv4().replace(/-/g, '');
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}-${uuid.substring(0, 16)}`;
  };

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
  const criarRelatorioCompartilhavel = async (params: CriarRelatorioCompartilhavelParams): Promise<RelatorioCompartilhavel | null> => {
    setLoading(true);
    
    try {
      console.log('🚀 Iniciando criação de relatório compartilhável:', params);
      
      // Validar parâmetros obrigatórios
      if (!params.titulo?.trim()) {
        throw new Error('Título é obrigatório');
      }
      
      if (!params.dados) {
        throw new Error('Dados do relatório são obrigatórios');
      }

      // Obter usuário atual do sistema customizado
      const token = localStorage.getItem('pmo_token');
      const userData = localStorage.getItem('pmo_user');
      
      if (!token || !userData) {
        throw new Error('Usuário não autenticado');
      }

      let user;
      try {
        user = JSON.parse(userData);
      } catch (error) {
        throw new Error('Dados de usuário inválidos');
      }

      console.log('✅ Usuário autenticado:', user.nome || user.email);

      const id = gerarIdSeguro();
      const agora = new Date();
      const dataExpiracao = new Date();
      dataExpiracao.setDate(agora.getDate() + (params.expiraEm || 30));

      console.log('📝 Dados processados:', {
        id,
        titulo: params.titulo,
        tipo: params.tipo,
        expiraEm: params.expiraEm || 30
      });

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
        criadoPor: user.nome || user.email,
        acessos: 0
      };

      console.log('💾 Salvando no localStorage e sessionStorage para melhor persistência');

      // Salvar no localStorage e sessionStorage para melhor persistência
      const reportKey = `shared-report-${id}`;
      const reportData = {
        ...relatorio,
        expiresAt: dataExpiracao.toISOString()
      };
      
      try {
        localStorage.setItem(reportKey, JSON.stringify(reportData));
        sessionStorage.setItem(reportKey, JSON.stringify(reportData));
        // Também salvar com chave sem prefixo para fallback
        localStorage.setItem(id, JSON.stringify(reportData));
        sessionStorage.setItem(id, JSON.stringify(reportData));
        console.log('✅ Salvo em localStorage e sessionStorage com sucesso');
      } catch (localStorageError) {
        console.error('❌ Erro ao salvar:', localStorageError);
        try {
          // Tentar apenas sessionStorage se localStorage falhar
          sessionStorage.setItem(reportKey, JSON.stringify(reportData));
          sessionStorage.setItem(id, JSON.stringify(reportData));
          console.log('✅ Salvo apenas em sessionStorage');
        } catch (sessionError) {
          console.error('❌ Erro também no sessionStorage:', sessionError);
          throw new Error('Erro ao salvar dados. Verifique o espaço disponível.');
        }
      }

      // Sistema usando apenas localStorage para simplificar
      console.log('💾 Sistema configurado para usar apenas localStorage');

      // Atualizar lista local
      setRelatoriosCompartilhados(prev => [relatorio, ...prev]);

      console.log('🎉 Relatório compartilhável criado com sucesso!');

      toast({
        title: "Relatório compartilhável criado!",
        description: `Link gerado com sucesso. Expira em ${params.expiraEm || 30} dias.`,
      });

      return relatorio;

    } catch (error) {
      console.error('❌ Erro ao criar relatório compartilhável:', error);
      
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
  const listarRelatoriosCompartilhados = async (): Promise<void> => {
    try {
      // Obter usuário atual do sistema customizado
      const token = localStorage.getItem('pmo_token');
      const userData = localStorage.getItem('pmo_user');
      
      if (!token || !userData) return;

      let user;
      try {
        user = JSON.parse(userData);
      } catch (error) {
        console.warn('Erro ao parsear dados do usuário:', error);
        return;
      }

      // Buscar do localStorage
      const relatoriosLocal: RelatorioCompartilhavel[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('shared-report-')) {
          try {
            const data = JSON.parse(localStorage.getItem(key)!);
            const criadoPorUsuario = data.criadoPor === (user.nome || user.email);
            
            if (criadoPorUsuario) {
              // Verificar se não expirou
              const expiraEm = new Date(data.expiresAt);
              if (new Date() <= expiraEm) {
                relatoriosLocal.push(data);
              } else {
                // Remover expirado
                localStorage.removeItem(key);
              }
            }
          } catch (e) {
            console.warn('Erro ao parsear relatório local:', e);
          }
        }
      }

      setRelatoriosCompartilhados(relatoriosLocal.sort((a, b) => 
        new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
      ));

    } catch (error) {
      console.error('Erro ao listar relatórios:', error);
    }
  };

  // Excluir relatório compartilhado
  const excluirRelatorioCompartilhado = async (id: string): Promise<void> => {
    try {
      // Remover do localStorage
      localStorage.removeItem(`shared-report-${id}`);

      // Atualizar lista local
      setRelatoriosCompartilhados(prev => prev.filter(r => r.id !== id));

      toast({
        title: "Relatório excluído",
        description: "O relatório compartilhado foi removido com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir relatório compartilhado",
        variant: "destructive"
      });
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
      console.error('Erro ao copiar link:', error);
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
      const reportKey = `shared-report-${id}`;
      const reportData = localStorage.getItem(reportKey);
      
      if (reportData) {
        const data = JSON.parse(reportData);
        data.acessos = (data.acessos || 0) + 1;
        data.ultimoAcesso = new Date().toISOString();
        localStorage.setItem(reportKey, JSON.stringify(data));
      }
    } catch (error) {
      console.warn('Erro ao registrar acesso:', error);
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
