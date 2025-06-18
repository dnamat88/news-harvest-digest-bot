
import { useState, useEffect } from 'react'
import { supabase, Feed, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useFeeds = () => {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchFeeds = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .order('ultimo_aggiornamento', { ascending: false, nullsFirst: false })

      if (error) throw error
      setFeeds(data || [])
    } catch (error: any) {
      console.error('Error fetching feeds:', error)
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

      const { data, error } = await supabase
        .from('feeds')
        .insert([{ 
          url, 
          nome, 
          attivo: true,
          ultimo_aggiornamento: new Date().toISOString(),
          user_id: user.id
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
      console.error('Error adding feed:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
      return false
    }
  }

  const removeFeed = async (id: string) => {
    if (!supabase) return

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
      console.error('Error removing feed:', error)
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const toggleFeed = async (id: string, attivo: boolean) => {
    if (!supabase) return

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
      console.error('Error toggling feed:', error)
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
