
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Feed {
  id: number
  url: string
  nome: string
  attivo: boolean
  ultimo_aggiornamento: string
  created_at: string
}

export interface Keyword {
  id: number
  parola: string
  attiva: boolean
  created_at: string
}

export interface Articolo {
  id: number
  titolo: string
  link: string
  data_pubblicazione: string
  fonte: string
  sommario: string
  categoria: string
  matched_keywords: string[]
  feed_id: number
  created_at: string
}

export interface ExecutionLog {
  id: number
  started_at: string
  completed_at: string | null
  status: 'running' | 'completed' | 'error'
  articles_found: number
  articles_filtered: number
  error_message: string | null
}
