import { TimelineEntregasContainerImpressao } from './timeline/TimelineEntregasContainerImpressao';

interface TimelineEntregasImpressaoProps {
  projetos: any[];
}

// Wrapper simples para usar container de impressão
export function TimelineEntregasImpressao({ projetos }: TimelineEntregasImpressaoProps) {
  return <TimelineEntregasContainerImpressao projetos={projetos} />;
} 