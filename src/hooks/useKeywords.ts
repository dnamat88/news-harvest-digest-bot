
import { useState, useEffect } from 'react'
import { supabase, Keyword } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useKeywords = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchKeywords = async () => {
    try {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setKeywords(data || [])
    } catch (error: any) {
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
    try {
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
        .insert([{ parola: normalizedKeyword, attiva: true }])
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
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
      return false
    }
  }

  const removeKeyword = async (id: number) => {
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
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const toggleKeyword = async (id: number, attiva: boolean) => {
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
