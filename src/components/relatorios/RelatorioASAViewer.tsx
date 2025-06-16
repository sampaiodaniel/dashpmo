
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Printer } from 'lucide-react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';

interface RelatorioASAViewerProps {
  isOpen: boolean;
  onClose: () => void;
  dados: DadosRelatorioASA | null;
}

export function RelatorioASAViewer({ isOpen, onClose, dados }: RelatorioASAViewerProps) {
  if (!dados) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('relatorio-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Relatório ASA - ${dados.carteira}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; font-size: 12px; }
                .page-break { page-break-after: always; }
                .no-print { display: none !important; }
                @page { margin: 20mm; }
                .slide { 
                  width: 100%; 
                  height: 95vh;
                  display: flex;
                  flex-direction: column;
                  padding: 0;
                  margin: 0;
                }
                .cover-slide {
                  background-image: url('${window.location.origin}/lovable-uploads/143a98ee-b076-497b-af41-3ed323f10eea.png');
                  background-size: cover;
                  background-position: center;
                  background-repeat: no-repeat;
                  position: relative;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                }
                .cover-overlay {
                  position: absolute;
                  inset: 0;
                  background: rgba(0, 0, 0, 0.3);
                }
                .cover-content {
                  position: relative;
                  z-index: 10;
                  color: white;
                }
                .title-1 { font-size: 48px; font-weight: bold; margin-bottom: 20px; }
                .title-2 { font-size: 32px; font-weight: 300; margin-bottom: 30px; }
                .date { font-size: 24px; }
                .subcover-slide {
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                }
                .subcover-title {
                  font-size: 56px;
                  font-weight: bold;
                  color: #B8A082;
                  border-left: 8px solid #B8A082;
                  padding-left: 30px;
                }
                .content-slide {
                  padding: 40px;
                }
                .slide-title {
                  font-size: 28px;
                  font-weight: bold;
                  color: #333;
                  border-left: 8px solid #B8A082;
                  padding-left: 30px;
                  margin-bottom: 30px;
                }
                .projeto-table {
                  width: 100%;
                  border-collapse: collapse;
                  border: 2px solid #666;
                }
                .projeto-table th {
                  background: #666;
                  color: white;
                  padding: 15px;
                  font-size: 18px;
                  font-weight: bold;
                  border-right: 1px solid white;
                }
                .projeto-table td {
                  padding: 15px;
                  font-size: 16px;
                  border-bottom: 1px solid #666;
                  border-right: 1px solid #666;
                }
                .projeto-table tr:nth-child(even) {
                  background: #f5f5f5;
                }
                .footer {
                  position: absolute;
                  bottom: 20px;
                  left: 40px;
                  right: 40px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 10px;
                  color: #666;
                }
                .footer-logo {
                  background: #B8A082;
                  color: white;
                  padding: 8px 12px;
                  font-weight: bold;
                  font-size: 14px;
                }
                .projeto-slide-title {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333;
                  border-left: 8px solid #B8A082;
                  padding-left: 30px;
                  margin-bottom: 20px;
                }
                .status-circle {
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  display: inline-block;
                  margin-right: 10px;
                }
                .status-verde { background: #22c55e; }
                .status-amarelo { background: #eab308; }
                .status-vermelho { background: #ef4444; }
                .status-text {
                  font-size: 20px;
                  font-weight: bold;
                  color: #333;
                  margin-bottom: 20px;
                }
                .content-section {
                  margin-bottom: 30px;
                }
                .section-title {
                  font-size: 16px;
                  font-weight: bold;
                  text-decoration: underline;
                  margin-bottom: 15px;
                }
                .content-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 30px;
                }
                .content-box {
                  background: #f8f9fa;
                  padding: 20px;
                  border-radius: 8px;
                  min-height: 150px;
                }
                .timeline {
                  position: relative;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin: 30px 0;
                }
                .timeline-line {
                  position: absolute;
                  top: 50%;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: #eab308;
                  transform: translateY(-50%);
                }
                .timeline-item {
                  position: relative;
                  z-index: 10;
                  text-align: center;
                  background: white;
                  padding: 0 15px;
                }
                .timeline-circle {
                  width: 20px;
                  height: 20px;
                  background: #eab308;
                  border-radius: 50%;
                  margin: 0 auto 10px;
                }
                .timeline-title {
                  font-weight: bold;
                  font-size: 14px;
                  margin-bottom: 5px;
                }
                .timeline-date {
                  font-size: 12px;
                  background: #f0f0f0;
                  padding: 4px 8px;
                  border-radius: 4px;
                }
                .entregaveis-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr 1fr;
                  gap: 20px;
                  margin-bottom: 30px;
                }
                .entregavel-item {
                  font-size: 12px;
                  line-height: 1.4;
                }
                .bottom-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr 1fr;
                  gap: 20px;
                }
                .incidente-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                .incidente-header {
                  background: #B8A082;
                  color: white;
                  text-align: center;
                  font-weight: bold;
                  font-size: 16px;
                  padding: 15px;
                }
                .incidente-subheader {
                  background: #D4C4A8;
                  color: white;
                  text-align: center;
                  font-weight: bold;
                  padding: 12px;
                  border: 1px solid white;
                }
                .incidente-value {
                  background: #E8DCC6;
                  text-align: center;
                  font-size: 32px;
                  font-weight: bold;
                  padding: 20px;
                  border: 1px solid #D4C4A8;
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    // Implementar download PDF usando html2pdf ou similar
    handlePrint();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Relatório ASA - {dados.carteira}</DialogTitle>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="print:p-0 space-y-0" id="relatorio-content">
          {/* Capa usando a imagem como fundo */}
          <div className="slide cover-slide page-break">
            <div className="cover-overlay"></div>
            <div className="cover-content">
              <div className="title-1">PROJETOS/DEMANDAS</div>
              <div className="title-2">STATUS REPORT GERENCIAL</div>
              <div className="date">
                {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* 2ª Página - Subcapa da Carteira */}
          <div className="slide subcover-slide page-break">
            <div className="subcover-title">
              {dados.carteira === 'Geral' ? 'TODAS AS CARTEIRAS' : dados.carteira.toUpperCase()}
            </div>
          </div>

          {/* 3ª Página - Tabela Overview */}
          <div className="slide content-slide page-break">
            <div className="slide-title">
              PLANO DOS PROJETOS – {dados.carteira === 'Geral' ? 'TODAS AS CARTEIRAS' : dados.carteira.toUpperCase()}
            </div>
            
            {dados.projetos.length > 0 && (
              <table className="projeto-table">
                <thead>
                  <tr>
                    <th style={{ width: '60%' }}>Projetos</th>
                    <th style={{ width: '40%' }}>Equipe</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.projetos.map((projeto, index) => (
                    <tr key={projeto.id}>
                      <td>{projeto.nome_projeto}</td>
                      <td>{projeto.equipe || projeto.gp_responsavel || 'Não informado'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="footer">
              <div>
                ASA. Todos os direitos reservados. Material confidencial é de propriedade da ASA, protegido por sigilo profissional.<br/>
                O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.
              </div>
              <div className="footer-logo">ASA</div>
            </div>
          </div>

          {/* Páginas individuais por projeto */}
          {dados.projetos.map((projeto) => (
            <div key={`projeto-set-${projeto.id}`}>
              {/* 1ª Página do Projeto */}
              <div className="slide content-slide page-break">
                <div className="projeto-slide-title">
                  PLANO DO PROJETO – {projeto.nome_projeto}
                </div>
                
                {projeto.ultimoStatus && (
                  <>
                    <div className="status-text">
                      Status atual –
                      <span className={`status-circle ${
                        projeto.ultimoStatus.status_visao_gp === 'Verde' ? 'status-verde' :
                        projeto.ultimoStatus.status_visao_gp === 'Amarelo' ? 'status-amarelo' : 'status-vermelho'
                      }`}></span>
                    </div>

                    <div className="content-grid">
                      <div className="content-section">
                        <div className="section-title">ITENS TRABALHADOS NA SEMANA</div>
                        <div className="content-box">
                          {projeto.ultimoStatus.realizado_semana_atual?.split('\n').map((line, i) => (
                            <div key={i}>• {line}</div>
                          )) || 'Nenhum item informado'}
                        </div>
                      </div>
                      
                      <div className="content-section">
                        <div className="section-title">PONTOS DE ATENÇÃO</div>
                        <div className="content-box">
                          {projeto.ultimoStatus.observacoes_pontos_atencao?.split('\n').map((line, i) => (
                            <div key={i}>• {line}</div>
                          )) || 'Nenhum ponto de atenção'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="footer">
                  <div>
                    ASA. Todos os direitos reservados. Material confidencial é de propriedade da ASA, protegido por sigilo profissional.<br/>
                    O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.
                  </div>
                  <div className="footer-logo">ASA</div>
                </div>
              </div>

              {/* 2ª Página do Projeto - Marcos e Entregáveis */}
              <div className="slide content-slide page-break">
                <div className="projeto-slide-title">
                  PLANO DO PROJETO – {projeto.nome_projeto}
                </div>

                {projeto.ultimoStatus && (
                  <>
                    {/* Timeline dos marcos */}
                    {(projeto.ultimoStatus.data_marco1 || projeto.ultimoStatus.data_marco2 || projeto.ultimoStatus.data_marco3) && (
                      <div className="timeline">
                        <div className="timeline-line"></div>
                        
                        {projeto.ultimoStatus.data_marco1 && (
                          <div className="timeline-item">
                            <div className="timeline-title">{projeto.ultimoStatus.entrega1 || 'Entrega 1'}</div>
                            <div className="timeline-circle"></div>
                            <div className="timeline-date">
                              {new Date(projeto.ultimoStatus.data_marco1).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        )}
                        
                        {projeto.ultimoStatus.data_marco2 && (
                          <div className="timeline-item">
                            <div className="timeline-title">{projeto.ultimoStatus.entrega2 || 'Entrega 2'}</div>
                            <div className="timeline-circle"></div>
                            <div className="timeline-date">
                              {new Date(projeto.ultimoStatus.data_marco2).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        )}
                        
                        {projeto.ultimoStatus.data_marco3 && (
                          <div className="timeline-item">
                            <div className="timeline-title">{projeto.ultimoStatus.entrega3 || 'Entrega 3'}</div>
                            <div className="timeline-circle"></div>
                            <div className="timeline-date">
                              {new Date(projeto.ultimoStatus.data_marco3).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Entregáveis dos marcos na mesma linha vertical */}
                    <div className="entregaveis-grid">
                      {projeto.ultimoStatus.entregaveis1 && (
                        <div className="entregavel-item">
                          {projeto.ultimoStatus.entregaveis1.split('\n').map((line, i) => (
                            <div key={i}>• {line}</div>
                          ))}
                        </div>
                      )}
                      {projeto.ultimoStatus.entregaveis2 && (
                        <div className="entregavel-item">
                          {projeto.ultimoStatus.entregaveis2.split('\n').map((line, i) => (
                            <div key={i}>• {line}</div>
                          ))}
                        </div>
                      )}
                      {projeto.ultimoStatus.entregaveis3 && (
                        <div className="entregavel-item">
                          {projeto.ultimoStatus.entregaveis3.split('\n').map((line, i) => (
                            <div key={i}>• {line}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Seções inferiores */}
                    <div className="bottom-grid">
                      <div>
                        <div className="section-title">ITENS TRABALHADOS NA SEMANA</div>
                        <div>
                          {projeto.ultimoStatus.realizado_semana_atual?.split('\n').map((line, i) => (
                            <div key={i} className="entregavel-item">• {line}</div>
                          )) || 'Nenhum item informado'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="section-title">PONTOS DE ATENÇÃO</div>
                        <div>
                          {projeto.ultimoStatus.observacoes_pontos_atencao?.split('\n').map((line, i) => (
                            <div key={i} className="entregavel-item">• {line}</div>
                          )) || 'Nenhum ponto de atenção'}
                        </div>
                      </div>

                      <div>
                        <div className="section-title">BACKLOG</div>
                        <div>
                          {projeto.ultimoStatus.backlog?.split('\n').map((line, i) => (
                            <div key={i} className="entregavel-item">• {line}</div>
                          )) || 'Nenhum item no backlog'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="footer">
                  <div>
                    ASA. Todos os direitos reservados. Material confidencial é de propriedade da ASA, protegido por sigilo profissional.<br/>
                    O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.
                  </div>
                  <div className="footer-logo">ASA</div>
                </div>
              </div>
            </div>
          ))}

          {/* Página de Incidentes */}
          {dados.incidentes.length > 0 && (
            <>
              {/* Subcapa de Incidentes */}
              <div className="slide subcover-slide page-break">
                <div className="subcover-title">INCIDENTES</div>
              </div>

              {/* Dados de Incidentes */}
              <div className="slide content-slide page-break">
                <div className="slide-title">Controle de Incidentes</div>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                  *Detalhamento de itens na planilha de incidentes
                </p>
                
                {dados.incidentes.map((incidente, index) => (
                  <div key={index} style={{ marginBottom: '40px' }}>
                    <div className="incidente-header">
                      Atualização na última semana - {incidente.carteira}
                    </div>
                    
                    <table className="incidente-table">
                      <thead>
                        <tr>
                          <td className="incidente-subheader">Estoque Anterior</td>
                          <td className="incidente-subheader">Entrada</td>
                          <td className="incidente-subheader">Saída</td>
                          <td className="incidente-subheader">Estoque Atual</td>
                          <td className="incidente-subheader">&gt; 15 dias</td>
                          <td className="incidente-subheader">Críticos</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="incidente-value">{incidente.anterior}</td>
                          <td className="incidente-value">{incidente.entrada}</td>
                          <td className="incidente-value">{incidente.saida}</td>
                          <td className="incidente-value">{incidente.atual}</td>
                          <td className="incidente-value">{incidente.mais_15_dias}</td>
                          <td className="incidente-value">{incidente.criticos}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
                
                <div className="footer">
                  <div>
                    ASA. Todos os direitos reservados. Material confidencial é de propriedade da ASA, protegido por sigilo profissional.<br/>
                    O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.
                  </div>
                  <div className="footer-logo">ASA</div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
