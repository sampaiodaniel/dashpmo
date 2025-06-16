
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Dot } from 'recharts';
import { useIncidentes } from '@/hooks/useIncidentes';

interface GraficoEvolutivoIncidentesRelatorioProps {
  carteira: string;
}

export function GraficoEvolutivoIncidentesRelatorio({ carteira }: GraficoEvolutivoIncidentesRelatorioProps) {
  const { data: incidentesData } = useIncidentes();
  
  // Filtrar dados apenas para a carteira específica e ordenar por data
  const dadosCarteira = incidentesData?.filter(item => item.carteira === carteira)
    ?.sort((a, b) => new Date(a.data_registro || '').getTime() - new Date(b.data_registro || '').getTime())
    ?.map(item => ({
      mes: new Date(item.data_registro || '').toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short' 
      }),
      data: item.data_registro,
      estoqueAtual: item.atual,
      entradas: item.entrada,
      saidas: item.saida,
      criticos: item.criticos
    })) || [];

  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (!payload) return null;
    
    const value = payload[dataKey];
    const color = dataKey === 'estoqueAtual' ? '#1B365D' : 
                 dataKey === 'entradas' ? '#10B981' : 
                 dataKey === 'saidas' ? '#2E5984' : '#EF4444';
    
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

  if (!dadosCarteira || dadosCarteira.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1B365D]">
            <div className="w-4 h-4 bg-[#1B365D] rounded"></div>
            Evolução de Incidentes - {carteira}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#6B7280]">
            <p>Nenhum dado de incidentes disponível para esta carteira</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#1B365D]">
          <div className="w-4 h-4 bg-[#1B365D] rounded"></div>
          Evolução de Incidentes - {carteira}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosCarteira} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
              
              {/* Linha do estoque atual */}
              <Line 
                type="monotone" 
                dataKey="estoqueAtual" 
                stroke="#1B365D" 
                strokeWidth={3}
                dot={<CustomDot dataKey="estoqueAtual" />}
                name="Estoque Atual"
              />
              
              {/* Linha de entradas */}
              <Line 
                type="monotone" 
                dataKey="entradas" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={<CustomDot dataKey="entradas" />}
                strokeDasharray="5 5"
                name="Entradas"
              />
              
              {/* Linha de saídas */}
              <Line 
                type="monotone" 
                dataKey="saidas" 
                stroke="#2E5984" 
                strokeWidth={2}
                dot={<CustomDot dataKey="saidas" />}
                strokeDasharray="5 5"
                name="Saídas"
              />
              
              {/* Linha de críticos */}
              <Line 
                type="monotone" 
                dataKey="criticos" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={<CustomDot dataKey="criticos" />}
                name="Críticos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legenda personalizada */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#1B365D]"></div>
            <span className="text-[#1B365D] font-medium">Estoque Atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#10B981] border-dashed border-t-2"></div>
            <span className="text-[#10B981] font-medium">Entradas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#2E5984] border-dashed border-t-2"></div>
            <span className="text-[#2E5984] font-medium">Saídas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#EF4444]"></div>
            <span className="text-[#EF4444] font-medium">Críticos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
