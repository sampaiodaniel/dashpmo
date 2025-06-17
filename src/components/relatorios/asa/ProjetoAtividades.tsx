
import React from 'react';

interface ProjetoAtividadesProps {
  ultimoStatus: any;
}

export function ProjetoAtividades({ ultimoStatus }: ProjetoAtividadesProps) {
  if (!ultimoStatus) return null;

  const hasActivities = ultimoStatus.realizado_semana_atual || 
                       ultimoStatus.observacoes_pontos_atencao || 
                       ultimoStatus.backlog ||
                       ultimoStatus.bloqueios_atuais;

  if (!hasActivities) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Itens Trabalhados na Semana */}
        {ultimoStatus.realizado_semana_atual && (
          <div>
            <h4 className="font-semibold text-[#1B365D] mb-3">Itens Trabalhados na Semana</h4>
            <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg">
              <div className="space-y-1 text-xs leading-tight">
                {ultimoStatus.realizado_semana_atual.split('\n').map((item: string, i: number) => (
                  <div key={i} className="text-blue-700">
                    <span className="font-medium text-[#1B365D] mr-2">•</span>
                    <span>{item.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pontos de Atenção */}
        {ultimoStatus.observacoes_pontos_atencao && (
          <div>
            <h4 className="font-semibold text-[#F59E0B] mb-3">Pontos de Atenção</h4>
            <div className="bg-orange-50 border border-orange-300 p-4 rounded-lg">
              <div className="space-y-1 text-xs leading-tight">
                {ultimoStatus.observacoes_pontos_atencao.split('\n').map((item: string, i: number) => (
                  <div key={i} className="text-orange-700">
                    <span className="font-medium text-[#F59E0B] mr-2">⚠️</span>
                    <span>{item.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Backlog */}
        {ultimoStatus.backlog && (
          <div>
            <h4 className="font-semibold text-[#1B365D] mb-3">Backlog</h4>
            <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
              <div className="space-y-1 text-xs leading-tight">
                {ultimoStatus.backlog.split('\n').map((item: string, i: number) => (
                  <div key={i} className="text-gray-700">
                    <span className="font-medium text-[#6B7280] mr-2">→</span>
                    <span>{item.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bloqueios - apenas uma vez e apenas se existir */}
      {ultimoStatus.bloqueios_atuais && (
        <div>
          <h4 className="font-semibold text-[#EF4444] mb-3">Bloqueios Atuais</h4>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="space-y-1">
              {ultimoStatus.bloqueios_atuais.split('\n').map((item: string, i: number) => (
                <div key={i} className="text-xs text-red-700 leading-tight">
                  <span className="font-medium text-[#EF4444] mr-2">⚠️</span>
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
