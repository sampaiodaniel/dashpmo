
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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
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

        <div className="print:p-0 space-y-0" id="relatorio-content">
          {/* Capa */}
          <div className="bg-white p-8 text-center min-h-[297mm] flex flex-col justify-center items-center print:page-break-after-always border-b-2 border-gray-300" style={{ aspectRatio: '210/297' }}>
            <div className="flex justify-center mb-12">
              <img 
                src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                alt="ASA Logo" 
                className="h-32 w-auto opacity-80"
              />
            </div>
            <div className="mb-16">
              <h1 className="text-4xl font-bold text-gray-700 mb-6 tracking-wide">
                PROJETOS/DEMANDAS
              </h1>
              <h2 className="text-2xl text-gray-600 mb-8 font-light">
                STATUS REPORT GERENCIAL
              </h2>
              <div className="text-xl text-gray-600 font-light">
                {dados.dataRelatorio}
              </div>
            </div>
            
            {/* Footer da capa */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center justify-center">
                <div className="bg-[#B8A082] px-4 py-2 flex items-center">
                  <img 
                    src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                    alt="ASA Logo Mini" 
                    className="h-6 w-auto filter brightness-0 invert"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2ª Página - Subcapa da Carteira */}
          <div className="bg-white p-8 text-center min-h-[297mm] flex flex-col justify-center items-center print:page-break-after-always border-b-2 border-gray-300" style={{ aspectRatio: '210/297' }}>
            <div className="flex justify-center mb-16">
              <img 
                src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                alt="ASA Logo" 
                className="h-24 w-auto opacity-70"
              />
            </div>
            <div className="mb-16">
              <h1 className="text-5xl font-bold text-[#B8A082] mb-8">
                {dados.carteira === 'Geral' ? 'TODAS AS CARTEIRAS' : dados.carteira.toUpperCase()}
              </h1>
            </div>
            
            {/* Footer */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-[#B8A082] px-4 py-2 flex items-center">
                <img 
                  src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                  alt="ASA Logo Mini" 
                  className="h-6 w-auto filter brightness-0 invert"
                />
              </div>
            </div>
          </div>

          {/* 3ª Página - Tabela Overview */}
          <div className="bg-white p-8 min-h-[297mm] print:page-break-after-always border-b-2 border-gray-300" style={{ aspectRatio: '210/297' }}>
            <div className="border-l-4 border-[#B8A082] pl-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                DASHBOARD EXECUTIVO
              </h2>
            </div>
            
            {dados.projetos.length > 0 && (
              <div className="space-y-6">
                {/* Tabela de métricas gerais */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {dados.projetos.length}
                    </div>
                    <div className="text-sm text-blue-800 font-medium">Total de Projetos</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {dados.projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Verde').length}
                    </div>
                    <div className="text-sm text-green-800 font-medium">Status Verde</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {dados.projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Amarelo').length}
                    </div>
                    <div className="text-sm text-yellow-800 font-medium">Status Amarelo</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {dados.projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Vermelho').length}
                    </div>
                    <div className="text-sm text-red-800 font-medium">Status Vermelho</div>
                  </div>
                </div>

                {/* Tabela de projetos resumida */}
                <div className="border border-gray-300">
                  <div className="bg-[#B8A082] text-white p-3">
                    <div className="grid grid-cols-4 gap-4 font-semibold">
                      <div>PROJETO</div>
                      <div>STATUS GERAL</div>
                      <div>VISÃO GP</div>
                      <div>ÚLTIMA ATUALIZAÇÃO</div>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {dados.projetos.map((projeto, index) => (
                      <div key={projeto.id} className={`grid grid-cols-4 gap-4 p-3 text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                        <div className="font-medium">{projeto.nome_projeto}</div>
                        <div>{projeto.ultimoStatus?.status_geral || 'N/A'}</div>
                        <div>
                          {projeto.ultimoStatus && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(projeto.ultimoStatus.status_visao_gp)}`}>
                              {projeto.ultimoStatus.status_visao_gp}
                            </span>
                          )}
                        </div>
                        <div>{projeto.ultimoStatus?.data_atualizacao.toLocaleDateString('pt-BR') || 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-[#B8A082] px-4 py-2 flex items-center">
                <img 
                  src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                  alt="ASA Logo Mini" 
                  className="h-6 w-auto filter brightness-0 invert"
                />
              </div>
            </div>
          </div>

          {/* Páginas individuais por projeto */}
          {dados.projetos.map((projeto, index) => (
            <div key={`projeto-set-${projeto.id}`}>
              {/* 1ª Página do Projeto */}
              <div className="bg-white p-8 min-h-[297mm] print:page-break-after-always border-b-2 border-gray-300" style={{ aspectRatio: '210/297' }}>
                <div className="border-l-4 border-[#B8A082] pl-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    PLANO DO PROJETO - {projeto.nome_projeto}
                  </h2>
                </div>
                
                {projeto.ultimoStatus && (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium text-lg">Status atual -</span>
                        <div className={`w-5 h-5 rounded-full ${
                          projeto.ultimoStatus.status_visao_gp === 'Verde' ? 'bg-green-500' :
                          projeto.ultimoStatus.status_visao_gp === 'Amarelo' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed">
                        {projeto.descricao_projeto || projeto.nome_projeto}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="font-bold underline mb-3 text-lg">ITENS TRABALHADOS NA SEMANA</h4>
                        <div className="text-sm leading-relaxed bg-gray-50 p-4 rounded min-h-32">
                          {projeto.ultimoStatus.realizado_semana_atual || 'Nenhum item informado'}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold underline mb-3 text-lg">PONTOS DE ATENÇÃO</h4>
                        <div className="text-sm leading-relaxed bg-gray-50 p-4 rounded min-h-32">
                          {projeto.ultimoStatus.observacoes_pontos_atencao || 'Nenhum ponto de atenção'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Footer */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#B8A082] px-4 py-2 flex items-center">
                    <img 
                      src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                      alt="ASA Logo Mini" 
                      className="h-6 w-auto filter brightness-0 invert"
                    />
                  </div>
                </div>
              </div>

              {/* 2ª Página do Projeto - Marcos e Entregáveis */}
              <div className="bg-white p-8 min-h-[297mm] print:page-break-after-always border-b-2 border-gray-300" style={{ aspectRatio: '210/297' }}>
                <div className="border-l-4 border-[#B8A082] pl-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    MARCOS E ENTREGÁVEIS - {projeto.nome_projeto}
                  </h2>
                </div>

                {projeto.ultimoStatus && (
                  <>
                    {/* Marcos e datas */}
                    {(projeto.ultimoStatus.data_marco1 || projeto.ultimoStatus.data_marco2 || projeto.ultimoStatus.data_marco3) && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4">MARCOS E DATAS DE ENTREGA</h3>
                        <div className="grid grid-cols-3 gap-6">
                          {projeto.ultimoStatus.data_marco1 && (
                            <div className="bg-gray-50 p-4 rounded">
                              <h4 className="font-bold text-[#B8A082] mb-2">MARCO 1</h4>
                              <div className="text-sm">
                                <div className="font-semibold">{projeto.ultimoStatus.entrega1 || 'Entrega 1'}</div>
                                <div className="text-gray-600">{projeto.ultimoStatus.data_marco1.toLocaleDateString('pt-BR')}</div>
                              </div>
                            </div>
                          )}
                          {projeto.ultimoStatus.data_marco2 && (
                            <div className="bg-gray-50 p-4 rounded">
                              <h4 className="font-bold text-[#B8A082] mb-2">MARCO 2</h4>
                              <div className="text-sm">
                                <div className="font-semibold">{projeto.ultimoStatus.entrega2 || 'Entrega 2'}</div>
                                <div className="text-gray-600">{projeto.ultimoStatus.data_marco2.toLocaleDateString('pt-BR')}</div>
                              </div>
                            </div>
                          )}
                          {projeto.ultimoStatus.data_marco3 && (
                            <div className="bg-gray-50 p-4 rounded">
                              <h4 className="font-bold text-[#B8A082] mb-2">MARCO 3</h4>
                              <div className="text-sm">
                                <div className="font-semibold">{projeto.ultimoStatus.entrega3 || 'Entrega 3'}</div>
                                <div className="text-gray-600">{projeto.ultimoStatus.data_marco3.toLocaleDateString('pt-BR')}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Entregáveis detalhados */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4">ENTREGÁVEIS DETALHADOS</h3>
                      <div className="space-y-4">
                        {projeto.ultimoStatus.entregaveis1 && (
                          <div className="bg-blue-50 p-4 rounded">
                            <h4 className="font-bold text-blue-800 mb-2">MARCO 1 - ENTREGÁVEIS</h4>
                            <div className="text-sm leading-relaxed">{projeto.ultimoStatus.entregaveis1}</div>
                          </div>
                        )}
                        {projeto.ultimoStatus.entregaveis2 && (
                          <div className="bg-green-50 p-4 rounded">
                            <h4 className="font-bold text-green-800 mb-2">MARCO 2 - ENTREGÁVEIS</h4>
                            <div className="text-sm leading-relaxed">{projeto.ultimoStatus.entregaveis2}</div>
                          </div>
                        )}
                        {projeto.ultimoStatus.entregaveis3 && (
                          <div className="bg-purple-50 p-4 rounded">
                            <h4 className="font-bold text-purple-800 mb-2">MARCO 3 - ENTREGÁVEIS</h4>
                            <div className="text-sm leading-relaxed">{projeto.ultimoStatus.entregaveis3}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Backlog */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4">BACKLOG</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="text-sm leading-relaxed">
                          {projeto.ultimoStatus.backlog || 'Nenhum item no backlog'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Footer */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#B8A082] px-4 py-2 flex items-center">
                    <img 
                      src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                      alt="ASA Logo Mini" 
                      className="h-6 w-auto filter brightness-0 invert"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Página de Incidentes */}
          {dados.incidentes.length > 0 && (
            <>
              {/* Subcapa de Incidentes */}
              <div className="bg-white p-8 text-center min-h-[297mm] flex flex-col justify-center items-center print:page-break-after-always border-b-2 border-gray-300" style={{ aspectRatio: '210/297' }}>
                <div className="flex justify-center mb-16">
                  <img 
                    src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                    alt="ASA Logo" 
                    className="h-24 w-auto opacity-70"
                  />
                </div>
                <div className="mb-16">
                  <h1 className="text-5xl font-bold text-[#B8A082] mb-8">
                    INCIDENTES
                  </h1>
                </div>
                
                {/* Footer */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#B8A082] px-4 py-2 flex items-center">
                    <img 
                      src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                      alt="ASA Logo Mini" 
                      className="h-6 w-auto filter brightness-0 invert"
                    />
                  </div>
                </div>
              </div>

              {/* Dados de Incidentes */}
              <div className="bg-white p-8 min-h-[297mm] print:page-break-after-always border-b-2 border-gray-300" style={{ aspectRatio: '210/297' }}>
                <div className="border-l-4 border-[#B8A082] pl-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Controle de Incidentes</h2>
                  <p className="text-sm text-gray-600 mt-1">*Detalhamento de itens na planilha de incidentes</p>
                </div>
                
                {dados.incidentes.map((incidente, index) => (
                  <div key={index} className="mb-8">
                    <div className="bg-[#B8A082] text-white p-3 text-center font-bold mb-2">
                      Atualização na última semana - {incidente.carteira}
                    </div>
                    
                    <div className="border border-gray-300">
                      <div className="grid grid-cols-6 gap-0 text-center">
                        <div className="bg-[#D4C4A8] p-3 border border-white font-semibold text-white">
                          Estoque Anterior
                        </div>
                        <div className="bg-[#D4C4A8] p-3 border border-white font-semibold text-white">
                          Entrada
                        </div>
                        <div className="bg-[#D4C4A8] p-3 border border-white font-semibold text-white">
                          Saída
                        </div>
                        <div className="bg-[#D4C4A8] p-3 border border-white font-semibold text-white">
                          Estoque Atual
                        </div>
                        <div className="bg-[#D4C4A8] p-3 border border-white font-semibold text-white">
                          &gt; 15 dias
                        </div>
                        <div className="bg-[#D4C4A8] p-3 border border-white font-semibold text-white">
                          Críticos
                        </div>
                        
                        <div className="bg-[#E8DCC6] p-6 border border-[#D4C4A8] text-3xl font-bold">
                          {incidente.anterior}
                        </div>
                        <div className="bg-[#E8DCC6] p-6 border border-[#D4C4A8] text-3xl font-bold">
                          {incidente.entrada}
                        </div>
                        <div className="bg-[#E8DCC6] p-6 border border-[#D4C4A8] text-3xl font-bold">
                          {incidente.saida}
                        </div>
                        <div className="bg-[#E8DCC6] p-6 border border-[#D4C4A8] text-3xl font-bold">
                          {incidente.atual}
                        </div>
                        <div className="bg-[#E8DCC6] p-6 border border-[#D4C4A8] text-3xl font-bold">
                          {incidente.mais_15_dias}
                        </div>
                        <div className="bg-[#E8DCC6] p-6 border border-[#D4C4A8] text-3xl font-bold">
                          {incidente.criticos}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Footer */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#B8A082] px-4 py-2 flex items-center">
                    <img 
                      src="/lovable-uploads/16ca3ef2-aca7-4203-832c-dfedc6f27429.png" 
                      alt="ASA Logo Mini" 
                      className="h-6 w-auto filter brightness-0 invert"
                    />
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
