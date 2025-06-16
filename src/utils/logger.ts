
import { useAuth } from '@/hooks/useAuth';
import { useRegistrarLog } from '@/hooks/useLogsAlteracoes';
import { ModuloSistema, AcaoSistema } from '@/types/admin';

// Utility para registrar logs facilmente em qualquer parte da aplicação
export const useLogger = () => {
  const { usuario } = useAuth();
  const { mutate: registrarLog } = useRegistrarLog();

  const log = (
    modulo: ModuloSistema,
    acao: AcaoSistema,
    entidade_tipo: string,
    entidade_id?: number,
    entidade_nome?: string,
    detalhes_alteracao?: any
  ) => {
    if (usuario) {
      registrarLog({
        modulo,
        acao,
        entidade_tipo,
        entidade_id,
        entidade_nome,
        detalhes_alteracao,
        usuario_id: usuario.id,
        usuario_nome: usuario.nome
      });
    }
  };

  return { log };
};
