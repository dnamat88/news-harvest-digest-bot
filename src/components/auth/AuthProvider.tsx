
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured || !supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [configured])

  const getRedirectUrl = () => {
    // For GitHub Pages, use the full GitHub Pages URL
    const currentUrl = window.location.origin
    if (currentUrl.includes('github.io')) {
      return `${currentUrl}/news-harvest-digest-bot/`
    }
    return `${currentUrl}/`
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }
    
    const redirectUrl = getRedirectUrl()
    console.log('Using redirect URL:', redirectUrl)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    })
    return { error }
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }
    
    const redirectUrl = getRedirectUrl() + '?reset=true'
    console.log('Using password reset redirect URL:', redirectUrl)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    })
    return { error }
  }

  const updatePassword = async (password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }
    
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    return { error }
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  const value = {
    user,
    session,
    loading,
    isConfigured: configured,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
