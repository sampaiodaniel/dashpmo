
import { StatusProjeto } from '@/types/pmo';
import { StatusCard } from './StatusCard';

interface StatusListProps {
  status: StatusProjeto[];
  onStatusUpdate: () => void;
}

export function StatusList({ status, onStatusUpdate }: StatusListProps) {
  if (!status || status.length === 0) {
    return <div className="text-center py-4">Nenhum status encontrado.</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {status.map((statusItem) => (
        <StatusCard key={statusItem.id} status={statusItem} />
      ))}
    </div>
  );
}
