
import { formatarData } from '@/utils/dateFormatting';
import { StatusEntregaBadge } from '@/components/common/StatusEntregaBadge';
import { useTimelineWeekMarkers } from './TimelineWeekMarkers';

interface TimelineRendererProps {
  entregasPagina: any[];
  numeroPagina: number;
  todasEntregasProjeto: any[];
  projetos: any[];
}

export function TimelineRenderer({ entregasPagina, numeroPagina, todasEntregasProjeto, projetos }: TimelineRendererProps) {
  const { gerarPosicoesSemanas } = useTimelineWeekMarkers();
  
  const tracosSemanas = gerarPosicoesSemanas(entregasPagina, todasEntregasProjeto, numeroPagina - 1);
  
  // Função para calcular altura mais precisa baseada no conteúdo real
  const calcularAlturaBox = (entrega: any) => {
    let alturaTotal = 40; // Base: padding do box + margens internas
    
    // Altura do título da entrega (sempre presente) - considerar quebras de linha
    const tituloLength = entrega.titulo ? entrega.titulo.length : 0;
    const linhasTitulo = Math.ceil(tituloLength / 40); // ~40 caracteres por linha no título (mais conservador)
    alturaTotal += (linhasTitulo * 20) + 12 + 8; // 20px por linha + 12px mb + 8px pb
    
    // Altura do nome do projeto (se presente)
    if (projetos.length > 1) {
      const projetoLength = entrega.projeto ? entrega.projeto.length : 0;
      const linhasProjeto = Math.ceil(projetoLength / 40);
      alturaTotal += (linhasProjeto * 18) + 12 + 8; // 18px por linha + 12px mb + 8px pb
    }
    
    // Altura dos entregáveis (se presente)
    if (entrega.entregaveis) {
      const linhas = entrega.entregaveis.split('\n').filter((item: string) => item.trim());
      
      if (linhas.length > 0) {
        // Título "Entregáveis:"
        alturaTotal += 18 + 8; // 18px altura + 8px mb
        
        // Cada linha de entregável
        linhas.forEach((linha: string) => {
          const caracteresPorLinha = 38; // Mais conservador para garantir quebras adequadas
          const linhasNecessarias = Math.max(1, Math.ceil(linha.trim().length / caracteresPorLinha));
          alturaTotal += (linhasNecessarias * 16) + 3; // 16px por linha + 3px espaçamento
        });
        
        // Espaçamento final da seção
        alturaTotal += 8;
      }
    }
    
    return Math.max(200, alturaTotal); // Mínimo de 200px para garantir espaço adequado
  };
  
  // Calcular a altura máxima necessária baseada no conteúdo de todos os boxes
  const alturaMaxima = Math.max(...entregasPagina.map(entrega => calcularAlturaBox(entrega)));
  
  // Altura do container deve ser suficiente para conter o maior box + timeline + datas
  const alturaContainer = Math.max(350, alturaMaxima + 80); // Reduzido de 100 para 80
  const posicaoTimeline = alturaContainer - 50; // Reduzido de 60 para 50
  
  return (
    <div style={{ position: 'relative', padding: '1rem 0', marginBottom: '1rem' }}>
      {/* Container com altura dinâmica para conter todos os elementos */}
      <div className="relative" style={{ height: `${alturaContainer}px` }}>
        
        {/* Timeline horizontal - posição calculada dinamicamente */}
        <div 
          className="absolute left-0 right-0 timeline-horizontal" 
          style={{ 
            top: `${posicaoTimeline}px`, 
            height: '6px',
            backgroundColor: '#A6926B',
            minHeight: '6px',
            border: 'none',
            outline: 'none'
          }}
        ></div>
        
        {/* Boxes das entregas em posições fixas - sempre acima da timeline */}
        {entregasPagina.map((entrega, index) => {
          // Posições fixas: 16.67%, 50%, 83.33%
          const posicoes = ['16.67%', '50%', '83.33%'];
          const posicao = posicoes[index];
          
          // Calcular altura específica e precisa para este box
          const alturaBox = calcularAlturaBox(entrega);
          
          return (
            <div key={index} className="absolute" style={{ 
              left: posicao,
              transform: 'translateX(-50%)',
              // Box termina sempre 10px acima da timeline (reduzido de 15px)
              top: `${Math.max(20, posicaoTimeline - alturaBox - 10)}px`
            }}>
              {/* Box de informação da entrega */}
              <div className="w-72" style={{ minWidth: '288px' }}>
                <div 
                  className="p-4 rounded-lg border-2 shadow-sm timeline-box"
                  style={{ 
                    height: `${alturaBox}px`, 
                    minHeight: '200px', 
                    minWidth: '280px',
                    backgroundColor: entrega.cor,
                    color: entrega.corTexto,
                    borderColor: entrega.corBorda,
                    overflow: 'hidden'
                  }}
                >
                  {/* Nome da entrega - SEMPRE NO TOPO */}
                  <div className="text-sm font-semibold text-left leading-tight mb-3 pb-2 border-b border-current border-opacity-20 flex items-center justify-between">
                    <span>{entrega.titulo}</span>
                    {/* Renderizar status da entrega com fallback de teste */}
                    {(() => {
                      // Primeiro, tentar renderizar o status se existir
                      if (entrega.statusEntregaId) {
                        console.log('🎯 Renderizando status para entrega:', entrega.titulo, 'Status ID:', entrega.statusEntregaId);
                        return (
                          <StatusEntregaBadge 
                            statusId={entrega.statusEntregaId} 
                            size="lg" 
                            showText={false} 
                          />
                        );
                      } 
                      // Se não tem status ID mas tem entrega, renderizar um status padrão baseado no tipo
                      else {
                        console.log('⚠️ Entrega sem status ID, usando fallback para:', entrega.titulo, 'Tipo:', entrega.tipo);
                        let statusFallback = 2; // "Em Andamento" como padrão
                        
                        // Definir status baseado no tipo da entrega
                        if (entrega.tipo === 'marco1') statusFallback = 2; // Em Andamento
                        else if (entrega.tipo === 'marco2') statusFallback = 3; // Em Revisão
                        else if (entrega.tipo === 'marco3') statusFallback = 4; // Concluído
                        else if (entrega.tipo.startsWith('extra')) statusFallback = 2; // Em Andamento
                        
                        return (
                          <StatusEntregaBadge 
                            statusId={statusFallback} 
                            size="lg" 
                            showText={false} 
                          />
                        );
                      }
                    })()}
                  </div>
                  
                  {/* Nome do projeto (se for timeline geral) */}
                  {projetos.length > 1 && (
                    <div className="text-xs opacity-75 leading-tight font-medium text-left mb-3 pb-2 border-b border-current border-opacity-20">
                      Projeto: {entrega.projeto}
                    </div>
                  )}
                  
                  {/* Entregáveis - lista completa */}
                  {entrega.entregaveis && (
                    <div className="text-xs leading-snug text-left">
                      <div className="font-semibold mb-2">Entregáveis:</div>
                      <div className="space-y-0.5">
                        {entrega.entregaveis.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                          <div key={i} className="leading-snug flex items-start">
                            <span className="mr-2 mt-0.5 flex-shrink-0 text-xs">•</span>
                            <span className="flex-1 text-xs break-words">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Linha vertical conectora - conecta box à bolinha */}
              <div 
                className="w-1 mx-auto timeline-connector"
                style={{ 
                  height: '12px', 
                  minHeight: '12px',
                  backgroundColor: entrega.cor,
                  border: 'none',
                  outline: 'none'
                }}
              ></div>
              
              {/* Ponto na timeline - exatamente sobre a linha horizontal */}
              <div 
                className="w-3 h-3 rounded-full shadow-md mx-auto timeline-marker"
                style={{ 
                  marginTop: '-2px', 
                  minWidth: '12px', 
                  minHeight: '12px',
                  backgroundColor: entrega.cor,
                  borderColor: entrega.corBorda,
                  border: `2px solid ${entrega.corBorda}`
                }}
              ></div>
              
              {/* Data - imediatamente abaixo da timeline */}
              <div 
                className="text-sm font-semibold text-center"
                style={{ 
                  marginTop: '8px',
                  color: entrega.cor
                }}
              >
                {formatarData(entrega.data)}
              </div>
            </div>
          );
        })}
        
        {/* Traços das semanas intermediárias - pequenos e pretos, cruzando a timeline */}
        {tracosSemanas.map((traco, index) => (
          <div 
            key={`semana-${index}`}
            className="absolute"
            style={{ 
              left: `${traco.posicao}%`,
              transform: 'translateX(-50%)',
              top: `${posicaoTimeline - 5}px` // 5px acima da timeline
            }}
          >
            <div 
              className="w-0.5 h-3 timeline-week-marker" 
              style={{ 
                minWidth: '3px', 
                minHeight: '20px',
                backgroundColor: '#A6926B',
                border: 'none',
                outline: 'none'
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
