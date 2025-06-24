import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';

interface StatusEntregaDiagnosticoProps {
  statusId: number;
  entregas: Array<{
    id: string;
    nome: string;
    statusEntregaId: number | null;
  }>;
}

export function StatusEntregaDiagnostico({ statusId, entregas }: StatusEntregaDiagnosticoProps) {
  const [diagnostico, setDiagnostico] = useState<{
    camposExistemNoBanco: boolean;
    dadosNoBanco: any;
    dadosNoCache: Record<string, number>;
    inconsistencias: string[];
    carregando: boolean;
  }>({
    camposExistemNoBanco: false,
    dadosNoBanco: null,
    dadosNoCache: {},
    inconsistencias: [],
    carregando: true
  });

  const { statusEntrega, carregarStatusCache } = useStatusEntrega();

  const executarDiagnostico = async () => {
    setDiagnostico(prev => ({ ...prev, carregando: true }));
    
    try {
      const inconsistencias: string[] = [];
      
      // 1. Verificar se campos existem no banco
      console.log('🔍 Verificando campos no banco...');
      let camposExistemNoBanco = false;
      let dadosNoBanco = null;
      
      try {
        const { data, error } = await supabase
          .from('status_projeto')
          .select('id, status_entrega1_id, status_entrega2_id, status_entrega3_id')
          .eq('id', statusId)
          .single();
        
        if (!error && data) {
          camposExistemNoBanco = true;
          dadosNoBanco = data;
          console.log('✅ Campos existem no banco:', data);
        } else if (error?.message?.includes('column') && error.message.includes('does not exist')) {
          console.log('❌ Campos não existem no banco');
          camposExistemNoBanco = false;
        }
      } catch (err) {
        console.log('❌ Erro ao verificar campos:', err);
        inconsistencias.push('Erro ao verificar campos no banco de dados');
      }

      // 2. Carregar dados do cache
      const dadosNoCache = carregarStatusCache(statusId);
      console.log('💾 Dados do cache:', dadosNoCache);

      // 3. Verificar consistência entre entregas locais e dados salvos
      entregas.forEach((entrega, index) => {
        const numeroEntrega = index + 1;
        
        if (numeroEntrega <= 3) {
          // Verificar entregas principais
          const statusNoBanco = dadosNoBanco?.[`status_entrega${numeroEntrega}_id`];
          const statusNoCache = dadosNoCache[`entrega${numeroEntrega}`];
          const statusLocal = entrega.statusEntregaId;
          
          if (camposExistemNoBanco) {
            if (statusLocal !== statusNoBanco) {
              inconsistencias.push(
                `Entrega ${numeroEntrega}: Status local (${statusLocal}) difere do banco (${statusNoBanco})`
              );
            }
          } else {
            if (statusLocal !== statusNoCache) {
              inconsistencias.push(
                `Entrega ${numeroEntrega}: Status local (${statusLocal}) difere do cache (${statusNoCache})`
              );
            }
          }
        }
        
        // Verificar se status existe na lista de status configurados
        if (entrega.statusEntregaId) {
          const statusExiste = statusEntrega.find(s => s.id === entrega.statusEntregaId);
          if (!statusExiste) {
            inconsistencias.push(
              `Entrega ${numeroEntrega}: Status ID ${entrega.statusEntregaId} não existe na configuração`
            );
          }
        }
      });

      setDiagnostico({
        camposExistemNoBanco,
        dadosNoBanco,
        dadosNoCache,
        inconsistencias,
        carregando: false
      });

    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      setDiagnostico(prev => ({
        ...prev,
        inconsistencias: ['Erro crítico no diagnóstico'],
        carregando: false
      }));
    }
  };

  useEffect(() => {
    if (statusEntrega.length > 0) {
      executarDiagnostico();
    }
  }, [statusId, entregas, statusEntrega]);

  if (diagnostico.carregando) {
    return (
      <Alert>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Verificando integridade dos dados...
        </AlertDescription>
      </Alert>
    );
  }

  const temInconsistencias = diagnostico.inconsistencias.length > 0;
  const icon = temInconsistencias ? XCircle : CheckCircle;
  const alertClass = temInconsistencias ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50";
  const iconClass = temInconsistencias ? "text-red-600" : "text-green-600";
  const textClass = temInconsistencias ? "text-red-800" : "text-green-800";

  return (
    <Alert className={alertClass}>
      {React.createElement(icon, { className: `h-4 w-4 ${iconClass}` })}
      <AlertDescription className={textClass}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <strong>Diagnóstico de Integridade:</strong>
            <Badge variant={temInconsistencias ? "destructive" : "secondary"}>
              {temInconsistencias ? "Inconsistências Detectadas" : "Dados Íntegros"}
            </Badge>
          </div>
          
          <div className="text-xs space-y-1">
            <div>
              Campos no banco: {' '}
              <Badge variant={diagnostico.camposExistemNoBanco ? "secondary" : "outline"}>
                {diagnostico.camposExistemNoBanco ? "Existem" : "Não existem"}
              </Badge>
            </div>
            
            <div>
              Dados no cache: {' '}
              <Badge variant={Object.keys(diagnostico.dadosNoCache).length > 0 ? "secondary" : "outline"}>
                {Object.keys(diagnostico.dadosNoCache).length} entradas
              </Badge>
            </div>
          </div>

          {temInconsistencias && (
            <div className="mt-2">
              <strong>Problemas encontrados:</strong>
              <ul className="list-disc list-inside text-xs mt-1">
                {diagnostico.inconsistencias.map((problema, index) => (
                  <li key={index}>{problema}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={executarDiagnostico}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reexecutar
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
} 