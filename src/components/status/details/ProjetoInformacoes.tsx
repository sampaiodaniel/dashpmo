import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, User, Users, FileType, FileText } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';
import { formatarData } from '@/utils/dateFormatting';

interface ProjetoInformacoesProps {
  status: StatusProjeto;
}

export function ProjetoInformacoes({ status }: ProjetoInformacoesProps) {
  const { data: tiposProjeto } = useTiposProjeto();

  // Função para formatar a data de finalização usando a função utilitária
  const formatarFinalizacaoPrevista = (finalizacaoPrevista: string | null) => {
    return formatarData(finalizacaoPrevista);
  };

  // Buscar o nome do tipo de projeto
  const tipoProjeto = tiposProjeto?.find(tipo => tipo.id === status.projeto?.tipo_projeto_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building className="h-5 w-5" />
          Informações do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Descrição */}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-4">Descrição do Projeto</label>
          <p className="text-base text-gray-900 leading-relaxed">{status.projeto?.descricao || status.projeto?.descricao_projeto || 'Não informado'}</p>
        </div>

        {/* Status e Datas em grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-4">Status do Projeto</label>
            <Badge variant={status.projeto?.status_ativo ? "default" : "secondary"} className="text-sm px-3 py-1">
              {status.projeto?.status_ativo ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-4">Data de Criação</label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-base text-gray-900">{status.projeto?.data_criacao.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-4">Previsão de Finalização</label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-base text-gray-900">{formatarFinalizacaoPrevista(status.projeto?.finalizacao_prevista)}</span>
            </div>
          </div>
        </div>

        {/* Equipe e Tipo de Projeto em grid de 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Equipe */}
          {status.projeto?.equipe && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-4">Equipe do Projeto</label>
              <p className="text-base text-gray-900 leading-relaxed text-left">{status.projeto.equipe}</p>
            </div>
          )}

          {/* Tipo de Projeto */}
          {tipoProjeto && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-4">Tipo de Projeto</label>
              <div className="flex items-center gap-2">
                <FileType className="h-5 w-5 text-gray-500" />
                <span className="text-base text-gray-900">{tipoProjeto.nome}</span>
              </div>
            </div>
          )}
        </div>

        {/* Cards de Responsáveis e Carteiras lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Responsáveis */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-6">
              <Users className="h-5 w-5" />
              Responsáveis
            </h3>
            <div className="space-y-6">
              {status.projeto?.responsavel_asa && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Responsável ASA</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{status.projeto.responsavel_asa}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-3">Chefe do Projeto</label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-base text-gray-900">{status.projeto?.gp_responsavel}</span>
                </div>
              </div>

              {status.projeto?.responsavel_cwi && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Responsável Técnico</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{status.projeto.responsavel_cwi}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Carteiras */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-6">
              <FileText className="h-5 w-5" />
              Carteiras
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-3">Carteira Primária</label>
                <p className="text-base text-gray-900">{status.projeto?.area_responsavel}</p>
              </div>

              {status.projeto?.carteira_secundaria && status.projeto.carteira_secundaria !== 'none' && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Carteira Secundária</label>
                  <p className="text-base text-gray-900">{status.projeto.carteira_secundaria}</p>
                </div>
              )}

              {status.projeto?.carteira_terciaria && status.projeto.carteira_terciaria !== 'none' && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Carteira Terciária</label>
                  <p className="text-base text-gray-900">{status.projeto.carteira_terciaria}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
