
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://iuurmnaydoftequcoaep.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dXJtbmF5ZG9mdGVxdWNvYWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzEyNjcsImV4cCI6MjA2NTY0NzI2N30.-to1M2byRCASXf_IYQfpVRetvuqp3SNrMPL_ONqKOVA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database types aggiornati per corrispondere alle tabelle
export interface Feed {
  id: string
  url: string
  nome: string
  attivo: boolean
  ultimo_aggiornamento: string
  user_id: string
}

export interface Keyword {
  id: string
  parola: string
  attiva: boolean
  user_id: string
}

export interface Articolo {
  id: string
  titolo: string
  link: string
  data_pubblicazione: string
  fonte: string
  sommario: string
  categoria: string
  matched_keywords: string[]
  user_id: string
}

export interface ExecutionLog {
  id: string
  started_at: string
  completed_at: string | null
  status: 'running' | 'completed' | 'error'
  articles_found: number
  articles_filtered: number
  error_message: string | null
}

export interface EmailHistory {
  id: string
  sent_at: string
  recipient_email: string
  subject: string
  articles_count: number
  status: 'sent' | 'failed'
  error_message: string | null
}

export interface UserSettings {
  id: string
  user_id: string
  email_enabled: boolean
  email_address: string
  max_articles_per_email: number
  email_subject_template: string
  email_format: 'html' | 'text'
  created_at: string
  updated_at: string
}
