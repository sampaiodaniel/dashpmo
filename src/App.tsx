
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/hooks/useAuth';
import Index from "./pages/Index";
import Projetos from "./pages/Projetos";
import Status from "./pages/Status";
import NovoStatus from "./pages/NovoStatus";
import Aprovacoes from "./pages/Aprovacoes";
import Relatorios from "./pages/Relatorios";
import Mudancas from "./pages/Mudancas";
import Licoes from "./pages/Licoes";
import Incidentes from "./pages/Incidentes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/status" element={<Status />} />
            <Route path="/status/novo" element={<NovoStatus />} />
            <Route path="/aprovacoes" element={<Aprovacoes />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/mudancas" element={<Mudancas />} />
            <Route path="/licoes" element={<Licoes />} />
            <Route path="/incidentes" element={<Incidentes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
