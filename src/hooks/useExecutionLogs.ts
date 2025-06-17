
import { useState, useEffect } from 'react'
import { supabase, ExecutionLog, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useExecutionLogs = () => {
  const [logs, setLogs] = useState<ExecutionLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchLogs = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('execution_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setLogs(data || [])
    } catch (error: any) {
      console.error('Error fetching execution logs:', error)
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i log delle esecuzioni',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addLog = async (log: Omit<ExecutionLog, 'id'>) => {
    if (!supabase) return false

    try {
      const { data, error } = await supabase
        .from('execution_logs')
        .insert([log])
        .select()
        .single()

      if (error) throw error

      setLogs(prev => [data, ...prev.slice(0, 9)])
      return true
    } catch (error: any) {
      console.error('Error adding execution log:', error)
      return false
    }
  }

  const updateLog = async (id: string, updates: Partial<ExecutionLog>) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('execution_logs')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setLogs(prev => prev.map(log => 
        log.id === id ? { ...log, ...updates } : log
      ))
    } catch (error: any) {
      console.error('Error updating execution log:', error)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return {
    logs,
    loading,
    addLog,
    updateLog,
    refetch: fetchLogs
  }
}
