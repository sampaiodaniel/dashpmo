
import { useState, useMemo } from 'react';
import { useCarteiras } from '@/hooks/useListaValores';
import { useProjetos } from '@/hooks/useProjetos';

export function useNovoStatusForm() {
  // Campos básicos - declarar carteiraSelecionada primeiro
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('');
  
  // Agora posso usar carteiraSelecionada no hook
  const { data: todosProjetos } = useProjetos({ incluirFechados: true, area: carteiraSelecionada || undefined });
  
  const [projetoId, setProjetoId] = useState<number | null>(null);
  const [progressoEstimado, setProgressoEstimado] = useState<number>(0);
  const [responsavelCwi, setResponsavelCwi] = useState('');
  const [gpResponsavelCwi, setGpResponsavelCwi] = useState('');
  const [responsavelAsa, setResponsavelAsa] = useState('');
  
  // Status e riscos
  const [statusGeral, setStatusGeral] = useState<string>('');
  const [statusVisaoGp, setStatusVisaoGp] = useState<string>('');
  const [impactoRiscos, setImpactoRiscos] = useState<string>('');
  const [probabilidadeRiscos, setProbabilidadeRiscos] = useState<string>('');
  
  // Realizado e planejamento
  const [realizadoSemana, setRealizadoSemana] = useState('');
  
  // Próximas entregas
  const [nomeEntrega1, setNomeEntrega1] = useState('');
  const [escopoEntrega1, setEscopoEntrega1] = useState('');
  const [dataEntrega1, setDataEntrega1] = useState('');
  const [nomeEntrega2, setNomeEntrega2] = useState('');
  const [escopoEntrega2, setEscopoEntrega2] = useState('');
  const [dataEntrega2, setDataEntrega2] = useState('');
  const [nomeEntrega3, setNomeEntrega3] = useState('');
  const [escopoEntrega3, setEscopoEntrega3] = useState('');
  const [dataEntrega3, setDataEntrega3] = useState('');
  
  // Outros campos
  const [backlog, setBacklog] = useState('');
  const [bloqueios, setBloqueios] = useState('');
  const [observacoesPontosAtencao, setObservacoesPontosAtencao] = useState('');

  // Filtrar projetos pela carteira selecionada não é mais necessário pois já vem filtrado do hook
  const projetosFiltrados = useMemo(() => {
    return todosProjetos || [];
  }, [todosProjetos]);

  // Resetar projeto quando carteira muda
  const handleCarteiraChange = (novaCarteira: string) => {
    setCarteiraSelecionada(novaCarteira);
    setProjetoId(null); // Limpar projeto selecionado
  };

  const getFormData = () => ({
    projeto_id: projetoId,
    progresso_estimado: progressoEstimado || null,
    responsavel_cwi: responsavelCwi || null,
    gp_responsavel_cwi: gpResponsavelCwi || null,
    responsavel_asa: responsavelAsa || null,
    carteira_primaria: null,
    carteira_secundaria: null,
    carteira_terciaria: null,
    status_geral: statusGeral as any,
    status_visao_gp: statusVisaoGp as any,
    impacto_riscos: impactoRiscos as any,
    probabilidade_riscos: probabilidadeRiscos as any,
    realizado_semana_atual: realizadoSemana || null,
    entregaveis1: escopoEntrega1 || null,
    entrega1: nomeEntrega1 || null,
    data_marco1: dataEntrega1 || null,
    entregaveis2: escopoEntrega2 || null,
    entrega2: nomeEntrega2 || null,
    data_marco2: dataEntrega2 || null,
    entregaveis3: escopoEntrega3 || null,
    entrega3: nomeEntrega3 || null,
    data_marco3: dataEntrega3 || null,
    backlog: backlog || null,
    bloqueios_atuais: bloqueios || null,
    observacoes_pontos_atencao: observacoesPontosAtencao || null,
  });

  const isFormValid = () => {
    return projetoId && statusGeral && statusVisaoGp && impactoRiscos && probabilidadeRiscos;
  };

  return {
    // States
    carteiraSelecionada,
    projetoId,
    progressoEstimado,
    responsavelCwi,
    gpResponsavelCwi,
    responsavelAsa,
    statusGeral,
    statusVisaoGp,
    impactoRiscos,
    probabilidadeRiscos,
    realizadoSemana,
    nomeEntrega1,
    escopoEntrega1,
    dataEntrega1,
    nomeEntrega2,
    escopoEntrega2,
    dataEntrega2,
    nomeEntrega3,
    escopoEntrega3,
    dataEntrega3,
    backlog,
    bloqueios,
    observacoesPontosAtencao,
    
    // Setters
    setCarteiraSelecionada,
    setProjetoId,
    setProgressoEstimado,
    setResponsavelCwi,
    setGpResponsavelCwi,
    setResponsavelAsa,
    setStatusGeral,
    setStatusVisaoGp,
    setImpactoRiscos,
    setProbabilidadeRiscos,
    setRealizadoSemana,
    setNomeEntrega1,
    setEscopoEntrega1,
    setDataEntrega1,
    setNomeEntrega2,
    setEscopoEntrega2,
    setDataEntrega2,
    setNomeEntrega3,
    setEscopoEntrega3,
    setDataEntrega3,
    setBacklog,
    setBloqueios,
    setObservacoesPontosAtencao,
    
    // Computed values
    projetosFiltrados,
    
    // Methods
    handleCarteiraChange,
    getFormData,
    isFormValid,
  };
}
