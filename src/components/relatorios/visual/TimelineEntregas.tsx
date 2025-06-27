
import { TimelineEntregasContainer } from './timeline/TimelineEntregasContainer';

interface TimelineEntregasProps {
  projetos: any[];
  forceMobile?: boolean;
}

export function TimelineEntregas({ projetos, forceMobile = false }: TimelineEntregasProps) {
  return (
    <TimelineEntregasContainer 
      projetos={projetos} 
      forceMobile={forceMobile} 
    />
  );
}
