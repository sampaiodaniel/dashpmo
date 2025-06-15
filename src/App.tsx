
import './index.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Projetos from '@/pages/Projetos';
import ProjetoDetalhes from '@/pages/ProjetoDetalhes';
import Status from '@/pages/Status';
import StatusDetalhes from '@/pages/StatusDetalhes';
import NovoStatus from '@/pages/NovoStatus';
import Mudancas from '@/pages/Mudancas';
import Licoes from '@/pages/Licoes';
import Incidentes from '@/pages/Incidentes';
import Relatorios from '@/pages/Relatorios';
import Aprovacoes from '@/pages/Aprovacoes';
import Administracao from '@/pages/Administracao';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/projetos/:id" element={<ProjetoDetalhes />} />
          <Route path="/status" element={<Status />} />
          <Route path="/status/:id" element={<StatusDetalhes />} />
          <Route path="/status/novo" element={<NovoStatus />} />
          <Route path="/mudancas" element={<Mudancas />} />
          <Route path="/licoes" element={<Licoes />} />
          <Route path="/incidentes" element={<Incidentes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/aprovacoes" element={<Aprovacoes />} />
          <Route path="/admin" element={<Administracao />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
