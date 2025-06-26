
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

  console.log('🔍 ProjetoInfoGerais - projeto:', projeto?.nome_projeto);
  console.log('🔍 ProjetoInfoGerais - tiposProjeto length:', tiposProjeto?.length);

  // Função para formatar a data de finalização usando a função utilitária
  const formatarFinalizacaoPrevista = (finalizacaoPrevista: string | null) => {
    return formatarData(finalizacaoPrevista);
  };

  // Buscar o nome do tipo de projeto
  const tipoProjeto = tiposProjeto?.find(tipo => tipo.id === projeto.tipo_projeto_id);
  console.log('🔍 ProjetoInfoGerais - tipoProjeto encontrado:', tipoProjeto?.nome);

  return (
    <div className="space-y-12">
      {/* Informações Básicas - Card Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-normal text-gray-700">
            <Building className="h-6 w-6 text-pmo-primary" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Descrição */}
          <div className="text-left">
            <label className="text-base font-medium text-pmo-gray block mb-4 text-left">Descrição do Projeto</label>
            <p className="text-base text-gray-900 leading-relaxed text-left">{projeto.descricao || projeto.descricao_projeto || 'Não informado'}</p>
          </div>

          {/* Status e Datas em grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <label className="text-base font-medium text-pmo-gray block mb-4">Status do Projeto</label>
              <Badge variant={projeto.status_ativo ? "default" : "secondary"} className="text-sm px-3 py-1">
                {projeto.status_ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div>
              <label className="text-base font-medium text-pmo-gray block mb-4">Data de Criação</label>
              <span className="text-base text-gray-900">{projeto.data_criacao.toLocaleDateString('pt-BR')}</span>
            </div>

            <div>
              <label className="text-base font-medium text-pmo-gray block mb-4">Previsão de Finalização</label>
              <span className="text-base text-gray-900">{formatarFinalizacaoPrevista(projeto.finalizacao_prevista)}</span>
            </div>
          </div>

          {/* Equipe e Tipo de Projeto em grid de 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Equipe */}
            {projeto.equipe && (
              <div className="text-left">
                <label className="text-base font-medium text-pmo-gray block mb-4 text-left">Equipe do Projeto</label>
                <p className="text-base text-gray-900 leading-relaxed text-left">{projeto.equipe}</p>
              </div>
            )}

            {/* Tipo de Projeto */}
            {tipoProjeto && (
              <div>
                <label className="text-base font-medium text-pmo-gray block mb-4">Tipo de Projeto</label>
                <span className="text-base text-gray-900">{tipoProjeto.nome}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cards de Responsáveis e Carteiras lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Responsáveis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-normal text-gray-700">
              <Users className="h-6 w-6 text-pmo-primary" />
              Responsáveis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {projeto.responsavel_asa && (
              <div>
                <label className="text-base font-medium text-pmo-gray block mb-4">Responsável ASA</label>
                <span className="text-base text-gray-900">{projeto.responsavel_asa}</span>
              </div>
            )}

            <div>
              <label className="text-base font-medium text-pmo-gray block mb-4">Chefe do Projeto</label>
              <span className="text-base text-gray-900">{projeto.gp_responsavel}</span>
            </div>

            {projeto.responsavel_cwi && (
              <div>
                <label className="text-base font-medium text-pmo-gray block mb-4">Responsável Técnico</label>
                <span className="text-base text-gray-900">{projeto.responsavel_cwi}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Carteiras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-normal text-gray-700">
              <FileText className="h-6 w-6 text-pmo-primary" />
              Carteiras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <label className="text-base font-medium text-pmo-gray block mb-4">Carteira Primária</label>
              <p className="text-base text-gray-900">{projeto.area_responsavel}</p>
            </div>

            {projeto.carteira_secundaria && projeto.carteira_secundaria !== 'none' && (
              <div>
                <label className="text-base font-medium text-pmo-gray block mb-4">Carteira Secundária</label>
                <p className="text-base text-gray-900">{projeto.carteira_secundaria}</p>
              </div>
            )}

            {projeto.carteira_terciaria && projeto.carteira_terciaria !== 'none' && (
              <div>
                <label className="text-base font-medium text-pmo-gray block mb-4">Carteira Terciária</label>
                <p className="text-base text-gray-900">{projeto.carteira_terciaria}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
