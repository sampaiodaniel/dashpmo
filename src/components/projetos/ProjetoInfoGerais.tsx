
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, User, Users } from 'lucide-react';
import { Projeto } from '@/types/pmo';

interface ProjetoInfoGeraisProps {
  projeto: Projeto;
}

export function ProjetoInfoGerais({ projeto }: ProjetoInfoGeraisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informações Gerais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-pmo-gray">Nome do Projeto</label>
            <p className="text-lg font-semibold text-pmo-primary">{projeto.nome_projeto}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-pmo-gray">Responsável ASA</label>
            <div className="flex items-center gap-2 mt-1">
              <User className="h-4 w-4 text-pmo-gray" />
              <span>{projeto.responsavel_interno}</span>
            </div>
          </div>
          
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

          {projeto.gp_responsavel_cwi && (
            <div>
              <label className="text-sm font-medium text-pmo-gray">Chefe do Projeto</label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-pmo-gray" />
                <span>{projeto.gp_responsavel_cwi}</span>
              </div>
            </div>
          )}

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
            <label className="text-sm font-medium text-pmo-gray">Data de Criação</label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-pmo-gray" />
              <span>{projeto.data_criacao.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-pmo-gray">Status</label>
            <div className="mt-1">
              <Badge variant={projeto.status_ativo ? "default" : "secondary"}>
                {projeto.status_ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
        </div>

        {projeto.descricao && (
          <div>
            <label className="text-sm font-medium text-pmo-gray">Descrição</label>
            <p className="mt-1 text-gray-700">{projeto.descricao}</p>
          </div>
        )}

        {(projeto.carteira_secundaria || projeto.carteira_terciaria) && (
          <div>
            <label className="text-sm font-medium text-pmo-gray">Carteiras</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {projeto.carteira_secundaria && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Secundária: {projeto.carteira_secundaria}
                </Badge>
              )}
              {projeto.carteira_terciaria && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Terciária: {projeto.carteira_terciaria}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
