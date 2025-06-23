
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para converter data string sem timezone
export function criarDataSemTimezone(dataString: string): Date {
  if (!dataString) return new Date();
  
  // Se for no formato YYYY-MM-DD, criar Date manualmente
  if (dataString.includes('-') && !dataString.includes('T')) {
    const [year, month, day] = dataString.split('-').map(Number);
    return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11
  }
  
  // Para outros formatos, usar Date normal
  return new Date(dataString);
}

// Função para formatar datas - suporta string 'TBD' e datas
export function formatarData(data: any): string {
  if (!data) return 'TBD (A definir)';
  
  if (data === 'TBD') return 'TBD (A definir)';
  
  // Se for string no formato YYYY-MM-DD, criar Date usando partes separadas
  if (typeof data === 'string' && data.includes('-')) {
    const [year, month, day] = data.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  }
  
  // Se for objeto Date
  if (data instanceof Date) {
    return format(data, 'dd/MM/yyyy', { locale: ptBR });
  }
  
  return 'TBD (A definir)';
}
