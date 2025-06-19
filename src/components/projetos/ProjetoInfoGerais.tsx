
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, User, Users, FileType } from 'lucide-react';
import { Projeto } from '@/types/pmo';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';

interface ProjetoInfoGeraisProps {
  projeto: Projeto;
}

export function ProjetoInfoGerais({ projeto }: ProjetoInfoGeraisProps) {
  const { data: tiposProjeto } = useTiposProjeto();

  // Função para formatar a data de finalização ou mostrar TBD
  const formatarFinalizacaoPrevista = (finalizacaoPrevista: string | null) => {
    if (!finalizacaoPrevista) {
      return 'TBD';
    }
    
    if (finalizacaoPrevista === 'TBD') {
      return 'TBD';
    }
    
    try {
      const date = new Date(finalizacaoPrevista);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'TBD';
    }
  };

  // Buscar o nome do tipo de projeto
  const tipoProjeto = tiposProjeto?.find(tipo => tipo.id === projeto.tipo_projeto_id);

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Nome do Projeto</label>
              <p className="text-base text-gray-900">{projeto.nome_projeto}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Status</label>
              <Badge variant={projeto.status_ativo ? "default" : "secondary"}>
                {projeto.status_ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Data de Criação</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-base text-gray-900">{projeto.data_criacao.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Data Prevista de Finalização</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-base text-gray-900">{formatarFinalizacaoPrevista(projeto.finalizacao_prevista)}</span>
              </div>
            </div>

            {tipoProjeto && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Tipo de Projeto</label>
                <div className="flex items-center gap-2">
                  <FileType className="h-4 w-4 text-gray-500" />
                  <span className="text-base text-gray-900">{tipoProjeto.valor}</span>
                </div>
              </div>
            )}
          </div>

          {projeto.descricao && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Descrição</label>
              <p className="text-base text-gray-900 leading-relaxed">{projeto.descricao}</p>
            </div>
          )}

          {projeto.equipe && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Equipe</label>
              <p className="text-base text-gray-900">{projeto.equipe}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Responsáveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projeto.responsavel_asa && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Responsável ASA</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-base text-gray-900">{projeto.responsavel_asa}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Chefe do Projeto</label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-base text-gray-900">{projeto.gp_responsavel}</span>
              </div>
            </div>

            {projeto.responsavel_cwi && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Responsável</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-base text-gray-900">{projeto.responsavel_cwi}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Carteiras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5" />
            Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Carteira Primária</label>
              <p className="text-base text-gray-900">{projeto.area_responsavel}</p>
            </div>

            {projeto.carteira_secundaria && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Carteira Secundária</label>
                <p className="text-base text-gray-900">{projeto.carteira_secundaria}</p>
              </div>
            )}

            {projeto.carteira_terciaria && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Carteira Terciária</label>
                <p className="text-base text-gray-900">{projeto.carteira_terciaria}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
