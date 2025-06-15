
import { Calendar, User } from 'lucide-react';
import { Projeto } from '@/types/pmo';

interface ProjetoInfoGeraisProps {
  projeto: Projeto;
}

export function ProjetoInfoGerais({ projeto }: ProjetoInfoGeraisProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-pmo-primary mb-4">Informações Gerais</h2>
      
      {projeto.descricao_projeto && (
        <div className="mb-6">
          <h3 className="font-medium text-pmo-gray mb-2">Descrição do Projeto</h3>
          <p className="text-gray-700">{projeto.descricao_projeto}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Responsável Interno
          </h3>
          <p className="text-gray-700">{projeto.responsavel_interno}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            GP Responsável
          </h3>
          <p className="text-gray-700">{projeto.gp_responsavel}</p>
        </div>

        {projeto.responsavel_cwi && (
          <div>
            <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Responsável CWI
            </h3>
            <p className="text-gray-700">{projeto.responsavel_cwi}</p>
          </div>
        )}

        {projeto.gp_responsavel_cwi && (
          <div>
            <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              GP Responsável CWI
            </h3>
            <p className="text-gray-700">{projeto.gp_responsavel_cwi}</p>
          </div>
        )}

        {projeto.responsavel_asa && (
          <div>
            <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Responsável ASA
            </h3>
            <p className="text-gray-700">{projeto.responsavel_asa}</p>
          </div>
        )}

        {projeto.equipe && (
          <div>
            <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Equipe
            </h3>
            <p className="text-gray-700">{projeto.equipe}</p>
          </div>
        )}
        
        <div>
          <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Data de Criação
          </h3>
          <p className="text-gray-700">{projeto.data_criacao.toLocaleDateString('pt-BR')}</p>
        </div>

        {projeto.finalizacao_prevista && (
          <div>
            <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Finalização Prevista
            </h3>
            <p className="text-gray-700">{new Date(projeto.finalizacao_prevista).toLocaleDateString('pt-BR')}</p>
          </div>
        )}
        
        <div>
          <h3 className="font-medium text-pmo-gray mb-2">Criado por</h3>
          <p className="text-gray-700">{projeto.criado_por}</p>
        </div>
      </div>
    </div>
  );
}
