
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
    window.print();
  };

  const handleDownload = () => {
    // Implementar download do relatório (PDF, etc.)
    console.log('Download do relatório:', dados);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Relatório ASA - {dados.carteira}</DialogTitle>
            <div className="flex gap-2">
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

        <div className="print:p-0 space-y-8" id="relatorio-content">
          {/* Capa */}
          <div className="bg-gray-50 p-8 text-center min-h-[400px] flex flex-col justify-center print:page-break-after-always">
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/f05d6079-3547-424d-b104-71147c755538.png" 
                alt="ASA Logo" 
                className="h-24 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              PROJETOS/DEMANDAS
            </h1>
            <h2 className="text-2xl text-gray-600 mb-8">
              STATUS REPORT GERENCIAL
            </h2>
            <div className="text-xl text-gray-700">
              {dados.dataRelatorio}
            </div>
            <div className="mt-8">
              <div className="inline-block bg-[#B8A082] text-white px-6 py-2">
                <img 
                  src="/lovable-uploads/f05d6079-3547-424d-b104-71147c755538.png" 
                  alt="ASA Logo Mini" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Segunda página - Overview */}
          <div className="print:page-break-after-always">
            <div className="border-l-4 border-[#B8A082] pl-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {dados.carteira === 'Geral' ? 'Visão Geral' : `Projetos ${dados.carteira}`}
              </h2>
            </div>
            
            {dados.projetos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Resumo dos Projetos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {dados.projetos.length}
                    </div>
                    <div className="text-sm text-blue-800">Total de Projetos</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {dados.projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Verde').length}
                    </div>
                    <div className="text-sm text-green-800">Projetos no Verde</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terceira página - Lista de Projetos */}
          {dados.projetos.length > 0 && (
            <div className="print:page-break-after-always">
              <div className="border-l-4 border-[#B8A082] pl-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Lista de Projetos</h2>
              </div>
              
              <div className="space-y-4">
                {dados.projetos.map((projeto, index) => (
                  <div key={projeto.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{projeto.nome_projeto}</h3>
                      {projeto.ultimoStatus && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(projeto.ultimoStatus.status_visao_gp)}`}>
                          {projeto.ultimoStatus.status_visao_gp}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Responsável:</span> {projeto.responsavel_interno}
                      </div>
                      <div>
                        <span className="font-medium">GP:</span> {projeto.gp_responsavel}
                      </div>
                      {projeto.ultimoStatus && (
                        <>
                          <div>
                            <span className="font-medium">Status:</span> {projeto.ultimoStatus.status_geral}
                          </div>
                          <div>
                            <span className="font-medium">Atualização:</span> {projeto.ultimoStatus.data_atualizacao.toLocaleDateString('pt-BR')}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Páginas individuais por projeto */}
          {dados.projetos.map((projeto, index) => (
            <div key={`projeto-${projeto.id}`} className="print:page-break-after-always">
              <div className="border-l-4 border-[#B8A082] pl-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  PLANO DO PROJETO - {projeto.nome_projeto}
                </h2>
              </div>
              
              {projeto.ultimoStatus && (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Status atual -</span>
                      <div className={`w-4 h-4 rounded-full ${
                        projeto.ultimoStatus.status_visao_gp === 'Verde' ? 'bg-green-500' :
                        projeto.ultimoStatus.status_visao_gp === 'Amarelo' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <p className="text-gray-700">{projeto.descricao_projeto || projeto.nome_projeto}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold underline mb-2">ITENS TRABALHADOS NA SEMANA</h4>
                      <div className="text-sm">
                        {projeto.ultimoStatus.realizado_semana_atual || 'Nenhum item informado'}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold underline mb-2">PONTOS DE ATENÇÃO</h4>
                      <div className="text-sm">
                        {projeto.ultimoStatus.observacoes_pontos_atencao || 'Nenhum ponto de atenção'}
                      </div>
                    </div>
                  </div>

                  {/* Timeline de entregas */}
                  {(projeto.ultimoStatus.data_marco1 || projeto.ultimoStatus.data_marco2 || projeto.ultimoStatus.data_marco3) && (
                    <div className="mt-8">
                      <div className="relative">
                        <div className="absolute top-4 left-0 right-0 h-1 bg-[#B8A082]"></div>
                        <div className="relative flex justify-between">
                          {projeto.ultimoStatus.data_marco1 && (
                            <div className="text-center">
                              <div className="w-8 h-8 bg-[#B8A082] rounded-full flex items-center justify-center text-white text-xs font-bold mb-2">1</div>
                              <div className="text-xs">
                                <div className="font-bold">{projeto.ultimoStatus.entrega1 || 'Entrega 1'}</div>
                                <div>{projeto.ultimoStatus.data_marco1.toLocaleDateString('pt-BR')}</div>
                              </div>
                            </div>
                          )}
                          {projeto.ultimoStatus.data_marco2 && (
                            <div className="text-center">
                              <div className="w-8 h-8 bg-[#B8A082] rounded-full flex items-center justify-center text-white text-xs font-bold mb-2">2</div>
                              <div className="text-xs">
                                <div className="font-bold">{projeto.ultimoStatus.entrega2 || 'Entrega 2'}</div>
                                <div>{projeto.ultimoStatus.data_marco2.toLocaleDateString('pt-BR')}</div>
                              </div>
                            </div>
                          )}
                          {projeto.ultimoStatus.data_marco3 && (
                            <div className="text-center">
                              <div className="w-8 h-8 bg-[#B8A082] rounded-full flex items-center justify-center text-white text-xs font-bold mb-2">3</div>
                              <div className="text-xs">
                                <div className="font-bold">{projeto.ultimoStatus.entrega3 || 'Entrega 3'}</div>
                                <div>{projeto.ultimoStatus.data_marco3.toLocaleDateString('pt-BR')}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <h5 className="font-bold underline mb-1">ITENS TRABALHADOS NA SEMANA</h5>
                      <div>{projeto.ultimoStatus.realizado_semana_atual || 'N/A'}</div>
                    </div>
                    <div>
                      <h5 className="font-bold underline mb-1">PONTOS DE ATENÇÃO</h5>
                      <div>{projeto.ultimoStatus.observacoes_pontos_atencao || 'N/A'}</div>
                    </div>
                    <div>
                      <h5 className="font-bold underline mb-1">BACKLOG</h5>
                      <div>{projeto.ultimoStatus.backlog || 'N/A'}</div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="mt-8">
                <div className="inline-block bg-[#B8A082] text-white px-4 py-1">
                  <img 
                    src="/lovable-uploads/f05d6079-3547-424d-b104-71147c755538.png" 
                    alt="ASA Logo Mini" 
                    className="h-6 w-auto"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Página de Incidentes */}
          {dados.incidentes.length > 0 && (
            <>
              <div className="print:page-break-after-always">
                <div className="border-l-4 border-[#B8A082] pl-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Incidentes</h2>
                </div>
              </div>

              <div className="print:page-break-after-always">
                <div className="border-l-4 border-[#B8A082] pl-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Incidentes</h2>
                  <p className="text-sm text-gray-600 mt-1">*Detalhamento de itens na planilha de incidentes</p>
                </div>
                
                {dados.incidentes.map((incidente, index) => (
                  <div key={index} className="mb-6">
                    <div className="bg-[#B8A082] text-white p-2 text-center font-bold mb-2">
                      Atualização na última semana
                    </div>
                    
                    <div className="grid grid-cols-6 gap-0 text-center">
                      <div className="bg-[#D4C4A8] p-2 border border-white font-semibold text-white">
                        Estoque Anterior
                      </div>
                      <div className="bg-[#D4C4A8] p-2 border border-white font-semibold text-white">
                        Entrada
                      </div>
                      <div className="bg-[#D4C4A8] p-2 border border-white font-semibold text-white">
                        Saída
                      </div>
                      <div className="bg-[#D4C4A8] p-2 border border-white font-semibold text-white">
                        Estoque Atual
                      </div>
                      <div className="bg-[#D4C4A8] p-2 border border-white font-semibold text-white">
                        &gt; 15 dias
                      </div>
                      <div className="bg-[#D4C4A8] p-2 border border-white font-semibold text-white">
                        Críticos
                      </div>
                      
                      <div className="bg-[#E8DCC6] p-4 border border-[#D4C4A8] text-2xl font-bold">
                        {incidente.anterior}
                      </div>
                      <div className="bg-[#E8DCC6] p-4 border border-[#D4C4A8] text-2xl font-bold">
                        {incidente.entrada}
                      </div>
                      <div className="bg-[#E8DCC6] p-4 border border-[#D4C4A8] text-2xl font-bold">
                        {incidente.saida}
                      </div>
                      <div className="bg-[#E8DCC6] p-4 border border-[#D4C4A8] text-2xl font-bold">
                        {incidente.atual}
                      </div>
                      <div className="bg-[#E8DCC6] p-4 border border-[#D4C4A8] text-2xl font-bold">
                        {incidente.mais_15_dias}
                      </div>
                      <div className="bg-[#E8DCC6] p-4 border border-[#D4C4A8] text-2xl font-bold">
                        {incidente.criticos}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
