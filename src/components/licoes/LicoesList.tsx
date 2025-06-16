
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Target, Lightbulb, FileText, BookOpen } from 'lucide-react';
import { LicaoContextMenu } from './LicaoContextMenu';

interface LicaoItem {
  id: number;
  projeto_id?: number;
  categoria_licao: string;
  responsavel_registro: string;
  data_registro: string;
  situacao_ocorrida: string;
  licao_aprendida: string;
  acao_recomendada: string;
  impacto_gerado: string;
  status_aplicacao?: string;
  tags_busca?: string;
}

interface LicoesListProps {
  licoes: LicaoItem[] | undefined;
  isLoading: boolean;
  error: any;
  termoBusca: string;
  filtrosAplicados: boolean;
  onLicaoClick: (licaoId: number) => void;
}

export function LicoesList({ 
  licoes, 
  isLoading, 
  error, 
  termoBusca, 
  filtrosAplicados,
  onLicaoClick 
}: LicoesListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-pmo-gray">Carregando lições aprendidas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Erro ao carregar lições aprendidas</div>
        <div className="text-sm text-pmo-gray">Tente recarregar a página</div>
      </div>
    );
  }

  if (!licoes || licoes.length === 0) {
    if (termoBusca || filtrosAplicados) {
      return (
        <Card className="bg-white">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-pmo-gray mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-pmo-gray mb-2">
              Nenhuma lição encontrada
            </h3>
            <p className="text-sm text-pmo-gray max-w-md mx-auto">
              Não foi possível encontrar lições com os filtros aplicados. 
              Tente ajustar os critérios de busca.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-white">
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-pmo-gray mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-pmo-gray mb-2">
            Nenhuma lição cadastrada
          </h3>
          <p className="text-sm text-pmo-gray max-w-md mx-auto">
            Comece criando a primeira lição aprendida do sistema.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Técnica': 'bg-blue-100 text-blue-800',
      'Processo': 'bg-green-100 text-green-800',
      'Comunicação': 'bg-purple-100 text-purple-800',
      'Recursos': 'bg-orange-100 text-orange-800',
      'Planejamento': 'bg-yellow-100 text-yellow-800',
      'Qualidade': 'bg-red-100 text-red-800',
      'Fornecedores': 'bg-indigo-100 text-indigo-800',
      'Riscos': 'bg-pink-100 text-pink-800',
      'Mudanças': 'bg-cyan-100 text-cyan-800',
      'Conhecimento': 'bg-emerald-100 text-emerald-800'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const colors: Record<string, string> = {
      'Aplicada': 'bg-green-100 text-green-800',
      'Não aplicada': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-4">
      {licoes.map((licao) => (
        <LicaoContextMenu 
          key={licao.id} 
          licao={licao}
          onEdit={() => onLicaoClick(licao.id)}
          onView={() => onLicaoClick(licao.id)}
        >
          <Card 
            className="bg-white hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onLicaoClick(licao.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoriaColor(licao.categoria_licao)}>
                      {licao.categoria_licao}
                    </Badge>
                    {licao.status_aplicacao && (
                      <Badge variant="outline" className={getStatusColor(licao.status_aplicacao)}>
                        {licao.status_aplicacao}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-pmo-gray">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(licao.data_registro).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {licao.responsavel_registro}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-pmo-gray" />
                    <span className="text-sm font-medium text-pmo-gray">Situação Ocorrida</span>
                  </div>
                  <p className="text-sm text-gray-700 pl-6">
                    {truncateText(licao.situacao_ocorrida)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-pmo-gray" />
                    <span className="text-sm font-medium text-pmo-gray">Lição Aprendida</span>
                  </div>
                  <p className="text-sm text-gray-700 pl-6">
                    {truncateText(licao.licao_aprendida)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-pmo-gray" />
                    <span className="text-sm font-medium text-pmo-gray">Ação Recomendada</span>
                  </div>
                  <p className="text-sm text-gray-700 pl-6">
                    {truncateText(licao.acao_recomendada)}
                  </p>
                </div>
              </div>
              
              {licao.tags_busca && (
                <div className="mt-4 pt-3 border-t">
                  <div className="flex flex-wrap gap-1">
                    {licao.tags_busca.split(',').map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </LicaoContextMenu>
      ))}
    </div>
  );
}
