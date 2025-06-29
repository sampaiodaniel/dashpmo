import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Plus, Clock, User } from 'lucide-react';
import { useUltimoStatus } from '@/hooks/useUltimoStatus';
import { useUsuarios } from '@/hooks/useUsuarios';
import { formatarData } from '@/utils/dateFormatting';
import { useNavigate } from 'react-router-dom';

interface UltimoStatusResumoProps {
  projetoId: number;
}

export function UltimoStatusResumo({ projetoId }: UltimoStatusResumoProps) {
  const { data: ultimoStatus, isLoading } = useUltimoStatus(projetoId);
  const { data: usuarios } = useUsuarios();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-green-100 text-green-800';
      case 'Amarelo': return 'bg-yellow-100 text-yellow-800';
      case 'Vermelho': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusGeralColor = (status: string) => {
    switch (status) {
      case 'No Prazo': return 'bg-green-100 text-green-800';
      case 'Atrasado': return 'bg-red-100 text-red-800';
      case 'Pausado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiscoColor = (nivel: string) => {
    switch (nivel) {
      case 'Baixo': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Alto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const obterNomeUsuario = (identificador?: string | null) => {
    if (!identificador) return '-';

    // Se identificador é numérico, tentar encontrar por id
    const idNum = parseInt(identificador);
    if (!isNaN(idNum)) {
      const usuario = usuarios?.find(u => u.id === idNum);
      if (usuario) {
        const nomeCompleto = [usuario.perfil?.nome || usuario.nome, usuario.perfil?.sobrenome].filter(Boolean).join(' ');
        return nomeCompleto || usuario.nome;
      }
    }

    // Procurar por nome completo
    const usuarioFullName = usuarios?.find(u => {
      const fullName = [u.perfil?.nome || u.nome, u.perfil?.sobrenome].filter(Boolean).join(' ').toLowerCase();
      return fullName === identificador.toLowerCase();
    });
    if (usuarioFullName) {
      return [usuarioFullName.perfil?.nome || usuarioFullName.nome, usuarioFullName.perfil?.sobrenome].filter(Boolean).join(' ');
    }

    // Procurar por email
    const usuarioEmail = usuarios?.find(u => u.email && u.email.toLowerCase() === identificador.toLowerCase());
    if (usuarioEmail) {
      const nomeCompleto = [usuarioEmail.perfil?.nome || usuarioEmail.nome, usuarioEmail.perfil?.sobrenome].filter(Boolean).join(' ');
      return nomeCompleto || usuarioEmail.nome;
    }

    // Caso contrário, tentar encontrar por nome exato (usuarios.nome)
    const usuarioNome = usuarios?.find(u => u.nome.toLowerCase() === identificador.toLowerCase());
    if (usuarioNome) {
      const nomeCompleto = [usuarioNome.perfil?.nome || usuarioNome.nome, usuarioNome.perfil?.sobrenome].filter(Boolean).join(' ');
      return nomeCompleto;
    }

    // Tentar encontrar por tipo_usuario (Admin, GP, etc.)
    let usuarioTipo = usuarios?.find(u => u.tipo_usuario.toLowerCase() === identificador.toLowerCase());
    if (!usuarioTipo && identificador.toLowerCase()==='admin') {
      // pegar primeiro admin
      usuarioTipo = usuarios?.find(u=>u.tipo_usuario==='Admin');
    }
    if (usuarioTipo) {
      const nomeCompleto = [usuarioTipo.perfil?.nome || usuarioTipo.nome, usuarioTipo.perfil?.sobrenome].filter(Boolean).join(' ');
      return nomeCompleto;
    }

    // Se não encontrar, retornar identificador original (pode ser email ou tipo)
    return identificador;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            Carregando último status...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ultimoStatus) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pmo-primary" />
              Status do Projeto
            </CardTitle>
            <Button 
              onClick={() => navigate(`/novo-status?projeto=${projetoId}`)}
              size="sm"
              className="bg-pmo-primary hover:bg-pmo-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum status cadastrado</p>
            <p className="text-sm">Este projeto ainda não possui status reportado.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-pmo-primary" />
            Último Status Reportado
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate(`/status/${ultimoStatus.id}`)}
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
            <Button 
              onClick={() => navigate(`/novo-status?projeto=${projetoId}`)}
              size="sm"
              className="bg-pmo-primary hover:bg-pmo-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Status
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações básicas do status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 md:px-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1 text-left">Data Status</label>
            <div className="flex items-center gap-2 text-left">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-900">
                {formatarData(ultimoStatus.data_atualizacao)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Status Geral</label>
            <Badge className={`text-xs ${getStatusGeralColor(ultimoStatus.status_geral)}`}>
              {ultimoStatus.status_geral}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Visão do Chefe do Projeto</label>
            <Badge className={`text-xs ${getStatusColor(ultimoStatus.status_visao_gp)}`}>
              {ultimoStatus.status_visao_gp}
            </Badge>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Progresso Estimado</label>
            <span className="text-sm text-gray-900">
              {(ultimoStatus as any).progresso_estimado || 0}%
            </span>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Status de Revisão</label>
            <Badge variant={ultimoStatus.aprovado ? "default" : "secondary"} className="text-xs">
              {ultimoStatus.aprovado ? "Revisado" : "Pendente"}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Matriz de Risco</label>
            <Badge className={`text-xs ${getRiscoColor(ultimoStatus.prob_x_impact)}`}>
              {ultimoStatus.prob_x_impact ?? '-'}
            </Badge>
          </div>
        </div>

        {/* Realizado na Semana */}
        {ultimoStatus.realizado_semana_atual && (
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Realizado na Semana</label>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                {ultimoStatus.realizado_semana_atual}
              </p>
            </div>
          </div>
        )}

        {/* Entregas Reportadas */}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Número de Entregas Reportadas</label>
          <span className="text-sm text-gray-900">
            {ultimoStatus.entregas_status?.length ?? 0}
          </span>
        </div>

        {/* Informações do responsável */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-gray-500 pt-4 border-t border-gray-200 gap-1">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>Reportado por: {obterNomeUsuario(ultimoStatus.criado_por as unknown as string)}</span>
          </div>
          {ultimoStatus.aprovado && (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>Revisado por: {obterNomeUsuario(ultimoStatus.aprovado_por as unknown as string)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 