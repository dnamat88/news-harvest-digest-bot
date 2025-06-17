
import { useState, useEffect } from 'react'
import { supabase, Articolo, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useArticles = () => {
  const [articles, setArticles] = useState<Articolo[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchArticles = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('articoli')
        .select('*')
        .order('data_pubblicazione', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error: any) {
      console.error('Error fetching articles:', error)
      toast({
        title: 'Errore',
        description: 'Impossibile caricare gli articoli',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addArticle = async (article: Omit<Articolo, 'id' | 'user_id'>) => {
    if (!supabase) {
      toast({
        title: 'Errore',
        description: 'Supabase non configurato',
        variant: 'destructive'
      })
      return false
    }

    try {
      const { data, error } = await supabase
        .from('articoli')
        .insert([{ 
          ...article,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single()

      if (error) throw error

      setArticles(prev => [data, ...prev])
      toast({
        title: 'Articolo aggiunto',
        description: 'Il nuovo articolo è stato aggiunto con successo'
      })
      return true
    } catch (error: any) {
      console.error('Error adding article:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
      return false
    }
  }

  const updateArticle = async (id: string, updates: Partial<Articolo>) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('articoli')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setArticles(prev => prev.map(article => 
        article.id === id ? { ...article, ...updates } : article
      ))
      
      toast({
        title: 'Articolo aggiornato',
        description: 'L\'articolo è stato aggiornato con successo'
      })
    } catch (error: any) {
      console.error('Error updating article:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const deleteArticle = async (id: string) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('articoli')
        .delete()
        .eq('id', id)

      if (error) throw error

      setArticles(prev => prev.filter(article => article.id !== id))
      toast({
        title: 'Articolo eliminato',
        description: 'L\'articolo è stato eliminato'
      })
    } catch (error: any) {
      console.error('Error deleting article:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  return {
    articles,
    loading,
    addArticle,
    updateArticle,
    deleteArticle,
    refetch: fetchArticles
  }
}
