import { lazy } from 'react';

// Lazy loading para componentes pesados de relatórios
export const LazyRelatorioASAViewer = lazy(() => 
  import('@/components/relatorios/RelatorioASAViewer').then(module => ({
    default: module.RelatorioASAViewer
  }))
);

export const LazyRelatorioVisualViewer = lazy(() => 
  import('@/components/relatorios/RelatorioVisualViewer').then(module => ({
    default: module.RelatorioVisualViewer
  }))
);

// Lazy loading para páginas de relatórios
export const LazyRelatorioCompartilhado = lazy(() => 
  import('@/pages/RelatorioCompartilhado')
);

export const LazyRelatorioVisualPagina = lazy(() => 
  import('@/pages/RelatorioVisualPagina')
);

export const LazyRelatorioVisualMobile = lazy(() => 
  import('@/pages/RelatorioVisualMobile')
);

// Lazy loading para componentes de gráficos pesados
export const LazyGraficoEvolutivoIncidentes = lazy(() => 
  import('@/components/incidentes/GraficoEvolutivoIncidentes').then(module => ({
    default: module.GraficoEvolutivoIncidentes
  }))
);

export const LazyGraficoEvolutivoIncidentesRelatorio = lazy(() => 
  import('@/components/relatorios/asa/GraficoEvolutivoIncidentesRelatorio').then(module => ({
    default: module.GraficoEvolutivoIncidentesRelatorio
  }))
);

// Lazy loading para componentes de administração
export const LazyAdministracao = lazy(() => 
  import('@/pages/Administracao')
);

// Utilitário para pré-carregar componentes críticos
export const preloadCriticalComponents = () => {
  // Pré-carregar componentes que provavelmente serão usados
  import('@/components/dashboard/StatusChart');
  import('@/components/dashboard/DashboardChartsSection');
};

// Utilitário para carregar componentes sob demanda
export const loadComponentOnDemand = async (componentName: string) => {
  try {
    switch (componentName) {
      case 'relatorio-asa':
        return await import('@/components/relatorios/RelatorioASAViewer');
      case 'relatorio-visual':
        return await import('@/components/relatorios/RelatorioVisualViewer');
      case 'grafico-incidentes':
        return await import('@/components/incidentes/GraficoEvolutivoIncidentes');
      case 'administracao':
        return await import('@/pages/Administracao');
      default:
        throw new Error(`Componente ${componentName} não encontrado`);
    }
  } catch (error) {
    console.error(`Erro ao carregar componente ${componentName}:`, error);
    throw error;
  }
}; 