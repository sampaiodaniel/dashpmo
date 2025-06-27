
import { formatarData } from '@/utils/dateFormatting';
import { StatusEntregaBadge } from '@/components/common/StatusEntregaBadge';

interface TimelineMobileProps {
  entregasPagina: any[];
  projetos: any[];
}

export function TimelineMobile({ entregasPagina, projetos }: TimelineMobileProps) {
  return (
    <div style={{ 
      position: 'relative', 
      padding: '1rem', 
      minHeight: '200px',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Linha vertical da timeline */}
      <div style={{
        position: 'absolute',
        left: '1.5rem',
        top: '2rem',
        bottom: '2rem',
        width: '4px',
        backgroundColor: '#A6926B',
        borderRadius: '2px',
        zIndex: 1
      }}></div>
      
      {/* Conteúdo da timeline */}
      <div style={{
        paddingLeft: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {entregasPagina.map((entrega, index) => (
          <div key={index} style={{ position: 'relative', width: '100%' }}>
            {/* Marcador circular */}
            <div style={{
              position: 'absolute',
              left: '-2.25rem',
              top: '1rem',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: entrega.cor,
              border: '3px solid white',
              boxShadow: `0 0 0 2px ${entrega.cor}`,
              zIndex: 2
            }}></div>
            
            {/* Box da entrega */}
            <div style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              border: `2px solid ${entrega.corBorda}`,
              backgroundColor: entrega.cor,
              color: entrega.corTexto,
              minHeight: '120px',
              width: '100%',
              maxWidth: '100%',
              position: 'relative',
              overflow: 'hidden',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}>
              {/* Título da entrega */}
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: `1px solid rgba(255, 255, 255, 0.3)`,
                lineHeight: '1.3',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
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
                <div style={{
                  fontSize: '0.75rem',
                  opacity: '0.9',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
                  fontWeight: '500',
                  lineHeight: '1.3',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  textAlign: 'left'
                }}>
                  Projeto: {entrega.projeto}
                </div>
              )}
              
              {/* Data da entrega */}
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
                lineHeight: '1.3',
                textAlign: 'left'
              }}>
                Data: {formatarData(entrega.data)}
              </div>
              
              {/* Entregáveis */}
              {entrega.entregaveis && (
                <div style={{
                  fontSize: '0.75rem',
                  lineHeight: '1.4',
                  textAlign: 'left'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', textAlign: 'left' }}>
                    Entregáveis:
                  </div>
                  <div style={{
                    maxHeight: 'none',
                    overflow: 'visible'
                  }}>
                    {entrega.entregaveis.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '0.25rem',
                        lineHeight: '1.4'
                      }}>
                        <span style={{
                          marginRight: '0.5rem',
                          marginTop: '0.125rem',
                          flexShrink: 0,
                          fontSize: '0.75rem'
                        }}>•</span>
                        <span style={{
                          flex: 1,
                          fontSize: '0.75rem',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}>{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
