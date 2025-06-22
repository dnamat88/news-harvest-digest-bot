
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from './AuthProvider'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Mail } from 'lucide-react'

interface PasswordResetFormProps {
  onBack: () => void
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        toast({
          title: 'Errore',
          description: error.message || 'Errore durante l\'invio della email',
          variant: 'destructive'
        })
      } else {
        setSent(true)
        toast({
          title: 'Email inviata',
          description: 'Controlla la tua casella email per il link di reset password',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Errore durante l\'invio della email',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Email inviata!</CardTitle>
            <CardDescription>
              Controlla la tua casella email per il link di reset della password
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Inserisci la tua email per ricevere il link di reset della password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Inserisci la tua email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Invio in corso...' : 'Invia link di reset'}
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              onClick={onBack}
              className="w-full flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna al login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
