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
      articoli: {
        Row: {
          categoria: string | null
          data_pubblicazione: string | null
          fonte: string | null
          id: string
          link: string | null
          matched_keywords: string[] | null
          sommario: string | null
          titolo: string | null
          user_id: string | null
        }
        Insert: {
          categoria?: string | null
          data_pubblicazione?: string | null
          fonte?: string | null
          id?: string
          link?: string | null
          matched_keywords?: string[] | null
          sommario?: string | null
          titolo?: string | null
          user_id?: string | null
        }
        Update: {
          categoria?: string | null
          data_pubblicazione?: string | null
          fonte?: string | null
          id?: string
          link?: string | null
          matched_keywords?: string[] | null
          sommario?: string | null
          titolo?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_history: {
        Row: {
          articles_count: number
          created_at: string
          error_message: string | null
          id: string
          recipient_email: string
          sent_at: string
          status: string
          subject: string
        }
        Insert: {
          articles_count?: number
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          sent_at?: string
          status?: string
          subject: string
        }
        Update: {
          articles_count?: number
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          sent_at?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      execution_logs: {
        Row: {
          articles_filtered: number
          articles_found: number
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          started_at: string
          status: string
        }
        Insert: {
          articles_filtered?: number
          articles_found?: number
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          started_at?: string
          status?: string
        }
        Update: {
          articles_filtered?: number
          articles_found?: number
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      feeds: {
        Row: {
          attivo: boolean | null
          id: string
          nome: string | null
          ultimo_aggiornamento: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          attivo?: boolean | null
          id?: string
          nome?: string | null
          ultimo_aggiornamento?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          attivo?: boolean | null
          id?: string
          nome?: string | null
          ultimo_aggiornamento?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      keywords: {
        Row: {
          attiva: boolean | null
          id: string
          parola: string
          user_id: string | null
        }
        Insert: {
          attiva?: boolean | null
          id?: string
          parola: string
          user_id?: string | null
        }
        Update: {
          attiva?: boolean | null
          id?: string
          parola?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          email_address: string
          email_enabled: boolean
          email_format: string
          email_subject_template: string
          id: string
          max_articles_per_email: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_address: string
          email_enabled?: boolean
          email_format?: string
          email_subject_template?: string
          id?: string
          max_articles_per_email?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_address?: string
          email_enabled?: boolean
          email_format?: string
          email_subject_template?: string
          id?: string
          max_articles_per_email?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      utenti: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nome?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
