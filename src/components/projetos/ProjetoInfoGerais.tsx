
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, User, Users, FileType, FileText } from 'lucide-react';
import { Projeto } from '@/types/pmo';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';
import { formatarData } from '@/utils/dateFormatting';

interface ProjetoInfoGeraisProps {
  projeto: Projeto;
}

export function ProjetoInfoGerais({ projeto }: ProjetoInfoGeraisProps) {
  const { data: tiposProjeto } = useTiposProjeto();

  // Buscar o nome do tipo de projeto
  const tipoProjeto = tiposProjeto?.find(tipo => tipo.id === projeto.tipo_projeto_id);

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Informações Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-left">
        {/* Descrição */}
        <div className="text-left">
          <label className="text-sm font-medium text-pmo-gray block mb-2 text-left">Descrição do Projeto</label>
          <p className="text-sm text-gray-900 leading-relaxed text-left">
            {projeto.descricao || projeto.descricao_projeto || 'Não informado'}
          </p>
        </div>

        {/* Status e Datas em grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-pmo-gray block mb-2">Status do Projeto</label>
            <Badge className={`text-xs ${getStatusColor(projeto.status_ativo)}`}>
              {projeto.status_ativo ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-pmo-gray block mb-2">Data de Criação</label>
            <span className="text-sm text-gray-900">{formatarData(projeto.data_criacao)}</span>
          </div>

          <div>
            <label className="text-sm font-medium text-pmo-gray block mb-2">Previsão de Finalização</label>
            <span className="text-sm text-gray-900">{formatarData(projeto.finalizacao_prevista)}</span>
          </div>
        </div>

        {/* Tipo de Projeto e Equipe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-pmo-gray block mb-2">Tipo de Projeto</label>
            <span className="text-sm text-gray-900">{tipoProjeto?.nome || 'Não informado'}</span>
          </div>

          {projeto.equipe && (
            <div>
              <label className="text-sm font-medium text-pmo-gray block mb-2">Equipe do Projeto</label>
              <span className="text-sm text-gray-900">{projeto.equipe}</span>
            </div>
          )}
        </div>

        {/* Responsáveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-pmo-gray block mb-2">Chefe do Projeto</label>
            <span className="text-sm text-gray-900">{projeto.gp_responsavel}</span>
          </div>

          {projeto.responsavel_asa && (
            <div>
              <label className="text-sm font-medium text-pmo-gray block mb-2">Responsável ASA</label>
              <span className="text-sm text-gray-900">{projeto.responsavel_asa}</span>
            </div>
          )}

          {projeto.responsavel_cwi && (
            <div>
              <label className="text-sm font-medium text-pmo-gray block mb-2">Responsável Técnico</label>
              <span className="text-sm text-gray-900">{projeto.responsavel_cwi}</span>
            </div>
          )}
        </div>

        {/* Carteiras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-pmo-gray block mb-2">Carteira Primária</label>
            <span className="text-sm text-gray-900">{projeto.area_responsavel}</span>
          </div>

          {projeto.carteira_secundaria && projeto.carteira_secundaria !== 'none' && (
            <div>
              <label className="text-sm font-medium text-pmo-gray block mb-2">Carteira Secundária</label>
              <span className="text-sm text-gray-900">{projeto.carteira_secundaria}</span>
            </div>
          )}

          {projeto.carteira_terciaria && projeto.carteira_terciaria !== 'none' && (
            <div>
              <label className="text-sm font-medium text-pmo-gray block mb-2">Carteira Terciária</label>
              <span className="text-sm text-gray-900">{projeto.carteira_terciaria}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
