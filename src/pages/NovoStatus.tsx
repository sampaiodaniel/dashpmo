
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function NovoStatus() {
  const { usuario, isLoading } = useAuth();

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
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Novo Status</h1>
          <p className="text-pmo-gray mt-2">Cadastrar atualização de status do projeto</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Atualização de Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projeto">Projeto</Label>
              <Input id="projeto" placeholder="Selecione o projeto..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input id="status" placeholder="Status atual do projeto..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progresso">Progresso (%)</Label>
              <Input id="progresso" type="number" placeholder="0" min="0" max="100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" placeholder="Descreva as atividades realizadas..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impedimentos">Impedimentos</Label>
              <Textarea id="impedimentos" placeholder="Descreva os impedimentos encontrados..." rows={3} />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Salvar Status
              </Button>
              <Button variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
