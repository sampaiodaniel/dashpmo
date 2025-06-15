
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createTestChangeRequests } from '@/utils/seedTestData';
import { toast } from '@/hooks/use-toast';

export function SeedTestData() {
  const [loading, setLoading] = useState(false);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await createTestChangeRequests();
      toast({
        title: "Dados de teste criados",
        description: "10 mudanças de replanejamento foram criadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar dados de teste",
        description: "Ocorreu um erro ao criar as mudanças de teste",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Dados de Teste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-pmo-gray">
            Criar dados de teste para desenvolvimento e demonstração.
          </p>
          <Button 
            onClick={handleSeedData}
            disabled={loading}
            className="bg-pmo-primary hover:bg-pmo-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Criar 10 Mudanças de Teste
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
