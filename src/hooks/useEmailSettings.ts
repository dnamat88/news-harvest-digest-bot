
import { useState, useEffect } from 'react'
import { supabase, UserSettings, EmailHistory, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useEmailSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchSettings = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      setSettings(data)
    } catch (error: any) {
      console.error('Error fetching email settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmailHistory = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('email_history')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setEmailHistory(data || [])
    } catch (error: any) {
      console.error('Error fetching email history:', error)
    }
  }

  const saveSettings = async (newSettings: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!supabase) {
      toast({
        title: 'Errore',
        description: 'Supabase non configurato',
        variant: 'destructive'
      })
      return false
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utente non autenticato')

      if (settings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('user_settings')
          .update(newSettings)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error
        setSettings(data)
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('user_settings')
          .insert([{ ...newSettings, user_id: user.id }])
          .select()
          .single()

        if (error) throw error
        setSettings(data)
      }

      toast({
        title: 'Impostazioni salvate',
        description: 'Le impostazioni email sono state aggiornate con successo'
      })
      return true
    } catch (error: any) {
      console.error('Error saving email settings:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
      return false
    }
  }

  useEffect(() => {
    fetchSettings()
    fetchEmailHistory()
  }, [])

  return {
    settings,
    emailHistory,
    loading,
    saveSettings,
    refetch: fetchSettings,
    refetchHistory: fetchEmailHistory
  }
}
