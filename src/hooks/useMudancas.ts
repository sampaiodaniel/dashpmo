
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useMudancas() {
  const [isLoading, setIsLoading] = useState(false);

  const criarMudanca = async () => {
    setIsLoading(true);
    
    try {
      // Simular criação de mudança
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Sucesso",
        description: "Nova mudança criada com sucesso!",
      });
      
      console.log('Criando nova mudança');
      
    } catch (error) {
      console.error('Erro ao criar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar mudança",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    criarMudanca,
    isLoading,
  };
}
