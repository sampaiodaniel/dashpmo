
import { StatusCard } from './StatusCard';
import { StatusProjeto } from '@/types/pmo';

interface StatusListProps {
  status: StatusProjeto[];
  onStatusUpdate: () => void;
}

export function StatusList({ status, onStatusUpdate }: StatusListProps) {
  return (
    <div className="space-y-0">
      {status.map((item) => (
        <StatusCard 
          key={item.id} 
          status={item}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
}
