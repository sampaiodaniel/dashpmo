
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
    <div className="space-y-4">
      {status.map((statusItem) => (
        <div key={statusItem.id} className="bg-white rounded-lg shadow-sm border p-6">
          <StatusCard status={statusItem} />
        </div>
      ))}
    </div>
  );
}
