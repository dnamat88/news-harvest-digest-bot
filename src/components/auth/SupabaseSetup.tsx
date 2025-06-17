
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, ExternalLink, Zap } from 'lucide-react'

export const SupabaseSetup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center text-3xl">
            <Database className="h-8 w-8 text-green-600" />
            RSS Banking News
          </CardTitle>
          <CardDescription className="text-lg">
            Configura Supabase per iniziare a usare la dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5" />
              Attiva l'integrazione Supabase
            </h3>
            <p className="text-blue-800 mb-4">
              Per utilizzare questa dashboard con un backend completo e gratuito, 
              devi connettere Supabase tramite l'integrazione nativa di Lovable.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>Clicca sul <strong>pulsante verde Supabase</strong> in alto a destra</li>
              <li>Connetti il tuo account Supabase (o creane uno gratuito)</li>
              <li>Autorizza l'integrazione</li>
              <li>Ricarica questa pagina</li>
            </ol>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Cosa otterrai</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Database PostgreSQL gratuito</li>
                <li>• Autenticazione sicura</li>
                <li>• API REST automatiche</li>
                <li>• Storage per file</li>
                <li>• Real-time updates</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">💰 Piano gratuito</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• 500MB database</li>
                <li>• 50.000 utenti/mese</li>
                <li>• 1GB storage file</li>
                <li>• 2M edge functions</li>
                <li>• SSL incluso</li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <Button variant="outline" className="gap-2" onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}>
              <ExternalLink className="h-4 w-4" />
              Guida all'integrazione Supabase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
