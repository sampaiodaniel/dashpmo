
import { useState } from 'react';
import { StatusProjeto } from '@/types/pmo';

export function useStatusFormData(status: StatusProjeto) {
  const [formData, setFormData] = useState({
    data_atualizacao: typeof status.data_atualizacao === 'string' 
      ? status.data_atualizacao 
      : status.data_atualizacao 
        ? new Date(status.data_atualizacao).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    status_geral: status.status_geral,
    status_visao_gp: status.status_visao_gp,
    impacto_riscos: status.impacto_riscos,
    probabilidade_riscos: status.probabilidade_riscos,
    realizado_semana_atual: status.realizado_semana_atual || '',
    backlog: status.backlog || '',
    bloqueios_atuais: status.bloqueios_atuais || '',
    observacoes_pontos_atencao: status.observacoes_pontos_atencao || '',
    progresso_estimado: (status as any).progresso_estimado || 0
  });

  const handleInputChange = (field: string, value: string | number | Date | undefined) => {
    let processedValue: string | number;
    
    if (value instanceof Date) {
      if (field === 'data_atualizacao') {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        processedValue = `${year}-${month}-${day}`;
      } else {
        processedValue = value.toISOString();
      }
    } else if (value === undefined) {
      processedValue = '';
    } else {
      processedValue = value;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  return {
    formData,
    setFormData,
    handleInputChange
  };
}
