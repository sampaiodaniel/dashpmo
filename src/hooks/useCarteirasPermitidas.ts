import { useAuth } from './useAuth';

// Retorna as carteiras às quais o usuário logado tem acesso.
// Admin recebe array vazio → significa acesso irrestrito.
export function useCarteirasPermitidas(): string[] {
  const { usuario, isAdmin } = useAuth();
  return isAdmin() ? [] : (usuario?.areas_atuacao || []);
} 