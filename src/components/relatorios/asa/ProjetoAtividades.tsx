
interface ProjetoAtividadesProps {
  ultimoStatus: any;
}

export function ProjetoAtividades({ ultimoStatus }: ProjetoAtividadesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h4 className="font-semibold text-[#1B365D] mb-3">Itens Trabalhados na Semana</h4>
        <div className="bg-gray-50 p-4 rounded-lg min-h-[150px]">
          {ultimoStatus?.realizado_semana_atual ? (
            <div className="space-y-2">
              {ultimoStatus.realizado_semana_atual.split('\n').map((item: string, i: number) => (
                <div key={i} className="text-sm leading-relaxed">
                  <span className="font-medium text-[#1B365D] mr-2">•</span>
                  <span>{item.trim()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Nenhum item informado</p>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-[#F59E0B] mb-3">Pontos de Atenção</h4>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg min-h-[150px]">
          {ultimoStatus?.observacoes_pontos_atencao ? (
            <div className="space-y-2">
              {ultimoStatus.observacoes_pontos_atencao.split('\n').map((item: string, i: number) => (
                <div key={i} className="text-sm leading-relaxed">
                  <span className="font-medium text-[#F59E0B] mr-2">⚠</span>
                  <span>{item.trim()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Nenhum ponto de atenção</p>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-[#2E5984] mb-3">Backlog</h4>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg min-h-[150px]">
          {ultimoStatus?.backlog ? (
            <div className="space-y-2">
              {ultimoStatus.backlog.split('\n').map((item: string, i: number) => (
                <div key={i} className="text-sm leading-relaxed">
                  <span className="font-medium text-[#2E5984] mr-2">•</span>
                  <span>{item.trim()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Nenhum item no backlog</p>
          )}
        </div>
      </div>
    </div>
  );
}
