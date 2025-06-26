
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IshikawaDiagramProps {
  projeto: any;
  ultimoStatus?: any;
}

export function IshikawaDiagram({ projeto, ultimoStatus }: IshikawaDiagramProps) {
  const entregas = ultimoStatus ? [
    {
      nome: ultimoStatus.entrega1 || 'Entrega 1',
      escopo: ultimoStatus.entregaveis1 || 'Sem detalhes',
      data: ultimoStatus.data_marco1
    },
    {
      nome: ultimoStatus.entrega2 || 'Entrega 2', 
      escopo: ultimoStatus.entregaveis2 || 'Sem detalhes',
      data: ultimoStatus.data_marco2
    },
    {
      nome: ultimoStatus.entrega3 || 'Entrega 3',
      escopo: ultimoStatus.entregaveis3 || 'Sem detalhes', 
      data: ultimoStatus.data_marco3
    }
  ].filter(e => e.nome && e.nome !== 'Entrega 1' && e.nome !== 'Entrega 2' && e.nome !== 'Entrega 3') : [];

  return (
    <Card className="bg-white border border-[#E5E7EB]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#1B365D]">
          Diagrama de Entregas - {projeto.nome_projeto}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Linha principal horizontal */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1B365D] transform -translate-y-1/2"></div>
          
          {/* Círculo central do projeto */}
          <div className="flex justify-center items-center mb-8">
            <div className="bg-[#1B365D] text-white rounded-full w-32 h-32 flex items-center justify-center text-center p-4 relative z-10">
              <div>
                <div className="text-sm font-bold">PROJETO</div>
                <div className="text-xs mt-1 leading-tight">{projeto.nome_projeto.substring(0, 30)}</div>
              </div>
            </div>
          </div>

          {/* Entregas como ramificações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {entregas.map((entrega, index) => (
              <div key={index} className="relative">
                {/* Linha diagonal */}
                <div className={`absolute top-0 ${index === 0 ? 'left-1/4' : index === 1 ? 'left-1/2' : 'left-3/4'} w-0.5 h-16 bg-[#1B365D] transform ${index === 0 ? '-rotate-45' : index === 1 ? 'rotate-0' : 'rotate-45'} origin-bottom`}></div>
                
                {/* Caixa da entrega */}
                <div className="bg-[#F8FAFC] border-2 border-[#1B365D] rounded-lg p-4 mt-16">
                  <h4 className="font-bold text-[#1B365D] text-sm mb-2">{entrega.nome}</h4>
                  <p className="text-xs text-[#6B7280] mb-2 leading-tight">{entrega.escopo}</p>
                  {entrega.data && (
                    <div className="text-xs font-medium text-[#1B365D]">
                      {new Date(entrega.data).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Se não há entregas, mostrar mensagem */}
          {entregas.length === 0 && (
            <div className="text-center py-8 text-[#6B7280]">
              <p>Nenhuma entrega definida para este projeto</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
