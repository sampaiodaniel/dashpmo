
import './index.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
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
import Licoes from '@/pages/Licoes';
import Incidentes from '@/pages/Incidentes';
import Relatorios from '@/pages/Relatorios';
import Aprovacoes from '@/pages/Aprovacoes';
import Administracao from '@/pages/Administracao';
import Configuracoes from '@/pages/Configuracoes';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota inicial que inclui verificação de autenticação */}
            <Route path="/" element={<Index />} />
            
            {/* Todas as outras rotas sem Layout duplicado */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/projetos/:id" element={<ProjetoDetalhes />} />
            <Route path="/status" element={<Status />} />
            <Route path="/status/:id" element={<StatusDetalhes />} />
            <Route path="/status/:id/editar" element={<EditarStatus />} />
            <Route path="/status/novo" element={<NovoStatus />} />
            <Route path="/mudancas" element={<Mudancas />} />
            <Route path="/licoes" element={<Licoes />} />
            <Route path="/incidentes" element={<Incidentes />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/aprovacoes" element={<Aprovacoes />} />
            <Route path="/admin" element={<Administracao />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
