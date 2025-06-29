import { useState } from 'react';
import { toast } from './use-toast';

interface DadosImportacao {
  projetos: any[];
  status: any[];
  entregas: any[];
}

export function useImportacaoExcel() {
  const [processando, setProcessando] = useState(false);

  // Função para normalizar valores (ignorar maiúsculas/minúsculas e acentos)
  const normalizarValor = (valor: string): string => {
    return valor
      .toLowerCase()
      .trim()
      .replace(/[áàâãä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôõö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c');
  };

  // Função para encontrar valor mais próximo em uma lista
  const encontrarValorProximo = (valor: string, valoresValidos: string[]): string | null => {
    if (!valor) return null;
    
    const valorNormalizado = normalizarValor(valor);
    
    // Primeiro: busca exata
    for (const valido of valoresValidos) {
      if (normalizarValor(valido) === valorNormalizado) {
        return valido;
      }
    }
    
    // Segundo: busca por inclusão
    for (const valido of valoresValidos) {
      if (normalizarValor(valido).includes(valorNormalizado) || 
          valorNormalizado.includes(normalizarValor(valido))) {
        return valido;
      }
    }
    
    return null;
  };

  const validarDados = (dados: DadosImportacao) => {
    const erros: string[] = [];
    
    // Validar projetos
    dados.projetos.forEach((projeto, index) => {
      if (!projeto.nome_projeto?.trim()) {
        erros.push(`Linha ${projeto._numeroLinha}: Nome do projeto é obrigatório`);
        projeto._erros = projeto._erros || [];
        projeto._erros.push('Nome do projeto é obrigatório');
      }
      
      // Para projetos já existentes, não exigir campos obrigatórios que podem estar vazios na planilha
      const projetoEhNovo = !projeto._existe; // flag definida no upload

      if (projetoEhNovo && !projeto.area_responsavel?.trim()) {
        erros.push(`Linha ${projeto._numeroLinha}: Carteira primária é obrigatória`);
        projeto._erros = projeto._erros || [];
        projeto._erros.push('Carteira primária é obrigatória');
      }

      // Validar carteiras válidas
      const carteirasValidas = [
        'Cadastro', 'Canais', 'Core Bancário', 'Crédito', 'Cripto', 
        'Empréstimos', 'Fila Rápida', 'Investimentos 1', 'Investimentos 2', 
        'Onboarding', 'Open Finance'
      ];
      
      if (projeto.area_responsavel) {
        const carteiraCorrigida = encontrarValorProximo(projeto.area_responsavel, carteirasValidas);
        if (carteiraCorrigida) {
          projeto.area_responsavel = carteiraCorrigida; // Corrigir automaticamente
        } else if (projetoEhNovo) {
          erros.push(`Linha ${projeto._numeroLinha}: Carteira primária inválida: ${projeto.area_responsavel}`);
          projeto._erros = projeto._erros || [];
          projeto._erros.push(`Carteira primária inválida: ${projeto.area_responsavel}`);
        } // se existir e inválida, apenas mantemos dado atual da base
      }
    });

    // Validar status
    dados.status.forEach((status, index) => {
      if (!status.data_atualizacao) {
        erros.push(`Linha ${status._numeroLinha}: Data do status é obrigatória`);
        status._erros = status._erros || [];
        status._erros.push('Data do status é obrigatória');
      } else {
        // Tentar converter data
        const data = new Date(status.data_atualizacao);
        if (isNaN(data.getTime())) {
          erros.push(`Linha ${status._numeroLinha}: Data inválida: ${status.data_atualizacao}`);
          status._erros = status._erros || [];
          status._erros.push(`Data inválida: ${status.data_atualizacao}`);
        }
      }

      // Validar status geral
      const statusValidos = ['Verde', 'Amarelo', 'Vermelho', 'Em Andamento', 'Concluído', 'Cancelado', 'Pausado', 'Aguardando Homologação', 'Aguardando Homologacao', 'Em Especificação', 'Em Especificacao'];
      if (status.status_geral) {
        const statusCorrigido = encontrarValorProximo(status.status_geral, statusValidos);
        if (statusCorrigido) {
          status.status_geral = statusCorrigido; // Corrigir automaticamente
        } else {
          erros.push(`Linha ${status._numeroLinha}: Status geral inválido: ${status.status_geral}`);
          status._erros = status._erros || [];
          status._erros.push(`Status geral inválido: ${status.status_geral}`);
        }
      }

      // Validar visão do chefe
      const visaoValidos = ['Verde', 'Amarelo', 'Vermelho'];
      if (status.status_visao_gp) {
        const visaoCorrigida = encontrarValorProximo(status.status_visao_gp, visaoValidos);
        if (visaoCorrigida) {
          status.status_visao_gp = visaoCorrigida; // Corrigir automaticamente
        } else {
          erros.push(`Linha ${status._numeroLinha}: Visão do chefe inválida: ${status.status_visao_gp}`);
          status._erros = status._erros || [];
          status._erros.push(`Visão do chefe inválida: ${status.status_visao_gp}`);
        }
      }

      // Validar progresso
      if (status.progresso_estimado !== undefined && status.progresso_estimado !== null) {
        const progresso = Number(status.progresso_estimado);
        if (isNaN(progresso) || progresso < 0 || progresso > 100) {
          erros.push(`Linha ${status._numeroLinha}: Progresso deve ser entre 0 e 100: ${status.progresso_estimado}`);
          status._erros = status._erros || [];
          status._erros.push(`Progresso deve ser entre 0 e 100: ${status.progresso_estimado}`);
        }
      }
    });

    // Validar entregas
    dados.entregas.forEach((entrega, index) => {
      if (!entrega.titulo?.trim()) {
        erros.push(`Linha ${entrega._numeroLinha}: Nome da entrega é obrigatório`);
        entrega._erros = entrega._erros || [];
        entrega._erros.push('Nome da entrega é obrigatório');
      }

      if (entrega.data_prevista) {
        const data = new Date(entrega.data_prevista);
        if (isNaN(data.getTime())) {
          erros.push(`Linha ${entrega._numeroLinha}: Data da entrega inválida: ${entrega.data_prevista}`);
          entrega._erros = entrega._erros || [];
          entrega._erros.push(`Data da entrega inválida: ${entrega.data_prevista}`);
        }
      }

      // Validar status da entrega
      const statusEntregaValidos = ['Não Iniciado', 'Em Progresso', 'Concluído', 'Atrasado', 'Cancelado', 'No Prazo', 'Atenção'];
      if (entrega.status_entrega) {
        const statusCorrigido = encontrarValorProximo(entrega.status_entrega, statusEntregaValidos);
        if (statusCorrigido) {
          entrega.status_entrega = statusCorrigido; // Corrigir automaticamente
        } else {
          erros.push(`Linha ${entrega._numeroLinha}: Status da entrega inválido: ${entrega.status_entrega}`);
          entrega._erros = entrega._erros || [];
          entrega._erros.push(`Status da entrega inválido: ${entrega.status_entrega}`);
        }
      }
    });

    return { dadosValidados: dados, erros };
  };

  const processarArquivoExcel = async (arquivo: File): Promise<DadosImportacao | null> => {
    setProcessando(true);
    
    try {
      // O processamento do Excel será feito no componente ImportacaoUpload
      // Este hook só trata das validações
      return null;
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo Excel",
        variant: "destructive",
      });
      return null;
    } finally {
      setProcessando(false);
    }
  };

  return {
    processando,
    validarDados,
    processarArquivoExcel
  };
} 