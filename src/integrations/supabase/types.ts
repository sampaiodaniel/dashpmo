export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      configuracoes_sistema: {
        Row: {
          ativo: boolean | null
          criado_por: string
          data_criacao: string | null
          id: number
          ordem: number | null
          tipo: string
          valor: string
        }
        Insert: {
          ativo?: boolean | null
          criado_por: string
          data_criacao?: string | null
          id?: number
          ordem?: number | null
          tipo: string
          valor: string
        }
        Update: {
          ativo?: boolean | null
          criado_por?: string
          data_criacao?: string | null
          id?: number
          ordem?: number | null
          tipo?: string
          valor?: string
        }
        Relationships: []
      }
      dependencias: {
        Row: {
          componentes_modulos: string | null
          criado_por: string
          criterio_pronto: string | null
          data_criacao: string | null
          dependencias_prerequisitos: string | null
          id: number
          outras_partes_workstreams: string | null
          projeto_id: number | null
        }
        Insert: {
          componentes_modulos?: string | null
          criado_por: string
          criterio_pronto?: string | null
          data_criacao?: string | null
          dependencias_prerequisitos?: string | null
          id?: number
          outras_partes_workstreams?: string | null
          projeto_id?: number | null
        }
        Update: {
          componentes_modulos?: string | null
          criado_por?: string
          criterio_pronto?: string | null
          data_criacao?: string | null
          dependencias_prerequisitos?: string | null
          id?: number
          outras_partes_workstreams?: string | null
          projeto_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dependencias_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      entregas_status: {
        Row: {
          data_criacao: string | null
          data_entrega: string | null
          entregaveis: string | null
          id: number
          nome_entrega: string
          ordem: number
          status_da_entrega: string
          status_entrega_id: number | null
          status_id: number
        }
        Insert: {
          data_criacao?: string | null
          data_entrega?: string | null
          entregaveis?: string | null
          id?: number
          nome_entrega: string
          ordem?: number
          status_da_entrega: string
          status_entrega_id?: number | null
          status_id: number
        }
        Update: {
          data_criacao?: string | null
          data_entrega?: string | null
          entregaveis?: string | null
          id?: number
          nome_entrega?: string
          ordem?: number
          status_da_entrega?: string
          status_entrega_id?: number | null
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "entregas_status_status_entrega_id_fkey"
            columns: ["status_entrega_id"]
            isOneToOne: false
            referencedRelation: "tipos_status_entrega"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_status_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "status_projeto"
            referencedColumns: ["id"]
          },
        ]
      }
      incidentes: {
        Row: {
          anterior: number | null
          atual: number | null
          carteira: string
          criado_por: string
          criticos: number | null
          data_registro: string | null
          entrada: number | null
          id: number
          mais_15_dias: number | null
          saida: number | null
        }
        Insert: {
          anterior?: number | null
          atual?: number | null
          carteira?: string
          criado_por: string
          criticos?: number | null
          data_registro?: string | null
          entrada?: number | null
          id?: number
          mais_15_dias?: number | null
          saida?: number | null
        }
        Update: {
          anterior?: number | null
          atual?: number | null
          carteira?: string
          criado_por?: string
          criticos?: number | null
          data_registro?: string | null
          entrada?: number | null
          id?: number
          mais_15_dias?: number | null
          saida?: number | null
        }
        Relationships: []
      }
      licoes_aprendidas: {
        Row: {
          acao_recomendada: string
          categoria_licao: Database["public"]["Enums"]["categoria_licao"]
          criado_por: string
          data_criacao: string | null
          data_registro: string | null
          id: number
          impacto_gerado: string
          licao_aprendida: string
          projeto_id: number | null
          responsavel_registro: string
          situacao_ocorrida: string
          status_aplicacao:
            | Database["public"]["Enums"]["status_aplicacao"]
            | null
          tags_busca: string | null
        }
        Insert: {
          acao_recomendada: string
          categoria_licao: Database["public"]["Enums"]["categoria_licao"]
          criado_por: string
          data_criacao?: string | null
          data_registro?: string | null
          id?: number
          impacto_gerado: string
          licao_aprendida: string
          projeto_id?: number | null
          responsavel_registro: string
          situacao_ocorrida: string
          status_aplicacao?:
            | Database["public"]["Enums"]["status_aplicacao"]
            | null
          tags_busca?: string | null
        }
        Update: {
          acao_recomendada?: string
          categoria_licao?: Database["public"]["Enums"]["categoria_licao"]
          criado_por?: string
          data_criacao?: string | null
          data_registro?: string | null
          id?: number
          impacto_gerado?: string
          licao_aprendida?: string
          projeto_id?: number | null
          responsavel_registro?: string
          situacao_ocorrida?: string
          status_aplicacao?:
            | Database["public"]["Enums"]["status_aplicacao"]
            | null
          tags_busca?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licoes_aprendidas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_alteracoes: {
        Row: {
          acao: string
          data_criacao: string
          detalhes_alteracao: Json | null
          entidade_id: number | null
          entidade_nome: string | null
          entidade_tipo: string
          id: number
          ip_usuario: unknown | null
          modulo: string
          user_agent: string | null
          usuario_id: number
          usuario_nome: string
        }
        Insert: {
          acao: string
          data_criacao?: string
          detalhes_alteracao?: Json | null
          entidade_id?: number | null
          entidade_nome?: string | null
          entidade_tipo: string
          id?: number
          ip_usuario?: unknown | null
          modulo: string
          user_agent?: string | null
          usuario_id: number
          usuario_nome: string
        }
        Update: {
          acao?: string
          data_criacao?: string
          detalhes_alteracao?: Json | null
          entidade_id?: number | null
          entidade_nome?: string | null
          entidade_tipo?: string
          id?: number
          ip_usuario?: unknown | null
          modulo?: string
          user_agent?: string | null
          usuario_id?: number
          usuario_nome?: string
        }
        Relationships: []
      }
      mudancas_replanejamento: {
        Row: {
          criado_por: string
          data_aprovacao: string | null
          data_criacao: string | null
          data_solicitacao: string | null
          descricao: string
          id: number
          impacto_prazo_dias: number
          justificativa_negocio: string
          observacoes: string | null
          projeto_id: number | null
          responsavel_aprovacao: string | null
          solicitante: string
          status_aprovacao:
            | Database["public"]["Enums"]["status_aprovacao"]
            | null
          tipo_mudanca: Database["public"]["Enums"]["tipo_mudanca"]
        }
        Insert: {
          criado_por: string
          data_aprovacao?: string | null
          data_criacao?: string | null
          data_solicitacao?: string | null
          descricao: string
          id?: number
          impacto_prazo_dias: number
          justificativa_negocio: string
          observacoes?: string | null
          projeto_id?: number | null
          responsavel_aprovacao?: string | null
          solicitante: string
          status_aprovacao?:
            | Database["public"]["Enums"]["status_aprovacao"]
            | null
          tipo_mudanca: Database["public"]["Enums"]["tipo_mudanca"]
        }
        Update: {
          criado_por?: string
          data_aprovacao?: string | null
          data_criacao?: string | null
          data_solicitacao?: string | null
          descricao?: string
          id?: number
          impacto_prazo_dias?: number
          justificativa_negocio?: string
          observacoes?: string | null
          projeto_id?: number | null
          responsavel_aprovacao?: string | null
          solicitante?: string
          status_aprovacao?:
            | Database["public"]["Enums"]["status_aprovacao"]
            | null
          tipo_mudanca?: Database["public"]["Enums"]["tipo_mudanca"]
        }
        Relationships: [
          {
            foreignKeyName: "mudancas_replanejamento_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes_lidas: {
        Row: {
          data_leitura: string
          id: number
          status_id: number
          usuario_id: number
        }
        Insert: {
          data_leitura?: string
          id?: number
          status_id: number
          usuario_id: number
        }
        Update: {
          data_leitura?: string
          id?: number
          status_id?: number
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_lidas_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "status_projeto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_lidas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_usuario: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          foto_url: string | null
          id: number
          nome: string | null
          sobrenome: string | null
          usuario_id: number
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          foto_url?: string | null
          id?: number
          nome?: string | null
          sobrenome?: string | null
          usuario_id: number
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          foto_url?: string | null
          id?: number
          nome?: string | null
          sobrenome?: string | null
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "perfis_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos: {
        Row: {
          area_responsavel:
            | Database["public"]["Enums"]["area_responsavel"]
            | null
          carteira_primaria: string | null
          carteira_secundaria: string | null
          carteira_terciaria: string | null
          criado_por: string
          data_criacao: string | null
          descricao: string | null
          descricao_projeto: string | null
          equipe: string | null
          finalizacao_prevista: string | null
          gp_responsavel: string
          gp_responsavel_cwi: string | null
          id: number
          nome_projeto: string
          responsavel_asa: string | null
          responsavel_cwi: string | null
          responsavel_interno: string
          status_ativo: boolean | null
          tipo_projeto_id: number | null
        }
        Insert: {
          area_responsavel?:
            | Database["public"]["Enums"]["area_responsavel"]
            | null
          carteira_primaria?: string | null
          carteira_secundaria?: string | null
          carteira_terciaria?: string | null
          criado_por: string
          data_criacao?: string | null
          descricao?: string | null
          descricao_projeto?: string | null
          equipe?: string | null
          finalizacao_prevista?: string | null
          gp_responsavel: string
          gp_responsavel_cwi?: string | null
          id?: number
          nome_projeto: string
          responsavel_asa?: string | null
          responsavel_cwi?: string | null
          responsavel_interno: string
          status_ativo?: boolean | null
          tipo_projeto_id?: number | null
        }
        Update: {
          area_responsavel?:
            | Database["public"]["Enums"]["area_responsavel"]
            | null
          carteira_primaria?: string | null
          carteira_secundaria?: string | null
          carteira_terciaria?: string | null
          criado_por?: string
          data_criacao?: string | null
          descricao?: string | null
          descricao_projeto?: string | null
          equipe?: string | null
          finalizacao_prevista?: string | null
          gp_responsavel?: string
          gp_responsavel_cwi?: string | null
          id?: number
          nome_projeto?: string
          responsavel_asa?: string | null
          responsavel_cwi?: string | null
          responsavel_interno?: string
          status_ativo?: boolean | null
          tipo_projeto_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projetos_tipo_projeto"
            columns: ["tipo_projeto_id"]
            isOneToOne: false
            referencedRelation: "tipos_projeto"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_usuario: {
        Row: {
          acessos: number | null
          compartilhado: boolean | null
          compartilhado_com: string[] | null
          criado_em: string
          dados: Json
          descricao: string | null
          expira_em: string | null
          id: string
          protegido_por_senha: boolean | null
          senha_hash: string | null
          tipo: string
          titulo: string
          ultimo_acesso: string | null
          usuario_id: string
        }
        Insert: {
          acessos?: number | null
          compartilhado?: boolean | null
          compartilhado_com?: string[] | null
          criado_em?: string
          dados: Json
          descricao?: string | null
          expira_em?: string | null
          id?: string
          protegido_por_senha?: boolean | null
          senha_hash?: string | null
          tipo: string
          titulo: string
          ultimo_acesso?: string | null
          usuario_id: string
        }
        Update: {
          acessos?: number | null
          compartilhado?: boolean | null
          compartilhado_com?: string[] | null
          criado_em?: string
          dados?: Json
          descricao?: string | null
          expira_em?: string | null
          id?: string
          protegido_por_senha?: boolean | null
          senha_hash?: string | null
          tipo?: string
          titulo?: string
          ultimo_acesso?: string | null
          usuario_id?: string
        }
        Relationships: []
      }
      responsaveis_asa: {
        Row: {
          ativo: boolean | null
          carteiras: string[] | null
          criado_por: string
          data_criacao: string | null
          head_id: number | null
          id: number
          nivel: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          carteiras?: string[] | null
          criado_por: string
          data_criacao?: string | null
          head_id?: number | null
          id?: number
          nivel: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          carteiras?: string[] | null
          criado_por?: string
          data_criacao?: string | null
          head_id?: number | null
          id?: number
          nivel?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "responsaveis_asa_head_id_fkey"
            columns: ["head_id"]
            isOneToOne: false
            referencedRelation: "responsaveis_asa"
            referencedColumns: ["id"]
          },
        ]
      }
      status_projeto: {
        Row: {
          aprovado: boolean | null
          aprovado_por: string | null
          backlog: string | null
          bloqueios_atuais: string | null
          carteira_primaria: string | null
          carteira_secundaria: string | null
          carteira_terciaria: string | null
          criado_por: string
          data_aprovacao: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          data_marco1: string | null
          data_marco2: string | null
          data_marco3: string | null
          entrega1: string | null
          entrega2: string | null
          entrega3: string | null
          entregaveis1: string | null
          entregaveis2: string | null
          entregaveis3: string | null
          gp_responsavel_cwi: string | null
          id: number
          impacto_riscos: Database["public"]["Enums"]["nivel_risco"]
          observacoes_pontos_atencao: string | null
          prob_x_impact: string | null
          probabilidade_riscos: Database["public"]["Enums"]["nivel_risco"]
          progresso_estimado: number | null
          projeto_id: number | null
          realizado_semana_atual: string | null
          responsavel_asa: string | null
          responsavel_cwi: string | null
          status_entrega1_id: number | null
          status_entrega2_id: number | null
          status_entrega3_id: number | null
          status_geral: Database["public"]["Enums"]["status_geral"]
          status_visao_gp: Database["public"]["Enums"]["status_visao_gp"]
        }
        Insert: {
          aprovado?: boolean | null
          aprovado_por?: string | null
          backlog?: string | null
          bloqueios_atuais?: string | null
          carteira_primaria?: string | null
          carteira_secundaria?: string | null
          carteira_terciaria?: string | null
          criado_por: string
          data_aprovacao?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_marco1?: string | null
          data_marco2?: string | null
          data_marco3?: string | null
          entrega1?: string | null
          entrega2?: string | null
          entrega3?: string | null
          entregaveis1?: string | null
          entregaveis2?: string | null
          entregaveis3?: string | null
          gp_responsavel_cwi?: string | null
          id?: number
          impacto_riscos: Database["public"]["Enums"]["nivel_risco"]
          observacoes_pontos_atencao?: string | null
          prob_x_impact?: string | null
          probabilidade_riscos: Database["public"]["Enums"]["nivel_risco"]
          progresso_estimado?: number | null
          projeto_id?: number | null
          realizado_semana_atual?: string | null
          responsavel_asa?: string | null
          responsavel_cwi?: string | null
          status_entrega1_id?: number | null
          status_entrega2_id?: number | null
          status_entrega3_id?: number | null
          status_geral: Database["public"]["Enums"]["status_geral"]
          status_visao_gp: Database["public"]["Enums"]["status_visao_gp"]
        }
        Update: {
          aprovado?: boolean | null
          aprovado_por?: string | null
          backlog?: string | null
          bloqueios_atuais?: string | null
          carteira_primaria?: string | null
          carteira_secundaria?: string | null
          carteira_terciaria?: string | null
          criado_por?: string
          data_aprovacao?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_marco1?: string | null
          data_marco2?: string | null
          data_marco3?: string | null
          entrega1?: string | null
          entrega2?: string | null
          entrega3?: string | null
          entregaveis1?: string | null
          entregaveis2?: string | null
          entregaveis3?: string | null
          gp_responsavel_cwi?: string | null
          id?: number
          impacto_riscos?: Database["public"]["Enums"]["nivel_risco"]
          observacoes_pontos_atencao?: string | null
          prob_x_impact?: string | null
          probabilidade_riscos?: Database["public"]["Enums"]["nivel_risco"]
          progresso_estimado?: number | null
          projeto_id?: number | null
          realizado_semana_atual?: string | null
          responsavel_asa?: string | null
          responsavel_cwi?: string | null
          status_entrega1_id?: number | null
          status_entrega2_id?: number | null
          status_entrega3_id?: number | null
          status_geral?: Database["public"]["Enums"]["status_geral"]
          status_visao_gp?: Database["public"]["Enums"]["status_visao_gp"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_status_projeto_projeto"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_projeto_status_entrega1_id_fkey"
            columns: ["status_entrega1_id"]
            isOneToOne: false
            referencedRelation: "tipos_status_entrega"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_projeto_status_entrega2_id_fkey"
            columns: ["status_entrega2_id"]
            isOneToOne: false
            referencedRelation: "tipos_status_entrega"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_projeto_status_entrega3_id_fkey"
            columns: ["status_entrega3_id"]
            isOneToOne: false
            referencedRelation: "tipos_status_entrega"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_projeto: {
        Row: {
          ativo: boolean | null
          criado_por: string
          data_criacao: string | null
          descricao: string | null
          id: number
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          criado_por: string
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          criado_por?: string
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      tipos_status_entrega: {
        Row: {
          cor: string
          criado_em: string
          criado_por: string | null
          descricao: string | null
          id: number
          nome: string
          ordem: number
        }
        Insert: {
          cor?: string
          criado_em?: string
          criado_por?: string | null
          descricao?: string | null
          id?: number
          nome: string
          ordem: number
        }
        Update: {
          cor?: string
          criado_em?: string
          criado_por?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          areas_acesso: string[] | null
          areas_atuacao: string[] | null
          ativo: boolean | null
          data_criacao: string | null
          email: string
          id: number
          nome: string
          senha_hash: string
          senha_padrao: boolean | null
          sobrenome: string | null
          tipo_usuario: Database["public"]["Enums"]["tipo_usuario"]
          ultimo_login: string | null
        }
        Insert: {
          areas_acesso?: string[] | null
          areas_atuacao?: string[] | null
          ativo?: boolean | null
          data_criacao?: string | null
          email: string
          id?: number
          nome: string
          senha_hash: string
          senha_padrao?: boolean | null
          sobrenome?: string | null
          tipo_usuario: Database["public"]["Enums"]["tipo_usuario"]
          ultimo_login?: string | null
        }
        Update: {
          areas_acesso?: string[] | null
          areas_atuacao?: string[] | null
          ativo?: boolean | null
          data_criacao?: string | null
          email?: string
          id?: number
          nome?: string
          senha_hash?: string
          senha_padrao?: boolean | null
          sobrenome?: string | null
          tipo_usuario?: Database["public"]["Enums"]["tipo_usuario"]
          ultimo_login?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_prob_x_impact: {
        Args: {
          probabilidade: Database["public"]["Enums"]["nivel_risco"]
          impacto: Database["public"]["Enums"]["nivel_risco"]
        }
        Returns: string
      }
      is_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      registrar_log_alteracao: {
        Args: {
          p_usuario_id: number
          p_usuario_nome: string
          p_modulo: string
          p_acao: string
          p_entidade_tipo: string
          p_entidade_id?: number
          p_entidade_nome?: string
          p_detalhes_alteracao?: Json
          p_ip_usuario?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      area_responsavel:
        | "Cadastro"
        | "Canais"
        | "Core Bancário"
        | "Crédito"
        | "Cripto"
        | "Empréstimos"
        | "Fila Rápida"
        | "Investimentos 1"
        | "Investimentos 2"
        | "Onboarding"
        | "Open Finance"
      categoria_licao:
        | "Técnica"
        | "Processo"
        | "Comunicação"
        | "Recursos"
        | "Planejamento"
        | "Qualidade"
        | "Fornecedores"
        | "Riscos"
        | "Mudanças"
        | "Conhecimento"
      nivel_risco: "Baixo" | "Médio" | "Alto"
      status_aplicacao: "Aplicada" | "Não aplicada"
      status_aprovacao: "Aprovada" | "Em Análise" | "Rejeitada" | "Pendente"
      status_geral:
        | "Aguardando Aprovação"
        | "Aguardando Homologação"
        | "Cancelado"
        | "Concluído"
        | "Em Andamento"
        | "Em Especificação"
        | "Pausado"
        | "Planejamento"
      status_visao_gp: "Verde" | "Amarelo" | "Vermelho"
      tipo_mudanca:
        | "Correção Bug"
        | "Melhoria"
        | "Mudança Escopo"
        | "Novo Requisito"
        | "Replanejamento Cronograma"
      tipo_usuario:
        | "GP"
        | "Responsavel"
        | "Admin"
        | "Administrador"
        | "Aprovador"
        | "Editor"
        | "Leitor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      area_responsavel: [
        "Cadastro",
        "Canais",
        "Core Bancário",
        "Crédito",
        "Cripto",
        "Empréstimos",
        "Fila Rápida",
        "Investimentos 1",
        "Investimentos 2",
        "Onboarding",
        "Open Finance",
      ],
      categoria_licao: [
        "Técnica",
        "Processo",
        "Comunicação",
        "Recursos",
        "Planejamento",
        "Qualidade",
        "Fornecedores",
        "Riscos",
        "Mudanças",
        "Conhecimento",
      ],
      nivel_risco: ["Baixo", "Médio", "Alto"],
      status_aplicacao: ["Aplicada", "Não aplicada"],
      status_aprovacao: ["Aprovada", "Em Análise", "Rejeitada", "Pendente"],
      status_geral: [
        "Aguardando Aprovação",
        "Aguardando Homologação",
        "Cancelado",
        "Concluído",
        "Em Andamento",
        "Em Especificação",
        "Pausado",
        "Planejamento",
      ],
      status_visao_gp: ["Verde", "Amarelo", "Vermelho"],
      tipo_mudanca: [
        "Correção Bug",
        "Melhoria",
        "Mudança Escopo",
        "Novo Requisito",
        "Replanejamento Cronograma",
      ],
      tipo_usuario: [
        "GP",
        "Responsavel",
        "Admin",
        "Administrador",
        "Aprovador",
        "Editor",
        "Leitor",
      ],
    },
  },
} as const
