
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Printer } from 'lucide-react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { getStatusColor, getStatusGeralColor } from '@/types/pmo';

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
                body { font-family: Arial, sans-serif; }
                @media print {
                  .page-break { page-break-after: always; }
                  .no-print { display: none; }
                }
                ${getComputedStyle(document.documentElement).cssText}
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
    const element = document.getElementById('relatorio-content');
    if (element) {
      // Por enquanto, abre o diálogo de impressão para salvar como PDF
      handlePrint();
    }
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
          <div 
            className="bg-white page-break relative h-[297mm] flex flex-col justify-center items-center text-center"
            style={{
              backgroundImage: 'url(/lovable-uploads/5eaa341f-dcb7-4b44-9b41-2f801ed73456.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10 text-white">
              <h1 className="text-6xl font-bold mb-8">
                PROJETOS/DEMANDAS
              </h1>
              <h2 className="text-4xl font-light mb-12">
                STATUS REPORT GERENCIAL
              </h2>
              <div className="text-2xl">
                {dados.dataRelatorio}
              </div>
            </div>
          </div>

          {/* 2ª Página - Subcapa da Carteira */}
          <div className="bg-white page-break h-[297mm] flex flex-col justify-center items-center text-center">
            <div className="border-l-8 border-[#B8A082] pl-8 mb-16">
              <h1 className="text-7xl font-bold text-[#B8A082]">
                {dados.carteira === 'Geral' ? 'TODAS AS CARTEIRAS' : dados.carteira.toUpperCase()}
              </h1>
            </div>
          </div>

          {/* 3ª Página - Tabela Overview sem Dashboard Executivo */}
          <div className="bg-white page-break h-[297mm] p-16">
            <div className="border-l-8 border-[#B8A082] pl-8 mb-12">
              <h2 className="text-4xl font-bold text-gray-800">
                PLANO DOS PROJETOS – {dados.carteira === 'Geral' ? 'TODAS AS CARTEIRAS' : dados.carteira.toUpperCase()}
              </h2>
            </div>
            
            {dados.projetos.length > 0 && (
              <div className="border border-gray-400">
                <div className="bg-gray-600 text-white">
                  <div className="grid grid-cols-2 font-bold text-xl">
                    <div className="p-6 border-r border-white">Projetos</div>
                    <div className="p-6">Equipe</div>
                  </div>
                </div>
                <div>
                  {dados.projetos.map((projeto, index) => (
                    <div key={projeto.id} className={`grid grid-cols-2 border-b border-gray-400 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="p-6 border-r border-gray-400 font-semibold text-lg">{projeto.nome_projeto}</div>
                      <div className="p-6 text-lg">{projeto.equipe || projeto.gp_responsavel || 'Não informado'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Páginas individuais por projeto */}
          {dados.projetos.map((projeto, index) => (
            <div key={`projeto-set-${projeto.id}`}>
              {/* 1ª Página do Projeto */}
              <div className="bg-white page-break h-[297mm] p-16">
                <div className="border-l-8 border-[#B8A082] pl-8 mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">
                    PLANO DO PROJETO – {projeto.nome_projeto}
                  </h2>
                </div>
                
                {projeto.ultimoStatus && (
                  <>
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="font-bold text-2xl text-gray-700">Status atual –</span>
                        <div className={`w-8 h-8 rounded-full ${
                          projeto.ultimoStatus.status_visao_gp === 'Verde' ? 'bg-green-500' :
                          projeto.ultimoStatus.status_visao_gp === 'Amarelo' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <p className="text-gray-700 text-xl leading-relaxed">
                        {projeto.descricao_projeto || projeto.nome_projeto}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-8">
                      <div>
                        <h4 className="font-bold underline mb-6 text-2xl">ITENS TRABALHADOS NA SEMANA</h4>
                        <div className="text-lg leading-relaxed bg-gray-50 p-6 rounded min-h-48">
                          {projeto.ultimoStatus.realizado_semana_atual || 'Nenhum item informado'}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold underline mb-6 text-2xl">PONTOS DE ATENÇÃO</h4>
                        <div className="text-lg leading-relaxed bg-gray-50 p-6 rounded min-h-48">
                          {projeto.ultimoStatus.observacoes_pontos_atencao || 'Nenhum ponto de atenção'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Footer ASA */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-16">
                  <div className="text-sm text-gray-500">
                    ASA. Todos os direitos reservados. Material confidencial é de propriedade da ASA, protegido por sigilo profissional.<br/>
                    O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.
                  </div>
                  <div className="bg-[#B8A082] p-2">
                    <div className="text-white font-bold">ASA</div>
                  </div>
                </div>
              </div>

              {/* 2ª Página do Projeto - Marcos e Entregáveis */}
              <div className="bg-white page-break h-[297mm] p-16">
                <div className="border-l-8 border-[#B8A082] pl-8 mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">
                    PLANO DO PROJETO – {projeto.nome_projeto}
                  </h2>
                </div>

                {projeto.ultimoStatus && (
                  <>
                    {/* Timeline dos marcos */}
                    {(projeto.ultimoStatus.data_marco1 || projeto.ultimoStatus.data_marco2 || projeto.ultimoStatus.data_marco3) && (
                      <div className="mb-12">
                        <div className="flex items-center justify-between relative">
                          <div className="absolute top-1/2 left-0 right-0 h-2 bg-yellow-500 transform -translate-y-1/2"></div>
                          
                          {projeto.ultimoStatus.data_marco1 && (
                            <div className="relative z-10 text-center">
                              <div className="bg-white p-2 mb-2">
                                <h4 className="font-bold text-lg">{projeto.ultimoStatus.entrega1 || 'Entrega 1'}</h4>
                              </div>
                              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                              <div className="bg-red-100 px-3 py-1 text-sm">
                                {projeto.ultimoStatus.data_marco1.toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          )}
                          
                          {projeto.ultimoStatus.data_marco2 && (
                            <div className="relative z-10 text-center">
                              <div className="bg-white p-2 mb-2">
                                <h4 className="font-bold text-lg">{projeto.ultimoStatus.entrega2 || 'Entrega 2'}</h4>
                              </div>
                              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                              <div className="bg-white px-3 py-1 text-sm border">
                                {projeto.ultimoStatus.data_marco2.toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          )}
                          
                          {projeto.ultimoStatus.data_marco3 && (
                            <div className="relative z-10 text-center">
                              <div className="bg-white p-2 mb-2">
                                <h4 className="font-bold text-lg">{projeto.ultimoStatus.entrega3 || 'Entrega 3'}</h4>
                              </div>
                              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                              <div className="bg-white px-3 py-1 text-sm border">
                                {projeto.ultimoStatus.data_marco3.toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Entregáveis dos marcos */}
                    <div className="grid grid-cols-3 gap-6 mb-12">
                      {projeto.ultimoStatus.entregaveis1 && (
                        <div>
                          <div className="text-sm leading-relaxed text-justify">
                            {projeto.ultimoStatus.entregaveis1.split('\n').map((line, i) => (
                              <div key={i} className="mb-1">• {line}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {projeto.ultimoStatus.entregaveis2 && (
                        <div>
                          <div className="text-sm leading-relaxed text-justify">
                            {projeto.ultimoStatus.entregaveis2.split('\n').map((line, i) => (
                              <div key={i} className="mb-1">• {line}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {projeto.ultimoStatus.entregaveis3 && (
                        <div>
                          <div className="text-sm leading-relaxed text-justify">
                            {projeto.ultimoStatus.entregaveis3.split('\n').map((line, i) => (
                              <div key={i} className="mb-1">• {line}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Seções inferiores */}
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <h4 className="font-bold underline mb-3 text-lg">ITENS TRABALHADOS NA SEMANA</h4>
                        <div className="text-sm leading-relaxed">
                          {projeto.ultimoStatus.realizado_semana_atual?.split('\n').map((line, i) => (
                            <div key={i} className="mb-1">• {line}</div>
                          )) || 'Nenhum item informado'}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold underline mb-3 text-lg">PONTOS DE ATENÇÃO</h4>
                        <div className="text-sm leading-relaxed">
                          {projeto.ultimoStatus.observacoes_pontos_atencao?.split('\n').map((line, i) => (
                            <div key={i} className="mb-1">• {line}</div>
                          )) || 'Nenhum ponto de atenção'}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold underline mb-3 text-lg">BACKLOG</h4>
                        <div className="text-sm leading-relaxed">
                          {projeto.ultimoStatus.backlog?.split('\n').map((line, i) => (
                            <div key={i} className="mb-1">• {line}</div>
                          )) || 'Nenhum item no backlog'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Footer ASA */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-16">
                  <div className="text-sm text-gray-500">
                    ASA. Todos os direitos reservados. Material confidencial é de propriedade da ASA, protegido por sigilo profissional.<br/>
                    O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.
                  </div>
                  <div className="bg-[#B8A082] p-2">
                    <div className="text-white font-bold">ASA</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Página de Incidentes */}
          {dados.incidentes.length > 0 && (
            <>
              {/* Subcapa de Incidentes */}
              <div className="bg-white page-break h-[297mm] flex flex-col justify-center items-center text-center">
                <div className="border-l-8 border-[#B8A082] pl-8">
                  <h1 className="text-7xl font-bold text-[#B8A082]">
                    INCIDENTES
                  </h1>
                </div>
              </div>

              {/* Dados de Incidentes */}
              <div className="bg-white page-break h-[297mm] p-16">
                <div className="border-l-8 border-[#B8A082] pl-8 mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">Controle de Incidentes</h2>
                  <p className="text-lg text-gray-600 mt-2">*Detalhamento de itens na planilha de incidentes</p>
                </div>
                
                {dados.incidentes.map((incidente, index) => (
                  <div key={index} className="mb-16">
                    <div className="bg-[#B8A082] text-white p-4 text-center font-bold text-xl mb-4">
                      Atualização na última semana - {incidente.carteira}
                    </div>
                    
                    <div className="border border-gray-400">
                      <div className="grid grid-cols-6 gap-0 text-center">
                        <div className="bg-[#D4C4A8] p-4 border border-white font-bold text-white text-lg">
                          Estoque Anterior
                        </div>
                        <div className="bg-[#D4C4A8] p-4 border border-white font-bold text-white text-lg">
                          Entrada
                        </div>
                        <div className="bg-[#D4C4A8] p-4 border border-white font-bold text-white text-lg">
                          Saída
                        </div>
                        <div className="bg-[#D4C4A8] p-4 border border-white font-bold text-white text-lg">
                          Estoque Atual
                        </div>
                        <div className="bg-[#D4C4A8] p-4 border border-white font-bold text-white text-lg">
                          &gt; 15 dias
                        </div>
                        <div className="bg-[#D4C4A8] p-4 border border-white font-bold text-white text-lg">
                          Críticos
                        </div>
                        
                        <div className="bg-[#E8DCC6] p-8 border border-[#D4C4A8] text-4xl font-bold">
                          {incidente.anterior}
                        </div>
                        <div className="bg-[#E8DCC6] p-8 border border-[#D4C4A8] text-4xl font-bold">
                          {incidente.entrada}
                        </div>
                        <div className="bg-[#E8DCC6] p-8 border border-[#D4C4A8] text-4xl font-bold">
                          {incidente.saida}
                        </div>
                        <div className="bg-[#E8DCC6] p-8 border border-[#D4C4A8] text-4xl font-bold">
                          {incidente.atual}
                        </div>
                        <div className="bg-[#E8DCC6] p-8 border border-[#D4C4A8] text-4xl font-bold">
                          {incidente.mais_15_dias}
                        </div>
                        <div className="bg-[#E8DCC6] p-8 border border-[#D4C4A8] text-4xl font-bold">
                          {incidente.criticos}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Footer ASA */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-16">
                  <div className="text-sm text-gray-500">
                    ASA. Todos os direitos reservados. Material confidencial é de propriedade da ASA, protegido por sigilo profissional.<br/>
                    O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.
                  </div>
                  <div className="bg-[#B8A082] p-2">
                    <div className="text-white font-bold">ASA</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
