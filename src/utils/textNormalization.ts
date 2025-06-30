export function normalizeText(text?: string | null): string {
  if (!text) return '';
  // Remove acentos e converte para minúsculas
  return text
    .normalize('NFD') // Decompõe caracteres acentuados em base + diacrítico
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
    .toLowerCase();
} 