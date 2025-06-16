
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/useAuth';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Projetos from '@/pages/Projetos';
import ProjetoDetalhes from '@/pages/ProjetoDetalhes';
import Status from '@/pages/Status';
import StatusDetalhes from '@/pages/StatusDetalhes';
import NovoStatus from '@/pages/NovoStatus';
import EditarStatus from '@/pages/EditarStatus';
import Mudancas from '@/pages/Mudancas';
import MudancaDetalhes from '@/pages/MudancaDetalhes';
import EditarMudanca from '@/pages/EditarMudanca';
import Licoes from '@/pages/Licoes';
import LicaoDetalhes from '@/pages/LicaoDetalhes';
import Incidentes from '@/pages/Incidentes';
import Relatorios from '@/pages/Relatorios';
import Aprovacoes from '@/pages/Aprovacoes';
import Configuracoes from '@/pages/Configuracoes';
import Administracao from '@/pages/Administracao';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="pmo-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projetos" element={<Projetos />} />
              <Route path="/projetos/:id" element={<ProjetoDetalhes />} />
              <Route path="/status" element={<Status />} />
              <Route path="/status/:id" element={<StatusDetalhes />} />
              <Route path="/status/novo" element={<NovoStatus />} />
              <Route path="/status/:id/editar" element={<EditarStatus />} />
              <Route path="/mudancas" element={<Mudancas />} />
              <Route path="/mudancas/:id" element={<MudancaDetalhes />} />
              <Route path="/mudancas/:id/editar" element={<EditarMudanca />} />
              <Route path="/licoes" element={<Licoes />} />
              <Route path="/licoes/:id" element={<LicaoDetalhes />} />
              <Route path="/incidentes" element={<Incidentes />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/aprovacoes" element={<Aprovacoes />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/administracao" element={<Administracao />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
