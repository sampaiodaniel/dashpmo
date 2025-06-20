import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, FileText } from 'lucide-react';
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

  const tipoProjeto = tiposProjeto?.find(tipo => tipo.id === projeto.tipo_projeto_id);

  // Classes utilitárias para padronização visual igual ao bloco Último Status
  const blocoTituloClass = "flex items-center gap-2 text-[1.625rem] font-normal text-black mb-8";
  const blocoIconClass = "h-5 w-5 text-pmo-primary";
  const labelClass = "block text-base text-gray-400 mb-2 font-bold text-center";
  const valueClass = "text-base text-black text-center font-normal mb-0";
  const gridClass = "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8";
  const grid2Class = "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0";
  const grid3Class = "grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8";

  return (
    <div className="space-y-12">
      {/* Bloco: Informações Básicas */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader className="pb-0">
          <CardTitle className={blocoTituloClass}>
            <Building className={blocoIconClass} />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-10">
          {/* Descrição */}
          <div className="mb-6">
            <span className="block text-base text-pmo-gray mb-2 font-medium text-left">Descrição do Projeto</span>
            <div className="w-full">
              <span className="text-base text-black font-normal block mt-1 mb-2 text-left">{projeto.descricao || projeto.descricao_projeto || 'Não informado'}</span>
            </div>
          </div>
          {/* Equipe */}
          <div className="mb-8">
            <span className="block text-base text-pmo-gray mb-2 font-medium text-left">Equipe</span>
            <div className="w-full">
              <span className="text-base text-black font-normal block mt-1 mb-2 text-left">{projeto.equipe || 'Não informado'}</span>
            </div>
          </div>
          {/* Grid para os outros campos */}
          <div className={grid2Class + " mb-0"}>
            <div>
              <span className={labelClass}>Tipo de Projeto</span>
              <div className="mt-1">
                <span className={valueClass}>{tipoProjeto?.nome || 'Não informado'}</span>
              </div>
            </div>
            <div>
              <span className={labelClass}>Status do Projeto</span>
              <div className="mt-1">
                <span className="inline-block rounded-full bg-pmo-primary/80 text-white px-6 py-1 text-base font-normal">
                  {projeto.status_ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
          <div className={grid2Class + " mt-8"}>
            <div>
              <span className={labelClass}>Data de Criação</span>
              <span className={valueClass + ' text-left'}>{projeto.data_criacao.toLocaleDateString('pt-BR')}</span>
            </div>
            <div>
              <span className={labelClass}>Previsão de Finalização</span>
              <span className={valueClass + ' text-left'}>{formatarFinalizacaoPrevista(projeto.finalizacao_prevista)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloco: Responsáveis */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader className="pb-0">
          <CardTitle className={blocoTituloClass}>
            <Users className={blocoIconClass} />
            Responsáveis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-10">
          <div className={grid3Class}>
            <div>
              <span className={labelClass}>Responsável ASA</span>
              <span className={valueClass}>{projeto.responsavel_asa || 'Não informado'}</span>
            </div>
            <div>
              <span className={labelClass}>Chefe do Projeto</span>
              <span className={valueClass}>{projeto.gp_responsavel || 'Não informado'}</span>
            </div>
            <div>
              <span className={labelClass}>Responsável Técnico</span>
              <span className={valueClass}>{projeto.responsavel_cwi || 'Não informado'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloco: Carteiras */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader className="pb-0">
          <CardTitle className={blocoTituloClass}>
            <FileText className={blocoIconClass} />
            Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-10">
          <div className={grid3Class}>
            <div>
              <span className={labelClass}>Carteira Primária</span>
              <span className={valueClass}>{projeto.area_responsavel || projeto.carteira_primaria || 'Não informado'}</span>
            </div>
            <div>
              <span className={labelClass}>Carteira Secundária</span>
              <span className={valueClass}>{projeto.carteira_secundaria || 'Não informado'}</span>
            </div>
            <div>
              <span className={labelClass}>Carteira Terciária</span>
              <span className={valueClass}>{projeto.carteira_terciaria || 'Não informado'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

