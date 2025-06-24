import { useStatusEntrega } from "@/hooks/useStatusEntrega";

interface StatusEntregaBadgeProps {
  statusId?: number | null;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusEntregaBadge({ statusId, showText = true, size = 'md' }: StatusEntregaBadgeProps) {
  const { statusEntrega } = useStatusEntrega();

  if (!statusId) {
    return showText ? (
      <span className="text-gray-400 text-sm">Sem status</span>
    ) : null;
  }

  const status = statusEntrega.find(s => s.id === statusId);

  if (!status) {
    return showText ? (
      <span className="text-gray-400 text-sm">Status não encontrado</span>
    ) : null;
  }

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-2'
  };

  return (
    <div className={`flex items-center ${gapClasses[size]}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full border border-gray-300 flex-shrink-0`}
        style={{ backgroundColor: status.cor }}
        title={status.descricao || status.nome}
      />
      {showText && (
        <span className={`${textSizeClasses[size]} text-gray-700`}>
          {status.nome}
        </span>
      )}
    </div>
  );
} 