
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, User, Users } from 'lucide-react';
import { Projeto } from '@/types/pmo';

interface ProjetoInfoGeraisProps {
  projeto: Projeto;
}

export function ProjetoInfoGerais({ projeto }: ProjetoInfoGeraisProps) {
  // Function to format date as dd/MM/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-pmo-gray">Nome do Projeto</label>
              <p className="text-lg font-semibold text-pmo-primary">{projeto.nome_projeto}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-pmo-gray">Status</label>
              <div className="mt-1">
                <Badge variant={projeto.status_ativo ? "default" : "secondary"}>
                  {projeto.status_ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-pmo-gray">Data de Criação</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-pmo-gray" />
                <span>{projeto.data_criacao.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {projeto.finalizacao_prevista && (
              <div>
                <label className="text-sm font-medium text-pmo-gray">Finalização Prevista</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-pmo-gray" />
                  <span>{formatDate(projeto.finalizacao_prevista)}</span>
                </div>
              </div>
            )}
          </div>

          {projeto.descricao && (
            <div>
              <label className="text-sm font-medium text-pmo-gray">Descrição</label>
              <p className="mt-1 text-gray-700">{projeto.descricao}</p>
            </div>
          )}

          {projeto.equipe && (
            <div>
              <label className="text-sm font-medium text-pmo-gray">Equipe</label>
              <p className="mt-1 text-gray-700">{projeto.equipe}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Responsáveis
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projeto.responsavel_asa && (
            <div>
              <label className="text-sm font-medium text-pmo-gray">Responsável ASA</label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-pmo-gray" />
                <span>{projeto.responsavel_asa}</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-pmo-gray">Chefe do Projeto</label>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4 text-pmo-gray" />
              <span>{projeto.gp_responsavel}</span>
            </div>
          </div>

          {projeto.responsavel_cwi && (
            <div>
              <label className="text-sm font-medium text-pmo-gray">Responsável</label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-pmo-gray" />
                <span>{projeto.responsavel_cwi}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carteiras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-pmo-gray">Carteira Primária</label>
              <p className="text-lg font-semibold text-pmo-primary mt-1">{projeto.area_responsavel}</p>
            </div>

            {projeto.carteira_secundaria && (
              <div>
                <label className="text-sm font-medium text-pmo-gray">Carteira Secundária</label>
                <p className="text-lg font-semibold text-pmo-primary mt-1">{projeto.carteira_secundaria}</p>
              </div>
            )}

            {projeto.carteira_terciaria && (
              <div>
                <label className="text-sm font-medium text-pmo-gray">Carteira Terciária</label>
                <p className="text-lg font-semibold text-pmo-primary mt-1">{projeto.carteira_terciaria}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
