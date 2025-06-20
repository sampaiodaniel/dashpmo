import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll para o topo quando a rota mudar
    window.scrollTo(0, 0);
  }, [pathname]);
} 