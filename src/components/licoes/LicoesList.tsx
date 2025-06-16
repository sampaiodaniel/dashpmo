
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

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
        <Card className="bg-white border border-gray-200">
          <CardContent className="py-12 text-center">
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
      <Card className="bg-white border border-gray-200">
        <CardContent className="py-12 text-center">
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
      'Técnica': 'bg-blue-100 text-blue-800 border-blue-200',
      'Processo': 'bg-green-100 text-green-800 border-green-200',
      'Comunicação': 'bg-purple-100 text-purple-800 border-purple-200',
      'Recursos': 'bg-orange-100 text-orange-800 border-orange-200',
      'Planejamento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Qualidade': 'bg-red-100 text-red-800 border-red-200',
      'Fornecedores': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Riscos': 'bg-pink-100 text-pink-800 border-pink-200',
      'Mudanças': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Conhecimento': 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-4">
      {licoes.map((licao) => (
        <Card 
          key={licao.id}
          className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onLicaoClick(licao.id)}
        >
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className={getCategoriaColor(licao.categoria_licao)}>
                    {licao.categoria_licao}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-gray-900 font-medium leading-relaxed">
                  {licao.licao_aprendida}
                </p>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
