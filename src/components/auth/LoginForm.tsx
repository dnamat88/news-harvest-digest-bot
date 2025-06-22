
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from './AuthProvider'
import { useToast } from '@/hooks/use-toast'
import { LogIn, Mail, Lock } from 'lucide-react'
import { PasswordResetForm } from './PasswordResetForm'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  if (showPasswordReset) {
    return <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password)

    if (error) {
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive'
      })
    } else if (isSignUp) {
      toast({
        title: 'Registrazione completata',
        description: 'Controlla la tua email per confermare l\'account'
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center text-2xl">
            <LogIn className="h-6 w-6" />
            FlashBrief
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Crea il tuo account' : 'Accedi alla dashboard'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Caricamento...' : (isSignUp ? 'Registrati' : 'Accedi')}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2">
            {!isSignUp && (
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-muted-foreground"
                >
                  Hai dimenticato la password?
                </Button>
              </div>
            )}
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp 
                  ? 'Hai già un account? Accedi' 
                  : 'Non hai un account? Registrati'
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
