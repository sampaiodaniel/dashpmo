import { Building } from 'lucide-react';

export interface CarteiraInfo {
  nome: string;
  icon: string;
  emoji: string;
}

// Função para obter o ícone e emoji específico de cada carteira
export const getCarteiraInfo = (carteira: string): CarteiraInfo => {
  switch (carteira) {
    case 'Cadastro':
      return { nome: carteira, icon: '👤', emoji: '👤' };
    case 'Canais':
      return { nome: carteira, icon: '📱', emoji: '📱' };
    case 'Core Bancário':
      return { nome: carteira, icon: '🏦', emoji: '🏦' };
    case 'Crédito':
      return { nome: carteira, icon: '💳', emoji: '💳' };
    case 'Cripto':
      return { nome: carteira, icon: '₿', emoji: '₿' };
    case 'Empréstimos':
      return { nome: carteira, icon: '💰', emoji: '💰' };
    case 'Fila Rápida':
      return { nome: carteira, icon: '⚡', emoji: '⚡' };
    case 'Investimentos 1':
      return { nome: carteira, icon: '📈', emoji: '📈' };
    case 'Investimentos 2':
      return { nome: carteira, icon: '📊', emoji: '📊' };
    case 'Onboarding':
      return { nome: carteira, icon: '🚀', emoji: '🚀' };
    case 'Open Finance':
      return { nome: carteira, icon: '🔗', emoji: '🔗' };
    default:
      return { nome: carteira, icon: '📁', emoji: '📁' };
  }
};

// Função para obter classes CSS específicas para cada carteira
export const getCarteiraBadgeClasses = (carteira: string): string => {
  switch (carteira) {
    case 'Cadastro':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Canais':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Core Bancário':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    case 'Crédito':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'Cripto':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Empréstimos':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Fila Rápida':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Investimentos 1':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Investimentos 2':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'Onboarding':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Open Finance':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

// Interface para o projeto com carteiras
export interface ProjetoComCarteiras {
  area_responsavel?: string;
  carteira_primaria?: string | null;
  carteira_secundaria?: string | null;
  carteira_terciaria?: string | null;
}

// Função para obter todas as carteiras de um projeto em ordem (primária, secundária, terciária)
export const getTodasCarteiras = (projeto: ProjetoComCarteiras): string[] => {
  const carteiras: string[] = [];
  
  // Carteira Primária (ou area_responsavel como fallback)
  const primaria = projeto.carteira_primaria || projeto.area_responsavel;
  if (primaria) {
    carteiras.push(primaria);
  }
  
  // Carteira Secundária
  if (projeto.carteira_secundaria && projeto.carteira_secundaria !== 'none') {
    carteiras.push(projeto.carteira_secundaria);
  }
  
  // Carteira Terciária
  if (projeto.carteira_terciaria && projeto.carteira_terciaria !== 'none') {
    carteiras.push(projeto.carteira_terciaria);
  }
  
  return carteiras;
}; 