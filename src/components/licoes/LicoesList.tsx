
import { Search, ChevronRight, Star, AlertTriangle, CheckCircle, Clock, XCircle, BookOpen, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePagination } from '@/hooks/usePagination';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { LicaoContextMenu } from './LicaoContextMenu';
import { useLicaoActions } from '@/hooks/useLicaoActions';

interface LicoesListProps {
  licoes: any[];
  isLoading: boolean;
  error: Error | null;
  termoBusca: string;
  filtrosAplicados: boolean;
  onLicaoClick: (licaoId: number) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Aplicada':
      return <CheckCircle className="h-3 w-3" />;
    case 'Em andamento':
      return <Clock className="h-3 w-3" />;
    case 'Não aplicada':
      return <XCircle className="h-3 w-3" />;
    default:
      return <XCircle className="h-3 w-3" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aplicada':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Em andamento':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Não aplicada':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getCategoriaIcon = (categoria: string) => {
  const isBoaPratica = ['Desenvolvimento', 'DevOps', 'Qualidade e Testes', 'Gestão de Projetos'].includes(categoria);
  return isBoaPratica ? <Star className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-orange-600" />;
};

export function LicoesList({ 
  licoes, 
  isLoading, 
  error, 
  termoBusca, 
  filtrosAplicados, 
  onLicaoClick 
}: LicoesListProps) {
  const {
    handleVisualizar,
    handleEditar,
    handleCardClick
  } = useLicaoActions(onLicaoClick);

  const {
    paginatedData,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    startItem,
    endItem,
    totalItems
  } = usePagination({ data: licoes || [], itemsPerPage: 10 });

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-8 text-red-600">
          <p>Erro ao carregar lições: {error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando lições...</div>
        </div>
      </div>
    );
  }

  if (!licoes || licoes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12 text-pmo-gray">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">
            {termoBusca || filtrosAplicados ? 'Nenhuma lição encontrada para os filtros aplicados' : 'Nenhuma lição encontrada'}
          </p>
          <p className="text-sm">
            {termoBusca || filtrosAplicados ? 'Tente alterar os filtros ou termos da busca' : 'Comece compartilhando conhecimentos e experiências'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y">
          {paginatedData.map((licao) => (
            <div 
              key={licao.id} 
              className="relative p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => handleCardClick(licao.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    {getCategoriaIcon(licao.categoria_licao)}
                    <h3 className="font-semibold text-xl text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                      {licao.categoria_licao}
                    </h3>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(licao.status_aplicacao)}`}>
                      {getStatusIcon(licao.status_aplicacao)}
                      {licao.status_aplicacao}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-pmo-gray">Data Registro:</span>
                      <div className="font-medium">
                        {licao.data_registro.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-pmo-gray">Responsável:</span>
                      <div className="font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {licao.responsavel_registro}
                      </div>
                    </div>
                    {licao.projeto && (
                      <div>
                        <span className="text-pmo-gray">Projeto:</span>
                        <div className="font-medium">{licao.projeto.nome_projeto}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Lição Aprendida:</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        {licao.licao_aprendida}
                      </p>
                    </div>

                    {licao.acao_recomendada && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Ação Recomendada:</span>
                        </div>
                        <p className="text-sm text-green-800">
                          {licao.acao_recomendada}
                        </p>
                      </div>
                    )}
                  </div>

                  {licao.tags_busca && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {licao.tags_busca.split(',').map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <LicaoContextMenu
                    licaoId={licao.id}
                    onVisualizar={handleVisualizar}
                    onEditar={handleEditar}
                  />
                  <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors flex-shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        goToPage={goToPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        startItem={startItem}
        endItem={endItem}
        totalItems={totalItems}
      />
    </div>
  );
}
