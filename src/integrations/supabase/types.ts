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
      calculos_salvos: {
        Row: {
          dados_entrada_json: Json
          data_atualizacao: string
          data_criacao: string
          descricao_calculo: string | null
          id: string
          resultado_calculo_json: Json | null
          tipo_calculo: Database["public"]["Enums"]["tipo_calculo"] | null
          titulo_calculo: string
          usuario_id: string
        }
        Insert: {
          dados_entrada_json: Json
          data_atualizacao?: string
          data_criacao?: string
          descricao_calculo?: string | null
          id?: string
          resultado_calculo_json?: Json | null
          tipo_calculo?: Database["public"]["Enums"]["tipo_calculo"] | null
          titulo_calculo: string
          usuario_id: string
        }
        Update: {
          dados_entrada_json?: Json
          data_atualizacao?: string
          data_criacao?: string
          descricao_calculo?: string | null
          id?: string
          resultado_calculo_json?: Json | null
          tipo_calculo?: Database["public"]["Enums"]["tipo_calculo"] | null
          titulo_calculo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculos_salvos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      modelos_peticao: {
        Row: {
          criado_por_usuario_id: string | null
          data_atualizacao: string
          data_criacao: string
          descricao: string | null
          estrutura_template_json: Json | null
          id: string
          nome_modelo: string
          publico: boolean | null
          tags: string[] | null
          tipo_acao: string | null
        }
        Insert: {
          criado_por_usuario_id?: string | null
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          estrutura_template_json?: Json | null
          id?: string
          nome_modelo: string
          publico?: boolean | null
          tags?: string[] | null
          tipo_acao?: string | null
        }
        Update: {
          criado_por_usuario_id?: string | null
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          estrutura_template_json?: Json | null
          id?: string
          nome_modelo?: string
          publico?: boolean | null
          tags?: string[] | null
          tipo_acao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modelos_peticao_criado_por_usuario_id_fkey"
            columns: ["criado_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          email: string
          id: string
          limite_calculos_salvos: number | null
          limite_peticoes_salvas: number | null
          nome_completo: string | null
          oab: string | null
          plano_id: string | null
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          email: string
          id: string
          limite_calculos_salvos?: number | null
          limite_peticoes_salvas?: number | null
          nome_completo?: string | null
          oab?: string | null
          plano_id?: string | null
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          email?: string
          id?: string
          limite_calculos_salvos?: number | null
          limite_peticoes_salvas?: number | null
          nome_completo?: string | null
          oab?: string | null
          plano_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      peticao_calculos_associados: {
        Row: {
          calculo_id: string
          data_associacao: string
          observacoes_contextuais: string | null
          ordem_no_documento: number | null
          peticao_id: string
        }
        Insert: {
          calculo_id: string
          data_associacao?: string
          observacoes_contextuais?: string | null
          ordem_no_documento?: number | null
          peticao_id: string
        }
        Update: {
          calculo_id?: string
          data_associacao?: string
          observacoes_contextuais?: string | null
          ordem_no_documento?: number | null
          peticao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "peticao_calculos_associados_calculo_id_fkey"
            columns: ["calculo_id"]
            isOneToOne: false
            referencedRelation: "calculos_salvos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peticao_calculos_associados_peticao_id_fkey"
            columns: ["peticao_id"]
            isOneToOne: false
            referencedRelation: "peticoes_geradas"
            referencedColumns: ["id"]
          },
        ]
      }
      peticoes_geradas: {
        Row: {
          conteudo_final_gerado_html: string | null
          dados_formulario_json: Json
          data_atualizacao: string
          data_criacao: string
          id: string
          modelo_base_id: string | null
          status: Database["public"]["Enums"]["status_peticao"] | null
          tipo_peticao: string | null
          titulo_peticao: string | null
          usuario_id: string
        }
        Insert: {
          conteudo_final_gerado_html?: string | null
          dados_formulario_json: Json
          data_atualizacao?: string
          data_criacao?: string
          id?: string
          modelo_base_id?: string | null
          status?: Database["public"]["Enums"]["status_peticao"] | null
          tipo_peticao?: string | null
          titulo_peticao?: string | null
          usuario_id: string
        }
        Update: {
          conteudo_final_gerado_html?: string | null
          dados_formulario_json?: Json
          data_atualizacao?: string
          data_criacao?: string
          id?: string
          modelo_base_id?: string | null
          status?: Database["public"]["Enums"]["status_peticao"] | null
          tipo_peticao?: string | null
          titulo_peticao?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "peticoes_geradas_modelo_base_id_fkey"
            columns: ["modelo_base_id"]
            isOneToOne: false
            referencedRelation: "modelos_peticao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peticoes_geradas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          descricao: string | null
          features_json: Json | null
          id: string
          limite_calculos_config: number | null
          limite_peticoes_config: number | null
          nome_plano: string
          preco: number | null
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          features_json?: Json | null
          id: string
          limite_calculos_config?: number | null
          limite_peticoes_config?: number | null
          nome_plano: string
          preco?: number | null
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          features_json?: Json | null
          id?: string
          limite_calculos_config?: number | null
          limite_peticoes_config?: number | null
          nome_plano?: string
          preco?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_calculation_limit: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_petition_limit: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      plano_tipo: "free" | "premium_mensal" | "premium_anual"
      status_peticao: "rascunho" | "finalizada" | "arquivada"
      tipo_calculo: "rescisao" | "horas_extras" | "ferias" | "fgts" | "geral"
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
      plano_tipo: ["free", "premium_mensal", "premium_anual"],
      status_peticao: ["rascunho", "finalizada", "arquivada"],
      tipo_calculo: ["rescisao", "horas_extras", "ferias", "fgts", "geral"],
    },
  },
} as const
