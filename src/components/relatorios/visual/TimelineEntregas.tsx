
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineEntregasProps {
  statusProjetos: any[];
}

export function TimelineEntregas({ statusProjetos }: TimelineEntregasProps) {
  // Coletar todas as entregas com datas
  const entregas = [];
  
  statusProjetos.forEach(status => {
    if (status.data_marco1 && status.entrega1) {
      entregas.push({
        data: status.data_marco1,
        titulo: status.entrega1,
        projeto: status.projeto?.nome_projeto || 'Projeto',
        tipo: 'marco1',
        cor: 'bg-blue-100 border-blue-300 text-blue-700'
      });
    }
    
    if (status.data_marco2 && status.entrega2) {
      entregas.push({
        data: status.data_marco2,
        titulo: status.entrega2,
        projeto: status.projeto?.nome_projeto || 'Projeto',
        tipo: 'marco2',
        cor: 'bg-green-100 border-green-300 text-green-700'
      });
    }
    
    if (status.data_marco3 && status.entrega3) {
      entregas.push({
        data: status.data_marco3,
        titulo: status.entrega3,
        projeto: status.projeto?.nome_projeto || 'Projeto',
        tipo: 'marco3',
        cor: 'bg-purple-100 border-purple-300 text-purple-700'
      });
    }
  });

  // Ordenar por data
  entregas.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (entregas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline de Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma entrega com data definida encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline de Entregas - Diagrama Sequencial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Linha horizontal principal */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
          
          <div className="flex justify-between items-center min-h-[120px] relative">
            {entregas.slice(0, 8).map((entrega, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                {/* Ponto na timeline */}
                <div className={`w-4 h-4 rounded-full bg-white border-4 ${
                  entrega.tipo === 'marco1' ? 'border-blue-500' :
                  entrega.tipo === 'marco2' ? 'border-green-500' : 'border-purple-500'
                } mb-2`}></div>
                
                {/* Caixa de informação */}
                <div className={`p-2 rounded-lg border-2 max-w-[120px] text-center ${entrega.cor}`}>
                  <div className="text-xs font-bold mb-1">
                    {new Date(entrega.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-xs font-medium truncate" title={entrega.titulo}>
                    {entrega.titulo}
                  </div>
                  <div className="text-xs opacity-75 truncate" title={entrega.projeto}>
                    {entrega.projeto}
                  </div>
                </div>
                
                {/* Linha vertical conectora */}
                <div className={`w-0.5 h-6 mt-2 ${
                  entrega.tipo === 'marco1' ? 'bg-blue-500' :
                  entrega.tipo === 'marco2' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
              </div>
            ))}
          </div>
          
          {entregas.length > 8 && (
            <div className="text-center mt-4 text-sm text-gray-500">
              E mais {entregas.length - 8} entregas...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
