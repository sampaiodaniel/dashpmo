import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';

interface StatusEntregaBadgeProps {
  statusId: number | null;
  statusNome?: string;
  statusCor?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export function StatusEntregaBadge({ 
  statusId, 
  statusNome, 
  statusCor, 
  size = 'md',
  showDot = true 
}: StatusEntregaBadgeProps) {
  const { statusEntrega } = useStatusEntrega();

  // Se não tem statusId, não mostrar nada
  if (!statusId) {
    return null;
  }

  // Buscar dados do status se não foram fornecidos
  let nome = statusNome;
  let cor = statusCor;

  if (!nome || !cor) {
    const status = statusEntrega.find(s => s.id === statusId);
    if (!status) {
      return (
        <Badge variant="outline" className="text-gray-500">
          Status não encontrado
        </Badge>
      );
    }
    nome = status.nome;
    cor = status.cor;
  }

  // Definir tamanhos
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5', 
    lg: 'w-3 h-3'
  };

  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} border`}
      style={{ 
        backgroundColor: `${cor}20`, 
        borderColor: cor,
        color: cor 
      }}
    >
      {showDot && (
        <div 
          className={`${dotSizes[size]} rounded-full`}
          style={{ backgroundColor: cor }}
        />
      )}
      <span className="font-medium">{nome}</span>
    </Badge>
  );
} 