
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePagination } from '@/hooks/usePagination';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { useState } from 'react';

export default function Licoes() {
  const { usuario, isLoading } = useAuth();
  const [termoBusca, setTermoBusca] = useState('');

  // Mock data for now - will be replaced with real data later
  const mockLicoes: any[] = [];

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    startItem,
    endItem
  } = usePagination({
    data: mockLicoes,
    itemsPerPage: 20
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">Lições Aprendidas</h1>
            <p className="text-pmo-gray mt-2">Base de conhecimento e boas práticas</p>
          </div>
          <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Lição
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pmo-gray" />
            <Input 
              placeholder="Buscar lições..." 
              className="pl-10" 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-pmo-success">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-5 w-5" />
                Boas Práticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-success">12</div>
              <p className="text-sm text-pmo-gray">Lições registradas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-warning">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-5 w-5" />
                Pontos de Atenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-warning">8</div>
              <p className="text-sm text-pmo-gray">Alertas importantes</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-5 w-5" />
                Total de Lições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">20</div>
              <p className="text-sm text-pmo-gray">Na base de conhecimento</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Base de Conhecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-pmo-gray">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Nenhuma lição encontrada</p>
              <p className="text-sm">Comece compartilhando conhecimentos e experiências</p>
            </div>
          </CardContent>
        </Card>

        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          startItem={startItem}
          endItem={endItem}
          totalItems={totalItems}
        />
      </div>
    </Layout>
  );
}
