
export function getStatusVisaoColor(visao: string): string {
  switch (visao?.toLowerCase()) {
    case 'verde':
      return 'bg-green-500';
    case 'amarelo':
      return 'bg-yellow-500';
    case 'vermelho':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
