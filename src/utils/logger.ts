import { supabase } from '@/integrations/supabase/client';
import { ModuloSistema, AcaoSistema } from '@/types/admin';

// Função utilitária para registrar logs de forma simples
export const log = async (
  modulo: ModuloSistema,
  acao: AcaoSistema,
  entidade_tipo: string,
  entidade_id?: number,
  entidade_nome?: string,
  detalhes_alteracao?: any,
  usuario_id?: number,
  usuario_nome?: string
) => {
  try {
    // Se não tiver dados do usuário, tentar obter do localStorage
    if (!usuario_id || !usuario_nome) {
      const userData = localStorage.getItem('pmo_user');
      if (userData) {
        const user = JSON.parse(userData);
        usuario_id = user.id;
        usuario_nome = user.nome;
      }
    }

    if (!usuario_id || !usuario_nome) {
      console.warn('⚠️ Tentativa de log sem dados do usuário');
      return;
    }

    console.log('📝 Registrando log:', { modulo, acao, entidade_tipo, entidade_id, entidade_nome });

    // Tentar usar a função RPC primeiro
    const { error: rpcError } = await supabase.rpc('registrar_log_alteracao', {
      p_usuario_id: usuario_id,
      p_usuario_nome: usuario_nome,
      p_modulo: modulo,
      p_acao: acao,
      p_entidade_tipo: entidade_tipo,
      p_entidade_id: entidade_id,
      p_entidade_nome: entidade_nome,
      p_detalhes_alteracao: detalhes_alteracao,
      p_ip_usuario: null,
      p_user_agent: navigator.userAgent
    });

    if (rpcError) {
      console.warn('⚠️ Erro na função RPC, tentando inserção direta:', rpcError);
      
      // Fallback: inserção direta na tabela
      const { error: insertError } = await supabase
        .from('logs_alteracoes')
        .insert({
          usuario_id: usuario_id,
          usuario_nome: usuario_nome,
          modulo: modulo,
          acao: acao,
          entidade_tipo: entidade_tipo,
          entidade_id: entidade_id,
          entidade_nome: entidade_nome,
          detalhes_alteracao: detalhes_alteracao,
          ip_usuario: null,
          user_agent: navigator.userAgent
        });

      if (insertError) {
        console.error('❌ Erro ao registrar log (inserção direta):', insertError);
      } else {
        console.log('✅ Log registrado com sucesso (inserção direta)');
      }
    } else {
      console.log('✅ Log registrado com sucesso (RPC)');
    }
  } catch (error) {
    console.error('❌ Erro inesperado ao registrar log:', error);
  }
};

// Hook para usar o logger com contexto do usuário
export const useLogger = () => {
  const logAction = (
    modulo: ModuloSistema,
    acao: AcaoSistema,
    entidade_tipo: string,
    entidade_id?: number,
    entidade_nome?: string,
    detalhes_alteracao?: any
  ) => {
    log(modulo, acao, entidade_tipo, entidade_id, entidade_nome, detalhes_alteracao);
  };

  return { log: logAction };
};
