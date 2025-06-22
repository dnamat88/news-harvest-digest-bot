
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from './AuthProvider'
import { useToast } from '@/hooks/use-toast'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface UpdatePasswordFormProps {
  onSuccess: () => void
}

export const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updatePassword } = useAuth()
  const { toast } = useToast()

  const validatePassword = (pwd: string) => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    }
    return requirements
  }

  const requirements = validatePassword(password)
  const isPasswordValid = Object.values(requirements).every(Boolean)
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPasswordValid) {
      toast({
        title: 'Password non valida',
        description: 'La password deve soddisfare tutti i requisiti di sicurezza',
        variant: 'destructive'
      })
      return
    }

    if (!doPasswordsMatch) {
      toast({
        title: 'Password non corrispondenti',
        description: 'Le password inserite non corrispondono',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await updatePassword(password)
      
      if (error) {
        toast({
          title: 'Errore',
          description: error.message || 'Errore durante l\'aggiornamento della password',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Password aggiornata',
          description: 'La tua password è stata aggiornata con successo',
        })
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'aggiornamento della password',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center text-2xl">
            <Lock className="h-6 w-6" />
            Imposta Nuova Password
          </CardTitle>
          <CardDescription>
            Crea una password sicura per il tuo account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nuova Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 pr-9"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {password && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Requisiti Password:</Label>
                <div className="space-y-1 text-sm">
                  <div className={`flex items-center gap-2 ${requirements.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <CheckCircle className={`h-3 w-3 ${requirements.length ? 'text-green-600' : 'text-muted-foreground'}`} />
                    Almeno 8 caratteri
                  </div>
                  <div className={`flex items-center gap-2 ${requirements.uppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <CheckCircle className={`h-3 w-3 ${requirements.uppercase ? 'text-green-600' : 'text-muted-foreground'}`} />
                    Una lettera maiuscola
                  </div>
                  <div className={`flex items-center gap-2 ${requirements.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <CheckCircle className={`h-3 w-3 ${requirements.lowercase ? 'text-green-600' : 'text-muted-foreground'}`} />
                    Una lettera minuscola
                  </div>
                  <div className={`flex items-center gap-2 ${requirements.number ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <CheckCircle className={`h-3 w-3 ${requirements.number ? 'text-green-600' : 'text-muted-foreground'}`} />
                    Un numero
                  </div>
                  <div className={`flex items-center gap-2 ${requirements.special ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <CheckCircle className={`h-3 w-3 ${requirements.special ? 'text-green-600' : 'text-muted-foreground'}`} />
                    Un carattere speciale
                  </div>
                </div>
              </div>
            )}

            {confirmPassword && (
              <div className={`flex items-center gap-2 text-sm ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                <CheckCircle className={`h-3 w-3 ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`} />
                {doPasswordsMatch ? 'Le password corrispondono' : 'Le password non corrispondono'}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !isPasswordValid || !doPasswordsMatch}
            >
              {loading ? 'Aggiornamento...' : 'Aggiorna Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
