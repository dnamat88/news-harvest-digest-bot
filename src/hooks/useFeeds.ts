
import { useState, useEffect } from 'react'
import { supabase, Feed } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useFeeds = () => {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchFeeds = async () => {
    try {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeeds(data || [])
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i feed RSS',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addFeed = async (url: string, nome: string) => {
    try {
      const { data, error } = await supabase
        .from('feeds')
        .insert([{ 
          url, 
          nome, 
          attivo: true,
          ultimo_aggiornamento: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      setFeeds(prev => [data, ...prev])
      toast({
        title: 'Feed aggiunto',
        description: 'Il nuovo feed RSS è stato aggiunto con successo'
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

  const removeFeed = async (id: number) => {
    try {
      const { error } = await supabase
        .from('feeds')
        .delete()
        .eq('id', id)

      if (error) throw error

      setFeeds(prev => prev.filter(feed => feed.id !== id))
      toast({
        title: 'Feed rimosso',
        description: 'Il feed RSS è stato rimosso'
      })
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const toggleFeed = async (id: number, attivo: boolean) => {
    try {
      const { error } = await supabase
        .from('feeds')
        .update({ attivo })
        .eq('id', id)

      if (error) throw error

      setFeeds(prev => prev.map(feed => 
        feed.id === id ? { ...feed, attivo } : feed
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
    fetchFeeds()
  }, [])

  return {
    feeds,
    loading,
    addFeed,
    removeFeed,
    toggleFeed,
    refetch: fetchFeeds
  }
}
