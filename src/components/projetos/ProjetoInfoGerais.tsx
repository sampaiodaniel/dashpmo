
import { Calendar, User, Building2 } from 'lucide-react';
import { Projeto } from '@/types/pmo';

interface ProjetoInfoGeraisProps {
  projeto: Projeto;
}

export function ProjetoInfoGerais({ projeto }: ProjetoInfoGeraisProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-pmo-primary mb-6">Informações Gerais</h2>
      
      {/* Nome do Projeto */}
      <div className="mb-6">
        <h3 className="font-medium text-pmo-gray mb-2">Nome do Projeto</h3>
        <p className="text-gray-900 font-medium text-lg">{projeto.nome_projeto}</p>
      </div>

      {/* Descrição do Projeto */}
      {projeto.descricao_projeto && (
        <div className="mb-6">
          <h3 className="font-medium text-pmo-gray mb-2">Descrição do Projeto</h3>
          <p className="text-gray-700">{projeto.descricao_projeto}</p>
        </div>
      )}

      {/* Responsáveis */}
      <div className="mb-6">
        <h3 className="font-medium text-pmo-gray mb-4 flex items-center gap-2">
          <User className="h-4 w-4" />
          Responsáveis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-pmo-gray">Responsável Interno:</span>
            <p className="text-gray-700 font-medium">{projeto.responsavel_interno}</p>
          </div>
          
          <div>
            <span className="text-sm text-pmo-gray">GP Responsável:</span>
            <p className="text-gray-700 font-medium">{projeto.gp_responsavel}</p>
          </div>

          {projeto.responsavel_cwi && (
            <div>
              <span className="text-sm text-pmo-gray">Responsável CWI:</span>
              <p className="text-gray-700 font-medium">{projeto.responsavel_cwi}</p>
            </div>
          )}

          {projeto.gp_responsavel_cwi && (
            <div>
              <span className="text-sm text-pmo-gray">GP Responsável CWI:</span>
              <p className="text-gray-700 font-medium">{projeto.gp_responsavel_cwi}</p>
            </div>
          )}

          {projeto.responsavel_asa && (
            <div>
              <span className="text-sm text-pmo-gray">Responsável ASA:</span>
              <p className="text-gray-700 font-medium">{projeto.responsavel_asa}</p>
            </div>
          )}
        </div>
      </div>

      {/* Carteiras */}
      <div className="mb-6">
        <h3 className="font-medium text-pmo-gray mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Carteiras
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-pmo-gray">Área Responsável:</span>
            <p className="text-gray-700 font-medium">{projeto.area_responsavel}</p>
          </div>

          {projeto.carteira_primaria && (
            <div>
              <span className="text-sm text-pmo-gray">Carteira Primária:</span>
              <p className="text-gray-700 font-medium">{projeto.carteira_primaria}</p>
            </div>
          )}

          {projeto.carteira_secundaria && (
            <div>
              <span className="text-sm text-pmo-gray">Carteira Secundária:</span>
              <p className="text-gray-700 font-medium">{projeto.carteira_secundaria}</p>
            </div>
          )}

          {projeto.carteira_terciaria && (
            <div>
              <span className="text-sm text-pmo-gray">Carteira Terciária:</span>
              <p className="text-gray-700 font-medium">{projeto.carteira_terciaria}</p>
            </div>
          )}
        </div>
      </div>

      {/* Equipe */}
      {projeto.equipe && (
        <div className="mb-6">
          <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Equipe
          </h3>
          <p className="text-gray-700">{projeto.equipe}</p>
        </div>
      )}

      {/* Datas */}
      <div className="mb-6">
        <h3 className="font-medium text-pmo-gray mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Cronograma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-pmo-gray">Data de Início:</span>
            <p className="text-gray-700 font-medium">{projeto.data_criacao.toLocaleDateString('pt-BR')}</p>
          </div>

          {projeto.finalizacao_prevista && (
            <div>
              <span className="text-sm text-pmo-gray">Finalização Prevista:</span>
              <p className="text-gray-700 font-medium">{new Date(projeto.finalizacao_prevista).toLocaleDateString('pt-BR')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Informações de Criação */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-pmo-gray mb-4">Informações de Criação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-pmo-gray">Criado por:</span>
            <p className="text-gray-700">{projeto.criado_por}</p>
          </div>
          
          <div>
            <span className="text-sm text-pmo-gray">Data de Criação:</span>
            <p className="text-gray-700">{projeto.data_criacao.toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
