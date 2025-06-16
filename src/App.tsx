
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projetos";
import ProjetoDetalhes from "./pages/ProjetoDetalhes";
import Status from "./pages/Status";
import StatusDetalhes from "./pages/StatusDetalhes";
import NovoStatus from "./pages/NovoStatus";
import EditarStatus from "./pages/EditarStatus";
import Mudancas from "./pages/Mudancas";
import MudancaDetalhes from "./pages/MudancaDetalhes";
import EditarMudanca from "./pages/EditarMudanca";
import Licoes from "./pages/Licoes";
import LicaoDetalhes from "./pages/LicaoDetalhes";
import Incidentes from "./pages/Incidentes";
import Relatorios from "./pages/Relatorios";
import Administracao from "./pages/Administracao";
import Aprovacoes from "./pages/Aprovacoes";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/projetos/:id" element={<ProjetoDetalhes />} />
            <Route path="/status" element={<Status />} />
            <Route path="/status/:id" element={<StatusDetalhes />} />
            <Route path="/status/novo" element={<NovoStatus />} />
            <Route path="/status/editar/:id" element={<EditarStatus />} />
            <Route path="/mudancas" element={<Mudancas />} />
            <Route path="/mudancas/:id" element={<MudancaDetalhes />} />
            <Route path="/mudancas/editar/:id" element={<EditarMudanca />} />
            <Route path="/licoes" element={<Licoes />} />
            <Route path="/licoes/:id" element={<LicaoDetalhes />} />
            <Route path="/incidentes" element={<Incidentes />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/admin" element={<Administracao />} />
            <Route path="/aprovacoes" element={<Aprovacoes />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
