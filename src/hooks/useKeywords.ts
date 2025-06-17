
import { useState, useEffect } from 'react'
import { supabase, Keyword, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useKeywords = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchKeywords = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .order('parola', { ascending: true })

      if (error) throw error
      setKeywords(data || [])
    } catch (error: any) {
      console.error('Error fetching keywords:', error)
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le keywords',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addKeyword = async (parola: string) => {
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

      const normalizedKeyword = parola.toLowerCase().trim()
      
      // Check if keyword already exists
      const exists = keywords.some(k => k.parola.toLowerCase() === normalizedKeyword)
      if (exists) {
        toast({
          title: 'Errore',
          description: 'Questa keyword esiste già',
          variant: 'destructive'
        })
        return false
      }

      const { data, error } = await supabase
        .from('keywords')
        .insert([{ 
          parola: normalizedKeyword, 
          attiva: true, 
          user_id: user.id 
        }])
        .select()
        .single()

      if (error) throw error

      setKeywords(prev => [data, ...prev])
      toast({
        title: 'Keyword aggiunta',
        description: `"${parola}" è stata aggiunta alla lista`
      })
      return true
    } catch (error: any) {
      console.error('Error adding keyword:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
      return false
    }
  }

  const removeKeyword = async (id: string) => {
    if (!supabase) return

    try {
      const keyword = keywords.find(k => k.id === id)
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id)

      if (error) throw error

      setKeywords(prev => prev.filter(k => k.id !== id))
      toast({
        title: 'Keyword rimossa',
        description: `"${keyword?.parola}" è stata rimossa dalla lista`
      })
    } catch (error: any) {
      console.error('Error removing keyword:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const toggleKeyword = async (id: string, attiva: boolean) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('keywords')
        .update({ attiva })
        .eq('id', id)

      if (error) throw error

      setKeywords(prev => prev.map(keyword => 
        keyword.id === id ? { ...keyword, attiva } : keyword
      ))
    } catch (error: any) {
      console.error('Error toggling keyword:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchKeywords()
  }, [])

  return {
    keywords,
    loading,
    addKeyword,
    removeKeyword,
    toggleKeyword,
    refetch: fetchKeywords
  }
}
