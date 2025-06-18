
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIncidentesHistorico } from '@/hooks/useIncidentesHistorico';
import { useMemo } from 'react';

interface GraficoEvolutivoIncidentesProps {
  carteiraFiltro: string;
  responsavelFiltro: string;
}

export function GraficoEvolutivoIncidentes({ carteiraFiltro, responsavelFiltro }: GraficoEvolutivoIncidentesProps) {
  const { data: historico, isLoading } = useIncidentesHistorico();

  const dadosGrafico = useMemo(() => {
    if (!historico) return [];

    // Filter data based on carteira filter
    let dadosFiltrados = historico;
    
    if (carteiraFiltro !== 'todas') {
      dadosFiltrados = dadosFiltrados.filter(inc => inc.carteira === carteiraFiltro);
    }

    // Group by date and aggregate data
    const dadosAgrupados = dadosFiltrados.reduce((acc, item) => {
      const data = item.data_registro;
      if (!acc[data]) {
        acc[data] = {
          data,
          entrada: 0,
          saida: 0,
          atual: 0,
          criticos: 0
        };
      }
      
      acc[data].entrada += item.entrada || 0;
      acc[data].saida += item.saida || 0;
      acc[data].atual += item.atual || 0;
      acc[data].criticos += item.criticos || 0;
      
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by date
    return Object.values(dadosAgrupados).sort((a: any, b: any) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    ).map((item: any) => ({
      ...item,
      data: new Date(item.data).toLocaleDateString('pt-BR')
    }));
  }, [historico, carteiraFiltro]);

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
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="entrada" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Entrada" 
              />
              <Line 
                type="monotone" 
                dataKey="atual" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Atual" 
              />
              <Line 
                type="monotone" 
                dataKey="saida" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Saída" 
              />
              <Line 
                type="monotone" 
                dataKey="criticos" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Críticos" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
