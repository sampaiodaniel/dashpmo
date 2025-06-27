import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImportacaoDocumentacao() {
  const gerarPlanilhaExemplo = () => {
    // Dados de exemplo que seguem o formato esperado
    const cabecalhos = [
      // Colunas 1-11: Dados do Projeto
      'Nome Projeto',           // A (0)
      'Tipo_projeto',           // B (1)
      'Descrição projeto',      // C (2)
      'Finalização_prevista',   // D (3)
      'Equipe',                 // E (4)
      'Responsável Asa',        // F (5)
      'Chefe do Projeto',       // G (6)
      'Responsável',            // H (7)
      'Carteira primária',      // I (8)
      'Carteira Secundária',    // J (9)
      'Carteira Terciária',     // K (10)
      
      // Colunas 12-22: Dados do Status
      'Data Status',            // L (11)
      'Status_Geral',           // M (12)
      'Visao_Chefe_Projeto',    // N (13)
      'Progresso_estimado',     // O (14)
      'Probabilidade riscos',   // P (15)
      'Impacto riscos',         // Q (16)
      'ProbxImpact',            // R (17)
      'Realizado_Semana_Atual', // S (18)
      'Backlog',                // T (19)
      'Bloqueios_Atuais',       // U (20)
      'Observacoes_Pontos_Atencao' // V (21)
    ];

    // Adicionar cabeçalhos das 15 entregas dinamicamente
    for (let i = 1; i <= 15; i++) {
      cabecalhos.push(`Nome Entrega ${i}`);
      cabecalhos.push(`Data Entrega ${i}`);
      cabecalhos.push(`Status Entrega ${i}`);
      cabecalhos.push(`Entregáveis ${i}`);
    }

    const exemplo = [
      'Projeto Exemplo', 'Desenvolvimento', 'Descrição do projeto exemplo', '2024-12-31',
      'Equipe de desenvolvimento', 'João Silva', 'Maria Santos', 'Pedro Costa', 'Canais',
      'Core Bancário', '', '2024-01-15', 'Verde', 'Verde', '75', 'Baixo', 'Médio',
      'Baixo x Médio', 'Desenvolvimento da API\nTestes realizados\nRevisão de código', 'Testes unitários pendentes',
      'Aguardando definição do banco', 'Projeto em andamento conforme cronograma'
    ];

    // Adicionar dados de exemplo para as entregas (apenas as 3 primeiras preenchidas)
    for (let i = 1; i <= 15; i++) {
      if (i === 1) {
        exemplo.push('Entrega da API', '2024-02-01', 'Em Progresso', 'API REST completa');
      } else if (i === 2) {
        exemplo.push('Testes integrados', '2024-02-15', 'Não Iniciado', 'Testes end-to-end');
      } else if (i === 3) {
        exemplo.push('Deploy produção', '2024-03-01', 'Não Iniciado', 'Deploy no ambiente produtivo');
      } else {
        // Entregas vazias para as demais
        exemplo.push('', '', '', '');
      }
    }

    // Criar CSV para download
    const csvContent = [cabecalhos.join(','), exemplo.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'exemplo_importacao_projetos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Instruções de Importação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Formato da Planilha:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Primeira linha deve conter os cabeçalhos das colunas</li>
              <li>Uma linha por projeto/status</li>
              <li>Campos vazios serão ignorados</li>
              <li>Entregas sem nome serão ignoradas automaticamente</li>
              <li>Projetos com nomes duplicados serão ignorados</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Campos Obrigatórios:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Nome Projeto</Badge>
              <Badge variant="outline">Carteira primária</Badge>
              <Badge variant="outline">Data Status</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Valores Válidos:</h4>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Carteiras:</span> Cadastro, Canais, Core Bancário, Crédito, Cripto, Empréstimos, Fila Rápida, Investimentos 1, Investimentos 2, Onboarding, Open Finance
              </div>
              <div>
                <span className="font-medium">Status Geral:</span> Verde, Amarelo, Vermelho
              </div>
              <div>
                <span className="font-medium">Visão Chefe:</span> Verde, Amarelo, Vermelho
              </div>
              <div>
                <span className="font-medium">Status Entrega:</span> Não Iniciado, Em Progresso, Concluído, Atrasado, Cancelado
              </div>
              <div>
                <span className="font-medium">Progresso:</span> Número entre 0 e 100
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Exemplo de Planilha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Baixe um exemplo de planilha com o formato correto e dados de exemplo:
            </p>
            
            <Button onClick={gerarPlanilhaExemplo} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Baixar Planilha de Exemplo
            </Button>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Estrutura das Colunas:</h5>
              <div className="text-xs space-y-1">
                <div><strong>Colunas A-K (1-11):</strong> Dados do Projeto</div>
                <div><strong>Colunas L-V (12-22):</strong> Dados do Status</div>
                <div><strong>Colunas W+ (23+):</strong> Entregas (4 colunas por entrega: Nome, Data, Status, Entregáveis)</div>
                <div className="mt-2 text-gray-600">
                  <strong>Mapeamento específico:</strong><br/>
                  • Chefe do Projeto: Coluna G (7)<br/>
                  • Visão do Chefe: Coluna N (14)<br/>
                  • Nome Entrega 1: Coluna W (23)<br/>
                  • Realizado na Semana: Preserva quebras de linha
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 