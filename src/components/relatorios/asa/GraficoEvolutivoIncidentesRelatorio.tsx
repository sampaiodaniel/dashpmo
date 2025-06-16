
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';

interface GraficoEvolutivoIncidentesRelatorioProps {
  carteira: string;
}

export function GraficoEvolutivoIncidentesRelatorio({ carteira }: GraficoEvolutivoIncidentesRelatorioProps) {
  // Dados mockados para demonstração - em produção viriam do banco
  const dados = [
    { mes: 'Jan', total: 45, novos: 12, resolvidos: 8, criticos: 3 },
    { mes: 'Fev', total: 49, novos: 9, resolvidos: 5, criticos: 4 },
    { mes: 'Mar', total: 52, novos: 8, resolvidos: 5, criticos: 6 },
    { mes: 'Abr', total: 48, novos: 6, resolvidos: 10, criticos: 4 },
    { mes: 'Mai', total: 44, novos: 7, resolvidos: 11, criticos: 2 },
    { mes: 'Jun', total: 41, novos: 5, resolvidos: 8, criticos: 3 }
  ];

  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (!payload) return null;
    
    const value = payload[dataKey];
    const color = dataKey === 'total' ? '#1B365D' : 
                 dataKey === 'novos' ? '#10B981' : 
                 dataKey === 'resolvidos' ? '#2E5984' : '#EF4444';
    
    return (
      <g>
        <Dot cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={2} />
        <text 
          x={cx} 
          y={cy - 8} 
          textAnchor="middle" 
          fontSize={10} 
          fill={color}
          fontWeight="bold"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#1B365D]">
          <div className="w-4 h-4 bg-[#1B365D] rounded"></div>
          Evolução de Incidentes - {carteira} (Últimos 6 Meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#6B7280' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#6B7280' }}
              />
              
              {/* Linha do total de incidentes */}
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#1B365D" 
                strokeWidth={3}
                dot={<CustomDot dataKey="total" />}
                name="Total"
              />
              
              {/* Linha de novos incidentes */}
              <Line 
                type="monotone" 
                dataKey="novos" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={<CustomDot dataKey="novos" />}
                strokeDasharray="5 5"
                name="Novos"
              />
              
              {/* Linha de incidentes resolvidos */}
              <Line 
                type="monotone" 
                dataKey="resolvidos" 
                stroke="#2E5984" 
                strokeWidth={2}
                dot={<CustomDot dataKey="resolvidos" />}
                strokeDasharray="5 5"
                name="Resolvidos"
              />
              
              {/* Linha de incidentes críticos */}
              <Line 
                type="monotone" 
                dataKey="criticos" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={<CustomDot dataKey="criticos" />}
                name="Críticos"
              />
              
              {/* Linha de referência para meta */}
              <ReferenceLine y={40} stroke="#F59E0B" strokeDasharray="8 8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legenda personalizada */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#1B365D]"></div>
            <span className="text-[#1B365D] font-medium">Total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#10B981] border-dashed border-t-2"></div>
            <span className="text-[#10B981] font-medium">Novos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#2E5984] border-dashed border-t-2"></div>
            <span className="text-[#2E5984] font-medium">Resolvidos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#EF4444]"></div>
            <span className="text-[#EF4444] font-medium">Críticos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#F59E0B] border-dashed border-t-2"></div>
            <span className="text-[#F59E0B] font-medium">Meta (40)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
