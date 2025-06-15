
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
import NotFound from '@/pages/NotFound';
import { Layout } from '@/components/layout/Layout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota inicial que inclui verificação de autenticação */}
            <Route path="/" element={<Index />} />
            
            {/* Todas as outras rotas com Layout */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/projetos" element={<Layout><Projetos /></Layout>} />
            <Route path="/projetos/:id" element={<Layout><ProjetoDetalhes /></Layout>} />
            <Route path="/status" element={<Layout><Status /></Layout>} />
            <Route path="/status/:id" element={<Layout><StatusDetalhes /></Layout>} />
            <Route path="/status/:id/editar" element={<Layout><EditarStatus /></Layout>} />
            <Route path="/status/novo" element={<Layout><NovoStatus /></Layout>} />
            <Route path="/mudancas" element={<Layout><Mudancas /></Layout>} />
            <Route path="/licoes" element={<Layout><Licoes /></Layout>} />
            <Route path="/incidentes" element={<Layout><Incidentes /></Layout>} />
            <Route path="/relatorios" element={<Layout><Relatorios /></Layout>} />
            <Route path="/aprovacoes" element={<Layout><Aprovacoes /></Layout>} />
            <Route path="/admin" element={<Layout><Administracao /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
