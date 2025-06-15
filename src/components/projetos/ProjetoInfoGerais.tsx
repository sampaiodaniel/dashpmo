
import { Calendar, User, Building2 } from 'lucide-react';
import { Projeto } from '@/types/pmo';

interface ProjetoInfoGeraisProps {
  projeto: Projeto;
}

export function ProjetoInfoGerais({ projeto }: ProjetoInfoGeraisProps) {
  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-pmo-primary mb-6">Informações Básicas</h2>
        
        <div className="space-y-4">
          {/* Nome do Projeto */}
          <div>
            <h3 className="font-medium text-pmo-gray mb-2">Nome do Projeto</h3>
            <p className="text-gray-900 font-medium text-lg">{projeto.nome_projeto}</p>
          </div>

          {/* Descrição do Projeto */}
          {projeto.descricao_projeto && (
            <div>
              <h3 className="font-medium text-pmo-gray mb-2">Descrição do Projeto</h3>
              <p className="text-gray-700">{projeto.descricao_projeto}</p>
            </div>
          )}

          {/* Finalização Prevista */}
          {projeto.finalizacao_prevista && (
            <div>
              <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Finalização Prevista
              </h3>
              <p className="text-gray-700 font-medium">{new Date(projeto.finalizacao_prevista).toLocaleDateString('pt-BR')}</p>
            </div>
          )}

          {/* Equipe */}
          {projeto.equipe && (
            <div>
              <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Equipe
              </h3>
              <p className="text-gray-700">{projeto.equipe}</p>
            </div>
          )}
        </div>
      </div>

      {/* Responsáveis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-pmo-primary mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Responsáveis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projeto.responsavel_asa && (
            <div>
              <span className="text-sm text-pmo-gray">Responsável ASA:</span>
              <p className="text-gray-700 font-medium">{projeto.responsavel_asa}</p>
            </div>
          )}
          
          {projeto.gp_responsavel_cwi && (
            <div>
              <span className="text-sm text-pmo-gray">GP Responsável CWI:</span>
              <p className="text-gray-700 font-medium">{projeto.gp_responsavel_cwi}</p>
            </div>
          )}

          {projeto.responsavel_cwi && (
            <div>
              <span className="text-sm text-pmo-gray">Responsável CWI:</span>
              <p className="text-gray-700 font-medium">{projeto.responsavel_cwi}</p>
            </div>
          )}
        </div>
      </div>

      {/* Carteiras */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-pmo-primary mb-6 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Carteiras
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Informações de Criação */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-pmo-primary mb-6">Informações de Criação</h2>
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
