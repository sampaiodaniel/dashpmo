
import { StatusCard } from './StatusCard';
import { StatusProjeto } from '@/types/pmo';

interface StatusListProps {
  status: StatusProjeto[];
  onStatusUpdate: () => void;
}

export function StatusList({ status, onStatusUpdate }: StatusListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border divide-y">
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
