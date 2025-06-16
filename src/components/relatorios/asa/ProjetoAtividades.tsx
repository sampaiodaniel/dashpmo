
import React from 'react';

interface ProjetoAtividadesProps {
  ultimoStatus: any;
}

export function ProjetoAtividades({ ultimoStatus }: ProjetoAtividadesProps) {
  if (!ultimoStatus) return null;

  const hasActivities = ultimoStatus.realizado_semana_atual || 
                       ultimoStatus.observacoes_pontos_atencao || 
                       ultimoStatus.backlog;

  if (!hasActivities) return null;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Itens Trabalhados na Semana */}
      {ultimoStatus.realizado_semana_atual && (
        <div>
          <h4 className="font-semibold text-[#1B365D] mb-3">Itens Trabalhados na Semana</h4>
          <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg">
            <div className="space-y-2 text-sm leading-relaxed">
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
            <div className="space-y-2 text-sm leading-relaxed">
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
            <div className="space-y-2 text-sm leading-relaxed">
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

      {/* Bloqueios - sempre em linha separada quando existir */}
      {ultimoStatus.bloqueios_atuais && (
        <div className="col-span-3 mt-6">
          <h4 className="font-semibold text-[#EF4444] mb-3">Bloqueios Atuais</h4>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="space-y-2">
              {ultimoStatus.bloqueios_atuais.split('\n').map((item: string, i: number) => (
                <div key={i} className="text-sm text-red-700 leading-relaxed">
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
