
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Plus } from 'lucide-react';
import { getStatusColor, getStatusGeralColor, Projeto } from '@/types/pmo';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProjetoStatusProps {
  projeto: Projeto;
}

export function ProjetoStatus({ projeto }: ProjetoStatusProps) {
  const navigate = useNavigate();
  
  console.log('🔍 ProjetoStatus - projeto:', projeto?.nome_projeto);
  
  // Buscar o último status, mesmo que não revisado
  const { data: ultimoStatus } = useQuery({
    queryKey: ['ultimo-status', projeto.id],
    queryFn: async () => {
      console.log('🔍 ProjetoStatus - Buscando último status para projeto:', projeto.id);
      const { data, error } = await supabase
        .from('status_projeto')
        .select('*')
        .eq('projeto_id', projeto.id)
        .order('data_atualizacao', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar último status:', error);
        return null;
      }

      if (!data) return null;

      console.log('🔍 ProjetoStatus - Último status encontrado:', data.id);
      return {
        ...data,
        data_atualizacao: new Date(data.data_atualizacao),
        data_criacao: new Date(data.data_criacao),
        data_marco1: data.data_marco1 ? new Date(data.data_marco1) : undefined,
        data_marco2: data.data_marco2 ? new Date(data.data_marco2) : undefined,
        data_marco3: data.data_marco3 ? new Date(data.data_marco3) : undefined,
        data_aprovacao: data.data_aprovacao ? new Date(data.data_aprovacao) : undefined,
      };
    },
  });

  console.log('🔍 ProjetoStatus - ultimoStatus:', ultimoStatus?.id);

  if (!ultimoStatus) {
    console.log('🔍 ProjetoStatus - Sem último status, retornando null');
    return null;
  }

  const handleVerDetalhes = () => {
    navigate(`/status/${ultimoStatus.id}`);
  };

  const handleNovoStatus = () => {
    navigate(`/novo-status?projeto=${projeto.id}`);
  };

  // Função para formatar texto com quebras de linha em bullets
  const formatarComoBullets = (texto: string) => {
    return texto.split('\n').filter(linha => linha.trim()).map((linha, index) => (
      <li key={index} className="text-gray-700">{linha.trim()}</li>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-pmo-primary" />
          <h2 className="text-2xl font-normal text-gray-700">Último Status</h2>
          <Badge 
            className={`text-xs ${
              ultimoStatus.aprovado 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {ultimoStatus.aprovado ? "Revisado" : "Em Revisão"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleVerDetalhes}
            className="bg-pmo-primary hover:bg-pmo-secondary text-white flex items-center gap-2"
            size="sm"
          >
            <ExternalLink className="h-4 w-4" />
            Ver detalhes
          </Button>
          <Button 
            onClick={handleNovoStatus}
            className="bg-pmo-primary hover:bg-pmo-secondary text-white flex items-center gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Novo Status
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-pmo-gray mb-3">Status Geral</h3>
          <Badge className={getStatusGeralColor(ultimoStatus.status_geral)}>
            {ultimoStatus.status_geral}
          </Badge>
        </div>
        
        <div>
          <h3 className="font-medium text-pmo-gray mb-3">Visão Chefe do Projeto</h3>
          <Badge className={getStatusColor(ultimoStatus.status_visao_gp)}>
            {ultimoStatus.status_visao_gp}
          </Badge>
        </div>

        <div>
          <h3 className="font-medium text-pmo-gray mb-3">Progresso Estimado</h3>
          <p className="text-gray-700">
            {ultimoStatus.progresso_estimado || 0}%
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-pmo-gray mb-3">Atualizado em</h3>
          <p className="text-gray-700">
            {ultimoStatus.data_atualizacao.toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {ultimoStatus.realizado_semana_atual && (
        <div className="mt-6 text-left">
          <h3 className="font-medium text-pmo-gray mb-2 text-left">Realizado na Semana</h3>
          <ul className="list-disc list-inside space-y-1 text-left">
            {formatarComoBullets(ultimoStatus.realizado_semana_atual)}
          </ul>
        </div>
      )}
    </div>
  );
}
