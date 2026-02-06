/**
 * Database types for Supabase tables.
 * These types mirror the database schema defined in
 * supabase/migrations/0001_init_tables_and_rls.sql
 *
 * For auto-generation, run: npx supabase gen types typescript --local
 */

export interface Database {
  public: {
    Tables: {
      trades: {
        Row: {
          id: string
          name: string
          company: string | null
          business_type: string
          email: string
          phone: string | null
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          name: string
          company?: string | null
          business_type: string
          email: string
          phone?: string | null
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string | null
          business_type?: string
          email?: string
          phone?: string | null
          created_at?: string
          status?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          product_interest: string | null
          room_type: string | null
          area: string | null
          budget: string | null
          message: string | null
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          product_interest?: string | null
          room_type?: string | null
          area?: string | null
          budget?: string | null
          message?: string | null
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          product_interest?: string | null
          room_type?: string | null
          area?: string | null
          budget?: string | null
          message?: string | null
          created_at?: string
          status?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
