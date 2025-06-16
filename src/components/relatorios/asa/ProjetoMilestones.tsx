
interface ProjetoMilestonesProps {
  ultimoStatus: any;
}

export function ProjetoMilestones({ ultimoStatus }: ProjetoMilestonesProps) {
  if (!ultimoStatus?.data_marco1 && !ultimoStatus?.data_marco2 && !ultimoStatus?.data_marco3) {
    return null;
  }

  return (
    <div>
      <h4 className="font-semibold text-pmo-primary mb-3">Próximas Entregas</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ultimoStatus?.data_marco1 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-1">
              {ultimoStatus.entrega1 || 'Entrega 1'}
            </h5>
            <p className="text-sm text-blue-600 mb-2">
              {new Date(ultimoStatus.data_marco1).toLocaleDateString('pt-BR')}
            </p>
            {ultimoStatus.entregaveis1 && (
              <div className="text-xs text-blue-700">
                {ultimoStatus.entregaveis1.split('\n').map((item: string, i: number) => (
                  <div key={i}>• {item}</div>
                ))}
              </div>
            )}
          </div>
        )}
        {ultimoStatus?.data_marco2 && (
          <div className="bg-green-50 p-3 rounded-lg">
            <h5 className="font-medium text-green-800 mb-1">
              {ultimoStatus.entrega2 || 'Entrega 2'}
            </h5>
            <p className="text-sm text-green-600 mb-2">
              {new Date(ultimoStatus.data_marco2).toLocaleDateString('pt-BR')}
            </p>
            {ultimoStatus.entregaveis2 && (
              <div className="text-xs text-green-700">
                {ultimoStatus.entregaveis2.split('\n').map((item: string, i: number) => (
                  <div key={i}>• {item}</div>
                ))}
              </div>
            )}
          </div>
        )}
        {ultimoStatus?.data_marco3 && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <h5 className="font-medium text-purple-800 mb-1">
              {ultimoStatus.entrega3 || 'Entrega 3'}
            </h5>
            <p className="text-sm text-purple-600 mb-2">
              {new Date(ultimoStatus.data_marco3).toLocaleDateString('pt-BR')}
            </p>
            {ultimoStatus.entregaveis3 && (
              <div className="text-xs text-purple-700">
                {ultimoStatus.entregaveis3.split('\n').map((item: string, i: number) => (
                  <div key={i}>• {item}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
