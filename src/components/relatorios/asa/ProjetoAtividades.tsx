
import React from 'react';

interface ProjetoAtividadesProps {
  ultimoStatus: any;
}

export function ProjetoAtividades({ ultimoStatus }: ProjetoAtividadesProps) {
  if (!ultimoStatus) return null;

  const hasActivities = ultimoStatus.realizado_semana_atual;

  if (!hasActivities) return null;

  // Função para dividir texto em colunas
  const dividirTextoEmColunas = (texto: string, maxColunas: number = 3) => {
    if (!texto) return [];
    
    const linhas = texto.split('\n').filter(linha => linha.trim());
    const totalLinhas = linhas.length;
    
    if (totalLinhas <= 4) {
      // Poucas linhas - uma coluna, altura menor
      return [linhas];
    } else if (totalLinhas <= 8) {
      // Médio número de linhas - duas colunas
      const meio = Math.ceil(totalLinhas / 2);
      return [linhas.slice(0, meio), linhas.slice(meio)];
    } else {
      // Muitas linhas - três colunas
      const terco = Math.ceil(totalLinhas / 3);
      return [
        linhas.slice(0, terco),
        linhas.slice(terco, terco * 2),
        linhas.slice(terco * 2)
      ];
    }
  };

  const colunas = dividirTextoEmColunas(ultimoStatus.realizado_semana_atual);
  const totalLinhas = ultimoStatus.realizado_semana_atual?.split('\n').filter((linha: string) => linha.trim()).length || 0;
  
  // Altura dinâmica baseada no número de linhas
  const alturaMinima = totalLinhas <= 4 ? 'min-h-[120px]' : 
                     totalLinhas <= 8 ? 'min-h-[160px]' : 'min-h-[200px]';

  return (
    <div className="space-y-6">
      {/* Itens Trabalhados na Semana - ocupando toda a largura */}
      {ultimoStatus.realizado_semana_atual && (
        <div>
          <h4 className="font-semibold text-[#1B365D] mb-3">Itens Trabalhados na Semana</h4>
          <div className={`bg-blue-50 border border-blue-300 p-4 rounded-lg ${alturaMinima}`}>
            <div className={`grid gap-4 h-full ${
              colunas.length === 1 ? 'grid-cols-1' : 
              colunas.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {colunas.map((coluna, colIndex) => (
                <div key={colIndex} className="space-y-1">
                  {coluna.map((item: string, i: number) => (
                    <div key={i} className="text-xs text-blue-700 leading-tight">
                      <span className="font-medium text-[#1B365D] mr-2">•</span>
                      <span>{item.trim()}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bloqueios - apenas se existir */}
      {ultimoStatus.bloqueios_atuais && (
        <div>
          <h4 className="font-semibold text-[#EF4444] mb-3">Bloqueios Atuais</h4>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="space-y-1">
              {ultimoStatus.bloqueios_atuais.split('\n').map((item: string, i: number) => (
                <div key={i} className="text-xs text-red-700 leading-tight">
                  <span className="font-medium text-[#EF4444] mr-2">🚫</span>
                  <span>{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
