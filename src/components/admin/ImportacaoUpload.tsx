import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileSpreadsheet, Upload, AlertCircle, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { useImportacaoExcel } from '@/hooks/useImportacaoExcel';
import { ImportacaoDocumentacao } from './ImportacaoDocumentacao';
import { supabase } from '@/integrations/supabase/client';

interface ImportacaoUploadProps {
  onUploadConcluido: (dados: any) => void;
}

export function ImportacaoUpload({ onUploadConcluido }: ImportacaoUploadProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { validarDados } = useImportacaoExcel();

  const handleArquivoSelecionado = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
          variant: "destructive",
        });
        return;
      }
      setArquivo(file);
    }
  };

  const processarPlanilha = async () => {
    if (!arquivo) return;
    
    setProcessando(true);
    
    try {
      const arrayBuffer = await arquivo.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (dados.length < 2) {
        throw new Error('Planilha deve ter pelo menos 2 linhas (cabeçalho + dados)');
      }

      const cabecalhos = dados[0] as string[];
      const linhas = dados.slice(1) as any[][];
      
      console.log('Cabeçalhos encontrados:', cabecalhos);
      
      const mapeamento = mapearColunas(cabecalhos);
      console.log('Mapeamento gerado:', mapeamento);

      // Buscar projetos existentes na base
      const { data: projetosExistentes } = await supabase
        .from('projetos')
        .select('nome_projeto, id, descricao, finalizacao_prevista, equipe, responsavel_asa, gp_responsavel, area_responsavel, carteira_secundaria, carteira_terciaria')
        .neq('status_ativo', false);

      // Criar mapa de projetos existentes por nome exato
      const projetosExistentesMap = new Map();
      (projetosExistentes || []).forEach(p => {
        const chaveNormalizada = p.nome_projeto.toLowerCase().trim();
        projetosExistentesMap.set(chaveNormalizada, p);
        console.log(`Projeto na base: "${p.nome_projeto}" -> chave: "${chaveNormalizada}"`);
      });
      
      console.log('Total de projetos na base:', projetosExistentes?.length);
      console.log('Chaves no mapa:', Array.from(projetosExistentesMap.keys()));

      const dadosProcessados = {
        projetos: [] as any[],
        status: [] as any[],
        entregas: [] as any[]
      };

      linhas.forEach((linha, index) => {
        try {
          if (!linha || linha.every(cell => !cell)) return; // Pular linhas vazias
          
          const dadosLinha = processarLinha(linha, mapeamento, index + 2);
          
          // Verificar se projeto já existe
          if (dadosLinha.projeto) {
            const nomeProjetoLimpo = dadosLinha.projeto.nome_projeto.toLowerCase().trim();
            const projetoExiste = projetosExistentesMap.has(nomeProjetoLimpo);
            
            dadosLinha.projeto._existe = projetoExiste;
            dadosLinha.projeto._acao = projetoExiste ? 'ATUALIZAR' : 'CRIAR';
            
            console.log(`Verificando projeto: "${dadosLinha.projeto.nome_projeto}" (limpo: "${nomeProjetoLimpo}") - Existe: ${projetoExiste}`);
            
            if (projetoExiste) {
              const projetoExistente = projetosExistentesMap.get(nomeProjetoLimpo);
              dadosLinha.projeto._idExistente = projetoExistente?.id;
              dadosLinha.projeto._nomeOriginal = projetoExistente?.nome_projeto; // Nome original da base
              
              // Comparar campos para identificar diferenças (campo -> texto)
              const diffEntries: { campo: string; texto: string }[] = [];

              const compararCampo = (field: string, label: string) => {
                const novoValor = (dadosLinha.projeto as any)[field];
                const antigoValor = (projetoExistente as any)[field];
                if (novoValor && String(novoValor).trim() !== String(antigoValor || '').trim()) {
                  diffEntries.push({ campo: field, texto: `${label}: "${antigoValor || 'Vazio'}" → "${novoValor}"` });
                }
              };

              compararCampo('descricao', 'Descrição');
              compararCampo('finalizacao_prevista', 'Finalização');
              compararCampo('equipe', 'Equipe');
              compararCampo('responsavel_asa', 'Resp. ASA');
              compararCampo('gp_responsavel', 'Chefe');
              compararCampo('area_responsavel', 'Carteira Primária');

              dadosLinha.projeto._diffEntries = diffEntries;
              dadosLinha.projeto._updateFields = diffEntries.reduce((acc: any, d) => ({ ...acc, [d.campo]: false }), {});
              
              console.log(`Projeto encontrado na base: "${projetoExistente?.nome_projeto}" - ${diffEntries.length} diferenças`);
            }
          }

          if (dadosLinha.projeto) {
            dadosProcessados.projetos.push(dadosLinha.projeto);
          }
          
          if (dadosLinha.status) {
            if (dadosLinha.projeto?._existe) {
              dadosLinha.status._acao = 'ADICIONAR_STATUS';
              dadosLinha.status._projetoExistente = dadosLinha.projeto.nome_projeto;
            }
            dadosProcessados.status.push(dadosLinha.status);
          }
          
          if (dadosLinha.entregas && dadosLinha.entregas.length > 0) {
            dadosProcessados.entregas.push(...dadosLinha.entregas);
          }
        } catch (error) {
          console.error(`Erro ao processar linha ${index + 2}:`, error);
        }
      });

      // Validar dados processados
      const { dadosValidados, erros } = validarDados(dadosProcessados);

      console.log('Dados processados:', dadosValidados);
      console.log('Erros encontrados:', erros);
      
      onUploadConcluido(dadosValidados);
      
      toast({
        title: "Sucesso",
        description: `Planilha processada! ${dadosValidados.projetos.length} projetos, ${dadosValidados.status.length} status e ${erros.length} erros encontrados.`,
      });

    } catch (error) {
      console.error('Erro ao processar planilha:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar a planilha. Verifique o formato do arquivo.",
        variant: "destructive",
      });
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Documentação colapsável */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Instruções e Formato da Planilha
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4">
            <ImportacaoDocumentacao />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Upload da Planilha Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-pmo-primary transition-colors">
              <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              
              {arquivo ? (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-pmo-primary">
                    {arquivo.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    Selecione a planilha Excel
                  </p>
                  <p className="text-sm text-gray-500">
                    Formatos aceitos: .xlsx, .xls
                  </p>
                </div>
              )}
              
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleArquivoSelecionado}
                className="hidden"
              />
              
              <Button 
                className="mt-4"
                onClick={() => inputRef.current?.click()}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                {arquivo ? 'Trocar Arquivo' : 'Selecionar Arquivo'}
              </Button>
            </div>
          </div>

          {arquivo && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 mb-1">
                      Instruções importantes:
                    </p>
                    <ul className="text-blue-700 space-y-1 list-disc list-inside">
                      <li>A primeira linha deve conter os cabeçalhos das colunas</li>
                      <li>Projetos duplicados (mesmo nome) serão ignorados</li>
                      <li>Campos obrigatórios: Nome do Projeto, Tipo de Projeto</li>
                      <li>Entregas em branco serão ignoradas automaticamente</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={processarPlanilha}
                  disabled={processando}
                  className="bg-pmo-primary hover:bg-pmo-primary/90"
                >
                  {processando ? 'Processando...' : 'Processar Planilha'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Função para mapear as colunas baseado nos cabeçalhos
function mapearColunas(cabecalhos: string[]) {
  const mapeamento: { [key: string]: number } = {};
  
  // Mapeamento fixo por posições específicas das colunas
  mapeamento.nomeProjeto = 0;           // Coluna A (0)
  mapeamento.tipoProjeto = 1;           // Coluna B (1)
  mapeamento.descricao = 2;             // Coluna C (2)
  mapeamento.finalizacaoPrevista = 3;   // Coluna D (3)
  mapeamento.equipe = 4;                // Coluna E (4)
  mapeamento.responsavelAsa = 5;        // Coluna F (5)
  mapeamento.chefeProjeto = 6;          // Coluna G (6) - CORRIGIDO
  mapeamento.responsavel = 7;           // Coluna H (7)
  mapeamento.carteiraPrimaria = 8;      // Coluna I (8)
  mapeamento.carteiraSecundaria = 9;    // Coluna J (9)
  mapeamento.carteiraTerciaria = 10;    // Coluna K (10)
  
  // Mapeamento dos campos de status
  mapeamento.dataStatus = 11;           // Coluna L (11)
  mapeamento.statusGeral = 12;          // Coluna M (12)
  mapeamento.visaoChefe = 13;           // Coluna N (13) - CORRIGIDO
  mapeamento.progresso = 14;            // Coluna O (14)
  mapeamento.probabilidadeRiscos = 15;  // Coluna P (15)
  mapeamento.impactoRiscos = 16;        // Coluna Q (16)
  mapeamento.probximpact = 17;          // Coluna R (17)
  mapeamento.realizadoSemana = 18;      // Coluna S (18)
  mapeamento.backlog = 19;              // Coluna T (19)
  mapeamento.bloqueios = 20;            // Coluna U (20)
  mapeamento.observacoes = 21;          // Coluna V (21)

  // Mapear entregas por posição das colunas (a partir da coluna 23, grupos de 4)
  for (let i = 0; i < 15; i++) {
    const baseCol = 22 + (i * 4); // Nome Entrega 1 = coluna 22 (base 0) = coluna 23 (base 1)
    mapeamento[`nomeEntrega${i + 1}`] = baseCol;      // Nome da entrega
    mapeamento[`dataEntrega${i + 1}`] = baseCol + 1;  // Data da entrega
    mapeamento[`statusEntrega${i + 1}`] = baseCol + 2; // Status da entrega
    mapeamento[`escopoEntrega${i + 1}`] = baseCol + 3; // Entregáveis da entrega
  }
  
  console.log('Mapeamento das entregas:', mapeamento);

  return mapeamento;
}

// Função para processar uma linha da planilha
function processarLinha(linha: any[], mapeamento: any, numeroLinha: number) {
  const resultado: any = {
    projeto: null,
    status: null,
    entregas: []
  };

  // Extrair dados do projeto
  const nomeProjeto = linha[mapeamento.nomeProjeto]?.toString().trim();
  
  if (nomeProjeto) {
    resultado.projeto = {
      nome_projeto: nomeProjeto,
      tipo_projeto: linha[mapeamento.tipoProjeto]?.toString().trim(),
      descricao: linha[mapeamento.descricao]?.toString().trim(),
      finalizacao_prevista: parseDataCell(linha[mapeamento.finalizacaoPrevista]),
      equipe: linha[mapeamento.equipe]?.toString().trim(),
      responsavel_asa: linha[mapeamento.responsavelAsa]?.toString().trim(),
      gp_responsavel: linha[mapeamento.chefeProjeto]?.toString().trim(),
      area_responsavel: linha[mapeamento.carteiraPrimaria]?.toString().trim(),
      carteira_secundaria: linha[mapeamento.carteiraSecundaria]?.toString().trim(),
      carteira_terciaria: linha[mapeamento.carteiraTerciaria]?.toString().trim(),
      _numeroLinha: numeroLinha,
      _erros: []
    };
  }

  // Extrair dados do status
  const dataStatus = parseDataCell(linha[mapeamento.dataStatus]);
  if (dataStatus && nomeProjeto) {
    resultado.status = {
      projeto_nome: nomeProjeto,
      data_atualizacao: dataStatus,
      status_geral: normalizeValue(linha[mapeamento.statusGeral]?.toString().trim() || ''),
      status_visao_gp: normalizeValue(linha[mapeamento.visaoChefe]?.toString().trim() || ''),
      progresso_estimado: linha[mapeamento.progresso],
      probabilidade_riscos: normalizeValue(linha[mapeamento.probabilidadeRiscos]?.toString().trim() || ''),
      impacto_riscos: normalizeValue(linha[mapeamento.impactoRiscos]?.toString().trim() || ''),
      realizado_semana_atual: linha[mapeamento.realizadoSemana]?.toString() || '', // Preserva quebras de linha
      backlog: linha[mapeamento.backlog]?.toString() || '', // Preserva quebras de linha
      bloqueios_atuais: linha[mapeamento.bloqueios]?.toString() || '', // Preserva quebras de linha
      observacoes_pontos_atencao: linha[mapeamento.observacoes]?.toString() || '', // Preserva quebras de linha
      aprovado: false,
      _numeroLinha: numeroLinha,
      _erros: []
    };
  }

  // Extrair entregas (1-15)
  for (let i = 1; i <= 15; i++) {
    const nomeEntrega = linha[mapeamento[`nomeEntrega${i}`]]?.toString().trim();
    
    // Debug para entregas
    console.log(`Entrega ${i}:`, {
      coluna: mapeamento[`nomeEntrega${i}`],
      nome: nomeEntrega,
      data: linha[mapeamento[`dataEntrega${i}`]],
      status: linha[mapeamento[`statusEntrega${i}`]],
      entregaveis: linha[mapeamento[`escopoEntrega${i}`]]
    });
    
    if (nomeEntrega) {
      resultado.entregas.push({
        projeto_nome: nomeProjeto,
        titulo: nomeEntrega,
        data_prevista: parseDataCell(linha[mapeamento[`dataEntrega${i}`]]),
        status_entrega: normalizeValue(linha[mapeamento[`statusEntrega${i}`]]?.toString().trim()),
        escopo: linha[mapeamento[`escopoEntrega${i}`]]?.toString() || '', // Preserva quebras de linha
        _numeroLinha: numeroLinha,
        _indiceEntrega: i,
        _erros: []
      });
    }
  }

  return resultado;
}

// Função para normalizar valores de dropdown (case-insensitive)
function normalizeValue(value: string, validValues?: string[]): string {
  if (!value) return '';
  
  const valueLower = value.toLowerCase().trim();
  
  // Mapeamentos específicos
  const mappings: { [key: string]: string } = {
    'no prazo': 'No Prazo',
    'em prazo': 'No Prazo',
    'verde': 'Verde',
    'amarelo': 'Amarelo',
    'vermelho': 'Vermelho',
    'em andamento': 'Em Andamento',
    'em progresso': 'Em Progresso',
    'não iniciado': 'Não Iniciado',
    'nao iniciado': 'Não Iniciado',
    'concluído': 'Concluído',
    'concluido': 'Concluído',
    'atrasado': 'Atrasado',
    'cancelado': 'Cancelado',
    'baixa': 'Baixa',
    'baixo': 'Baixo',
    'média': 'Média',
    'medio': 'Médio',
    'alta': 'Alta',
    'alto': 'Alto'
  };
  
  // Primeiro, retornar valor exato se já estiver correto
  if (value === 'No Prazo' || value === 'Verde' || value === 'Amarelo' || value === 'Vermelho' ||
      value === 'Em Andamento' || value === 'Em Progresso' || value === 'Não Iniciado' ||
      value === 'Concluído' || value === 'Atrasado' || value === 'Cancelado' ||
      value === 'Baixa' || value === 'Baixo' || value === 'Média' || value === 'Médio' ||
      value === 'Alta' || value === 'Alto') {
    return value;
  }
  
  // Primeiro, tentar mapeamento direto
  if (mappings[valueLower]) {
    return mappings[valueLower];
  }
  
  // Se há valores válidos, tentar encontrar correspondência
  if (validValues) {
    for (const validValue of validValues) {
      if (validValue.toLowerCase().trim() === valueLower) {
        return validValue;
      }
    }
  }
  
  // Retornar valor original capitalizado
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// Converte células de data (número Excel ou string) para ISO yyyy-MM-dd
function parseDataCell(cellValue: any): string | null {
  if (!cellValue) return null;

  // Se já for Date
  if (cellValue instanceof Date) {
    return cellValue.toISOString().split('T')[0];
  }

  // Se for número (serial Excel)
  if (typeof cellValue === 'number') {
    const date = XLSX.SSF.parse_date_code(cellValue);
    if (!date) return null;
    const jsDate = new Date(Date.UTC(date.y, date.m - 1, date.d));
    return jsDate.toISOString().split('T')[0];
  }

  // Se for string: tentar interpretar dd/mm/yyyy ou yyyy-mm-dd
  if (typeof cellValue === 'string') {
    const partesBarra = cellValue.split('/');
    if (partesBarra.length === 3) {
      // dd/mm/yyyy
      const [dia, mes, ano] = partesBarra;
      const jsDate = new Date(Number(ano), Number(mes) - 1, Number(dia));
      if (!isNaN(jsDate.getTime())) {
        return jsDate.toISOString().split('T')[0];
      }
    }
    // yyyy-mm-dd ou outras ISO-like
    const jsDate = new Date(cellValue);
    if (!isNaN(jsDate.getTime())) {
      return jsDate.toISOString().split('T')[0];
    }
  }

  return null;
}