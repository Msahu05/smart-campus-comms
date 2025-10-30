export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chats: {
        Row: {
          created_at: string | null
          id: string
          message: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          college: string | null
          created_at: string | null
          department: string | null
          end_time: string
          id: string
          notes: string | null
          professor_id: string
          start_time: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          college?: string | null
          created_at?: string | null
          department?: string | null
          end_time: string
          id?: string
          notes?: string | null
          professor_id: string
          start_time: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          college?: string | null
          created_at?: string | null
          department?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          professor_id?: string
          start_time?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      office_hours: {
        Row: {
          college: string | null
          created_at: string | null
          day_of_week: string
          department: string | null
          end_time: string
          id: string
          is_available: boolean | null
          professor_id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          college?: string | null
          created_at?: string | null
          day_of_week: string
          department?: string | null
          end_time: string
          id?: string
          is_available?: boolean | null
          professor_id: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          college?: string | null
          created_at?: string | null
          day_of_week?: string
          department?: string | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          professor_id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      professor_registration_keys: {
        Row: {
          college: string
          created_at: string
          created_by: string
          department: string | null
          expires_at: string
          id: string
          is_used: boolean
          registration_key: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          college: string
          created_at?: string
          created_by: string
          department?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean
          registration_key: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          college?: string
          created_at?: string
          created_by?: string
          department?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean
          registration_key?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      professor_reputation: {
        Row: {
          appointments_completed: number
          avg_response_time_hours: number | null
          created_at: string
          credit_score: number
          id: string
          last_active_at: string | null
          professor_id: string
          queries_resolved: number
          reputation_badge: string | null
          student_rating_avg: number | null
          total_appointments: number
          total_queries_received: number
          updated_at: string
        }
        Insert: {
          appointments_completed?: number
          avg_response_time_hours?: number | null
          created_at?: string
          credit_score?: number
          id?: string
          last_active_at?: string | null
          professor_id: string
          queries_resolved?: number
          reputation_badge?: string | null
          student_rating_avg?: number | null
          total_appointments?: number
          total_queries_received?: number
          updated_at?: string
        }
        Update: {
          appointments_completed?: number
          avg_response_time_hours?: number | null
          created_at?: string
          credit_score?: number
          id?: string
          last_active_at?: string | null
          professor_id?: string
          queries_resolved?: number
          reputation_badge?: string | null
          student_rating_avg?: number | null
          total_appointments?: number
          total_queries_received?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          college: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          roll_number: string | null
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          college?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          roll_number?: string | null
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          college?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          roll_number?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      queries: {
        Row: {
          college: string | null
          created_at: string | null
          department: string | null
          id: string
          professor_id: string
          question: string
          response: string | null
          status: string | null
          student_id: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          college?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          professor_id: string
          question: string
          response?: string | null
          status?: string | null
          student_id: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          college?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          professor_id?: string
          question?: string
          response?: string | null
          status?: string | null
          student_id?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      query_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          query_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          query_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          query_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "query_attachments_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "queries"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          allow_student_cancellation: boolean
          college: string
          created_at: string
          enable_ai_assistant: boolean
          enable_realtime_notifications: boolean
          id: string
          max_appointments_per_day: number
          updated_at: string
        }
        Insert: {
          allow_student_cancellation?: boolean
          college: string
          created_at?: string
          enable_ai_assistant?: boolean
          enable_realtime_notifications?: boolean
          id?: string
          max_appointments_per_day?: number
          updated_at?: string
        }
        Update: {
          allow_student_cancellation?: boolean
          college?: string
          created_at?: string
          enable_ai_assistant?: boolean
          enable_realtime_notifications?: boolean
          id?: string
          max_appointments_per_day?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_reputation_badge: { Args: { score: number }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "professor" | "hod"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "professor", "hod"],
    },
  },
} as const
