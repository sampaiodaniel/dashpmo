
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { cleanupPersistentCanaisIncidents, forceDeleteAllCanaisRecords } from '@/utils/cleanupCanaisIncidents';
import { toast } from '@/hooks/use-toast';

export function CleanupCanaisIncidents() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ deleted: number; remaining: number } | null>(null);

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      const result = await cleanupPersistentCanaisIncidents();
      setLastResult(result);
      toast({
        title: "Limpeza concluída",
        description: `${result.deleted} registros de Canais foram removidos. ${result.remaining} restantes.`,
      });
    } catch (error) {
      console.error('Erro na limpeza:', error);
      toast({
        title: "Erro",
        description: "Erro ao limpar registros de Canais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceDelete = async () => {
    setIsLoading(true);
    try {
      await forceDeleteAllCanaisRecords();
      toast({
        title: "Deleção forçada concluída",
        description: "Todos os registros de Canais foram forçadamente removidos.",
      });
      setLastResult({ deleted: 0, remaining: 0 });
    } catch (error) {
      console.error('Erro na deleção forçada:', error);
      toast({
        title: "Erro",
        description: "Erro na deleção forçada de registros de Canais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Limpeza de Registros Persistentes - Canais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Esta ferramenta remove registros de incidentes da carteira "Canais" que estão persistindo no banco de dados.
        </p>
        
        {lastResult && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <strong>Último resultado:</strong> {lastResult.deleted} registros removidos, {lastResult.remaining} restantes
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={handleCleanup}
            disabled={isLoading}
            variant="outline"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isLoading ? 'Limpando...' : 'Limpar Registros Canais'}
          </Button>
          
          <Button 
            onClick={handleForceDelete}
            disabled={isLoading}
            variant="destructive"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {isLoading ? 'Forçando...' : 'Deleção Forçada'}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Use "Deleção Forçada" apenas se a limpeza normal não funcionar.
        </p>
      </CardContent>
    </Card>
  );
}
