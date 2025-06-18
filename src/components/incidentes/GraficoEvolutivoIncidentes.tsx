import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIncidentes } from '@/hooks/useIncidentes';
import { useMemo } from 'react';

interface GraficoEvolutivoIncidentesProps {
  carteiraFiltro: string;
  responsavelFiltro: string;
}

export function GraficoEvolutivoIncidentes({ carteiraFiltro, responsavelFiltro }: GraficoEvolutivoIncidentesProps) {
  const { data: incidentes, isLoading } = useIncidentes();

  const dadosGrafico = useMemo(() => {
    if (!incidentes) return [];

    // Filter data based on carteira and responsavel filters
    let dadosFiltrados = incidentes;
    
    if (carteiraFiltro !== 'todas') {
      dadosFiltrados = dadosFiltrados.filter(inc => inc.carteira === carteiraFiltro);
    }

    // For responsavel filter, you might need to add logic based on your data structure
    // This is a placeholder - adjust according to your actual data model
    if (responsavelFiltro !== 'todos') {
      // Add responsavel filtering logic here when the data structure supports it
    }

    return dadosFiltrados.map(inc => ({
      carteira: inc.carteira,
      entrada: inc.entrada || 0,
      saida: inc.saida || 0,
      atual: inc.atual || 0,
      criticos: inc.criticos || 0
    }));
  }, [incidentes, carteiraFiltro, responsavelFiltro]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-pmo-gray">Carregando dados...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Incidentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="carteira" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entrada" stackId="a" fill="#3b82f6" name="Entrada" />
              <Bar dataKey="atual" stackId="a" fill="#f59e0b" name="Atual" />
              <Bar dataKey="saida" stackId="a" fill="#10b981" name="Saída" />
              <Bar dataKey="criticos" fill="#ef4444" name="Críticos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
