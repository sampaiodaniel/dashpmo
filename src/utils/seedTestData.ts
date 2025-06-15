
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TipoMudanca = Database['public']['Enums']['tipo_mudanca'];

export const createTestChangeRequests = async () => {
  const testMudancas = [
    {
      descricao: 'Alteração no cronograma de entrega do módulo de autenticação',
      justificativa_negocio: 'Necessidade de adequação às novas diretrizes de segurança corporativa',
      tipo_mudanca: 'Replanejamento Cronograma' as TipoMudanca,
      impacto_prazo_dias: 15,
      solicitante: 'João Silva',
      observacoes: 'Impacto mínimo nas demais funcionalidades',
      projeto_id: 1,
      criado_por: 'João Silva'
    },
    {
      descricao: 'Inclusão de nova funcionalidade de relatórios customizados',
      justificativa_negocio: 'Demanda do cliente para relatórios específicos de performance',
      tipo_mudanca: 'Mudança Escopo' as TipoMudanca,
      impacto_prazo_dias: 30,
      solicitante: 'Maria Santos',
      observacoes: 'Requer análise de impacto técnico detalhada',
      projeto_id: 2,
      criado_por: 'Maria Santos'
    },
    {
      descricao: 'Mudança na arquitetura do banco de dados',
      justificativa_negocio: 'Otimização de performance e escalabilidade',
      tipo_mudanca: 'Novo Requisito' as TipoMudanca,
      impacto_prazo_dias: 45,
      solicitante: 'Carlos Oliveira',
      observacoes: 'Impacto significativo - requer planejamento cuidadoso',
      projeto_id: 1,
      criado_por: 'Carlos Oliveira'
    },
    {
      descricao: 'Alteração no design da interface principal',
      justificativa_negocio: 'Melhoria da experiência do usuário baseada em feedback',
      tipo_mudanca: 'Melhoria' as TipoMudanca,
      impacto_prazo_dias: 20,
      solicitante: 'Ana Costa',
      observacoes: 'Já validado com o time de UX',
      projeto_id: 3,
      criado_por: 'Ana Costa'
    },
    {
      descricao: 'Integração com sistema legado adicional',
      justificativa_negocio: 'Necessidade de compatibilidade com sistema crítico',
      tipo_mudanca: 'Novo Requisito' as TipoMudanca,
      impacto_prazo_dias: 25,
      solicitante: 'Pedro Lima',
      observacoes: 'Depende da disponibilidade do time de infraestrutura',
      projeto_id: 2,
      criado_por: 'Pedro Lima'
    },
    {
      descricao: 'Atualização dos requisitos de segurança',
      justificativa_negocio: 'Conformidade com novas normas regulatórias',
      tipo_mudanca: 'Mudança Escopo' as TipoMudanca,
      impacto_prazo_dias: 35,
      solicitante: 'Luciana Ferreira',
      observacoes: 'Requisito obrigatório - não negociável',
      projeto_id: 1,
      criado_por: 'Luciana Ferreira'
    },
    {
      descricao: 'Modificação no processo de deploy',
      justificativa_negocio: 'Redução de riscos e melhoria da qualidade',
      tipo_mudanca: 'Melhoria' as TipoMudanca,
      impacto_prazo_dias: 10,
      solicitante: 'Roberto Alves',
      observacoes: 'Mudança de baixo impacto',
      projeto_id: 3,
      criado_por: 'Roberto Alves'
    },
    {
      descricao: 'Adição de módulo de notificações em tempo real',
      justificativa_negocio: 'Melhoria na comunicação e engajamento dos usuários',
      tipo_mudanca: 'Novo Requisito' as TipoMudanca,
      impacto_prazo_dias: 40,
      solicitante: 'Fernanda Rocha',
      observacoes: 'Requer estudo de tecnologias de websocket',
      projeto_id: 2,
      criado_por: 'Fernanda Rocha'
    },
    {
      descricao: 'Revisão da estratégia de testes automatizados',
      justificativa_negocio: 'Aumento da cobertura de testes e qualidade do software',
      tipo_mudanca: 'Melhoria' as TipoMudanca,
      impacto_prazo_dias: 18,
      solicitante: 'Marcos Pereira',
      observacoes: 'Investimento necessário em ferramentas de teste',
      projeto_id: 1,
      criado_por: 'Marcos Pereira'
    },
    {
      descricao: 'Implementação de cache distribuído',
      justificativa_negocio: 'Melhoria significativa de performance do sistema',
      tipo_mudanca: 'Correção Bug' as TipoMudanca,
      impacto_prazo_dias: 28,
      solicitante: 'Juliana Mendes',
      observacoes: 'Impacto positivo em toda a aplicação',
      projeto_id: 3,
      criado_por: 'Juliana Mendes'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('mudancas_replanejamento')
      .insert(testMudancas);

    if (error) {
      console.error('Erro ao inserir mudanças de teste:', error);
      throw error;
    }

    console.log('Mudanças de teste criadas com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro ao criar mudanças de teste:', error);
    throw error;
  }
};
