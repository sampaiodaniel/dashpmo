
interface ProjetoAtividadesProps {
  ultimoStatus: any;
}

export function ProjetoAtividades({ ultimoStatus }: ProjetoAtividadesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <h4 className="font-semibold text-pmo-primary mb-2">Itens Trabalhados na Semana</h4>
        <div className="bg-gray-50 p-3 rounded-lg min-h-[100px]">
          {ultimoStatus?.realizado_semana_atual ? (
            ultimoStatus.realizado_semana_atual.split('\n').map((item: string, i: number) => (
              <div key={i} className="text-sm mb-1">• {item}</div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhum item informado</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-pmo-primary mb-2">Pontos de Atenção</h4>
        <div className="bg-yellow-50 p-3 rounded-lg min-h-[100px]">
          {ultimoStatus?.observacoes_pontos_atencao ? (
            ultimoStatus.observacoes_pontos_atencao.split('\n').map((item: string, i: number) => (
              <div key={i} className="text-sm mb-1">• {item}</div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhum ponto de atenção</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-pmo-primary mb-2">Backlog</h4>
        <div className="bg-blue-50 p-3 rounded-lg min-h-[100px]">
          {ultimoStatus?.backlog ? (
            ultimoStatus.backlog.split('\n').map((item: string, i: number) => (
              <div key={i} className="text-sm mb-1">• {item}</div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhum item no backlog</p>
          )}
        </div>
      </div>
    </div>
  );
}
